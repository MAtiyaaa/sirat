import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Loader2, Trash2, Plus, History } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

const Qalam = () => {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Save current state to sessionStorage
  useEffect(() => {
    if (messages.length > 0 || conversationId) {
      sessionStorage.setItem('qalam_state', JSON.stringify({
        messages,
        conversationId
      }));
    }
  }, [messages, conversationId]);

  // Load user and conversation
  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      // Try to restore from sessionStorage first
      const savedState = sessionStorage.getItem('qalam_state');
      if (savedState) {
        try {
          const { messages: savedMessages, conversationId: savedConvId } = JSON.parse(savedState);
          if (savedMessages && savedMessages.length > 0) {
            setMessages(savedMessages);
            setConversationId(savedConvId);
            return; // Use saved state, don't load from DB
          }
        } catch (e) {
          console.error('Error restoring chat state:', e);
        }
      }
      
      if (session?.user) {
        // Load most recent general AI conversation (not ayah-specific)
        const { data: conversations } = await supabase
          .from('ai_conversations')
          .select('*')
          .eq('user_id', session.user.id)
          .is('ayah_reference', null)
          .order('updated_at', { ascending: false })
          .limit(1);
        
        if (conversations && conversations.length > 0) {
          const conv = conversations[0];
          setConversationId(conv.id);
          
          // Load messages
          const { data: msgs } = await supabase
            .from('ai_messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });
          
          if (msgs) {
            setMessages(msgs.map(m => ({ id: m.id, role: m.role as 'user' | 'assistant', content: m.content })));
          }
        }
      }
    };
    
    loadData();
  }, []);

  const createNewChat = async () => {
    if (!user) {
      toast.error(settings.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }
    
    setMessages([]);
    setConversationId(null);
    sessionStorage.removeItem('qalam_state');
    toast.success(settings.language === 'ar' ? 'محادثة جديدة' : 'New chat started');
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) return;
    
    try {
      await supabase.from('ai_messages').delete().eq('id', messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      toast.success(settings.language === 'ar' ? 'تم حذف الرسالة' : 'Message deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(settings.language === 'ar' ? 'فشل حذف الرسالة' : 'Failed to delete message');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!user) {
      toast.error(settings.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create conversation if needed
      let convId = conversationId;
      if (!convId) {
        const { data: newConv } = await supabase
          .from('ai_conversations')
          .insert({ user_id: user.id, title: input.slice(0, 50) })
          .select()
          .single();
        
        if (newConv) {
          convId = newConv.id;
          setConversationId(convId);
        }
      }
      
      // Save user message
      if (convId) {
        const { data: savedMsg } = await supabase
          .from('ai_messages')
          .insert({ 
            conversation_id: convId, 
            role: 'user', 
            content: userMessage.content 
          })
          .select()
          .single();
        
        if (savedMsg) {
          setMessages(prev => prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, id: savedMsg.id } : m
          ));
        }
      }
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let textBuffer = '';
      let streamDone = false;

      // Add initial assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantMessage
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
      
      // Save assistant message
      if (convId && assistantMessage) {
        const { data: savedMsg } = await supabase
          .from('ai_messages')
          .insert({ 
            conversation_id: convId, 
            role: 'assistant', 
            content: assistantMessage 
          })
          .select()
          .single();
        
        if (savedMsg) {
          setMessages(prev => prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, id: savedMsg.id } : m
          ));
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(settings.language === 'ar' ? 'حدث خطأ في الاتصال' : 'Failed to get response');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] relative">
      {user && (
        <>
          <Link to="/chat-history">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 left-4 rounded-full w-9 h-9 z-10"
            >
              <History className="h-4 w-4" />
            </Button>
          </Link>
          
          <Button
            onClick={createNewChat}
            size="icon"
            variant="outline"
            className="absolute top-4 right-4 rounded-full w-10 h-10 z-10"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </>
      )}
      
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {settings.language === 'ar' ? 'قلم - المساعد الذكي' : 'Qalam - AI Assistant'}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground">
          {settings.language === 'ar' 
            ? 'اسأل أي سؤال إسلامي'
            : 'Ask any Islamic question'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <p className="text-muted-foreground">
              {settings.language === 'ar'
                ? 'ابدأ محادثة مع قلم'
                : 'Start a conversation with Qalam'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
              >
                <div className="flex items-start gap-2 max-w-[85%]">
                  {message.role === 'user' && message.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={() => deleteMessage(message.id!)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                  <div
                    className={`rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'glass-effect'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'assistant' && message.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={() => deleteMessage(message.id!)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="glass-effect rounded-2xl p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder={settings.language === 'ar' ? 'اكتب سؤالك...' : 'Type your question...'}
          className="border-0 bg-transparent focus-visible:ring-0"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default Qalam;
