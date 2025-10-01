import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AyahChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ayahText: string;
  ayahNumber: number;
  surahName: string;
}

const AyahChatDialog: React.FC<AyahChatDialogProps> = ({
  open,
  onOpenChange,
  ayahText,
  ayahNumber,
  surahName,
}) => {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && !conversationId) {
      createConversation();
    }
  }, [open]);

  const createConversation = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: session.user.id,
        title: `${surahName} - Ayah ${ayahNumber}`,
      })
      .select()
      .single();

    if (data && !error) {
      setConversationId(data.id);
    }
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!conversationId) return;

    await supabase.from('ai_messages').insert({
      conversation_id: conversationId,
      role,
      content,
      ayah_context: role === 'user' ? `${surahName} - Ayah ${ayahNumber}: ${ayahText}` : null,
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await saveMessage('user', input);

    try {
      const ayahContext = `Surah: ${surahName}, Ayah ${ayahNumber}\nArabic: ${ayahText}`;
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ayah-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage),
          ayahContext,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantMessage += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = assistantMessage;
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      await saveMessage('assistant', assistantMessage);
    } catch (error) {
      console.error('Error:', error);
      toast.error(settings.language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{settings.language === 'ar' ? 'اسأل عن الآية' : 'Ask About This Ayah'}</span>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="glass-effect rounded-2xl p-4 mb-4">
          <p className={`text-lg ${settings.fontType === 'quran' ? 'quran-font' : ''}`} dir="rtl">
            {ayahText}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {surahName} - {settings.language === 'ar' ? 'الآية' : 'Ayah'} {ayahNumber}
          </p>
        </div>

        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'glass-effect'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="glass-effect rounded-2xl px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={settings.language === 'ar' ? 'اكتب سؤالك...' : 'Type your question...'}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AyahChatDialog;
