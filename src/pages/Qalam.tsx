import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Loader2, Trash2, Plus, History } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import NavigationCard from '@/components/NavigationCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

interface NavCardData {
  type: 'surah' | 'ayah' | 'prayer' | 'stories' | 'account' | 'settings' | 'bookmarks' | 'history' | 'hadith' | 'duas' | 'tasbih';
  data?: {
    surahNumber?: number;
    ayahNumber?: number;
    surahName?: string;
    ayahText?: string;
    book?: string;
    search?: string;
  };
}

const parseNavigationCards = (text: string): { text: string; cards: NavCardData[] } => {
  const cards: NavCardData[] = [];
  const cardRegex = /\[NAV:(surah|ayah|prayer|stories|account|settings|bookmarks|history|hadith|duas|tasbih)\|?([^\]]*)\]/g;
  
  const cleanText = text.replace(cardRegex, (match, type, dataStr) => {
    const cardData: NavCardData = { type };
    
    if (dataStr) {
      const pairs = dataStr.split(',').map(p => p.trim());
      cardData.data = {};
      pairs.forEach(pair => {
        const [key, value] = pair.split(':').map(s => s.trim());
        if (key === 'number' || key === 'surah' || key === 'ayah') {
          cardData.data![key === 'number' ? 'surahNumber' : key === 'surah' ? 'surahNumber' : 'ayahNumber'] = parseInt(value);
        } else if (key === 'name') {
          cardData.data!.surahName = value;
        } else if (key === 'text') {
          cardData.data!.ayahText = value;
        } else if (key === 'book') {
          cardData.data!.book = value;
        } else if (key === 'search') {
          cardData.data!.search = value;
        }
      });
    }
    
    cards.push(cardData);
    return '';
  });
  
  return { text: cleanText.trim(), cards };
};

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

  // Load conversation from navigation state (from chat history)
  useEffect(() => {
    const loadConversationFromNav = async () => {
      const state = window.history.state?.usr;
      if (state?.conversationId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // Save current conversation if it has messages
        if (messages.length > 0 && conversationId) {
          sessionStorage.setItem('qalam_previous', JSON.stringify({
            messages,
            conversationId
          }));
        }

        // Load the selected conversation
        const { data: msgs } = await supabase
          .from('ai_messages')
          .select('*')
          .eq('conversation_id', state.conversationId)
          .order('created_at', { ascending: true });
        
        if (msgs) {
          setMessages(msgs.map(m => ({ id: m.id, role: m.role as 'user' | 'assistant', content: m.content })));
          setConversationId(state.conversationId);
          sessionStorage.setItem('qalam_state', JSON.stringify({
            messages: msgs.map(m => ({ id: m.id, role: m.role, content: m.content })),
            conversationId: state.conversationId
          }));
        }
        
        // Clear navigation state
        window.history.replaceState({}, document.title);
      }
    };

    loadConversationFromNav();
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

  const messageSchema = z.object({
    content: z.string().trim().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
  });

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!user) {
      toast.error(settings.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    const validation = messageSchema.safeParse({ content: input.trim() });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
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
    <div className="flex flex-col h-[calc(100vh-8rem)] relative">
      {user && (
        <>
          <Link to="/chat-history">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 left-2 md:top-4 md:left-4 rounded-full w-8 h-8 md:w-9 md:h-9 z-20"
            >
              <History className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </Link>
          
          <Button
            onClick={createNewChat}
            size="icon"
            variant="outline"
            className="absolute top-2 right-2 md:top-4 md:right-4 rounded-full w-8 h-8 md:w-10 md:h-10 z-20"
          >
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </>
      )}
      
      <div className="text-center py-6 pt-12 md:pt-6">
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
            {messages.map((message, index) => {
              const { text, cards } = message.role === 'assistant' 
                ? parseNavigationCards(message.content)
                : { text: message.content, cards: [] };
              
              return (
                <div
                  key={message.id || index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className="flex items-start gap-2 max-w-[85%]">
                    {message.role === 'user' && message.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex-shrink-0"
                        onClick={() => deleteMessage(message.id!)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`rounded-2xl p-4 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'glass-effect'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="ml-2">{children}</li>,
                              code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                              pre: ({ children }) => <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-2">{children}</pre>,
                              h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2 first:mt-0">{children}</h3>,
                              blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic my-2">{children}</blockquote>,
                              a: ({ children, href }) => <a href={href} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">{children}</a>,
                            }}
                          >
                            {text}
                          </ReactMarkdown>
                        ) : (
                          text
                        )}
                      </div>
                      {cards.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {cards.map((card, cardIndex) => (
                            <NavigationCard key={cardIndex} type={card.type} data={card.data} />
                          ))}
                        </div>
                      )}
                    </div>
                    {message.role === 'assistant' && message.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex-shrink-0"
                        onClick={() => deleteMessage(message.id!)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="glass-effect rounded-2xl p-4 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
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
