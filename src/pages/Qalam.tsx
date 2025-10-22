import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal, Sparkles, Loader2, Trash2, Plus, History, ArrowDown, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
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
  type: 'surah' | 'ayah' | 'prayer' | 'stories' | 'account' | 'settings' | 'bookmarks' | 'history' | 'hadith' | 'duas' | 'tasbih' | 'islamic-history' | 'rashidun' | 'empires' | 'golden-age' | 'holy-cities' | 'names-allah';
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
  const cardRegex = /\[NAV:(surah|ayah|prayer|stories|account|settings|bookmarks|history|hadith|duas|tasbih|islamic-history|rashidun|empires|golden-age|holy-cities|names-allah)\|?([^\]]*)\]/g;
  
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
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom && messages.length > 0);
  };

  // Save current state to sessionStorage including input
  useEffect(() => {
    if (messages.length > 0 || conversationId || input) {
      sessionStorage.setItem('qalam_state', JSON.stringify({
        messages,
        conversationId,
        input
      }));
    }
  }, [messages, conversationId, input]);

  // Load user and conversation
  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      // Load profile
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (profileData) {
          setProfile(profileData);
        }
      }
      
      // Try to restore from sessionStorage first
      const savedState = sessionStorage.getItem('qalam_state');
      if (savedState) {
        try {
          const { messages: savedMessages, conversationId: savedConvId, input: savedInput } = JSON.parse(savedState);
          if (savedMessages && savedMessages.length > 0) {
            setMessages(savedMessages);
            setConversationId(savedConvId);
            if (savedInput) setInput(savedInput);
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

        // Save current conversation state before switching
        if (messages.length > 0 && conversationId) {
          sessionStorage.setItem(`qalam_conv_${conversationId}`, JSON.stringify({
            messages,
            input
          }));
        }

        // Check if we have saved state for this conversation
        const savedConvState = sessionStorage.getItem(`qalam_conv_${state.conversationId}`);
        if (savedConvState) {
          try {
            const { messages: savedMessages, input: savedInput } = JSON.parse(savedConvState);
            setMessages(savedMessages);
            setConversationId(state.conversationId);
            if (savedInput) setInput(savedInput);
            sessionStorage.setItem('qalam_state', JSON.stringify({
              messages: savedMessages,
              conversationId: state.conversationId,
              input: savedInput || ''
            }));
            window.history.replaceState({}, document.title);
            return;
          } catch (e) {
            console.error('Error loading saved conversation state:', e);
          }
        }

        // Load the selected conversation from DB
        const { data: msgs } = await supabase
          .from('ai_messages')
          .select('*')
          .eq('conversation_id', state.conversationId)
          .order('created_at', { ascending: true });
        
        if (msgs) {
          setMessages(msgs.map(m => ({ id: m.id, role: m.role as 'user' | 'assistant', content: m.content })));
          setConversationId(state.conversationId);
          setInput('');
          sessionStorage.setItem('qalam_state', JSON.stringify({
            messages: msgs.map(m => ({ id: m.id, role: m.role, content: m.content })),
            conversationId: state.conversationId,
            input: ''
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
    
    // Save current conversation state before switching
    if (conversationId && (messages.length > 0 || input)) {
      sessionStorage.setItem(`qalam_conv_${conversationId}`, JSON.stringify({
        messages,
        input
      }));
    }
    
    setMessages([]);
    setConversationId(null);
    setInput('');
    sessionStorage.setItem('qalam_state', JSON.stringify({
      messages: [],
      conversationId: null,
      input: ''
    }));
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
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          userId: user.id,
          userEmail: user.email,
          userName: profile?.full_name || user.email,
        }),
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
    <div className="flex flex-col h-[calc(100vh-8rem)] relative overflow-hidden">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className={`absolute top-2 ${settings.language === 'ar' ? 'right-2' : 'left-2'} md:top-4 md:${settings.language === 'ar' ? 'right-4' : 'left-4'} rounded-full w-10 h-10 z-50 glass-effect`}
      >
        <ArrowLeft className={`h-5 w-5 ${settings.language === 'ar' ? 'rotate-180' : ''}`} />
      </Button>

      {user && (
        <>
          <Link to="/chat-history">
            <Button
              size="icon"
              variant="ghost"
              className={`absolute top-2 ${settings.language === 'ar' ? 'left-14' : 'right-14'} md:top-4 md:${settings.language === 'ar' ? 'left-16' : 'right-16'} rounded-full w-8 h-8 md:w-9 md:h-9 z-20 glass-effect`}
            >
              <History className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </Link>
          
          <Button
            onClick={createNewChat}
            size="icon"
            variant="outline"
            className={`absolute top-2 ${settings.language === 'ar' ? 'left-2' : 'right-2'} md:top-4 md:${settings.language === 'ar' ? 'left-4' : 'right-4'} rounded-full w-8 h-8 md:w-10 md:h-10 z-20 glass-effect`}
          >
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </>
      )}
      
      <div className="text-center py-3 md:py-4 pt-16 md:pt-20">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-effect border border-border/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">
              {settings.language === 'ar' ? 'قلم - المساعد الذكي' : 'Qalam - AI Assistant'}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground px-4">
          {settings.language === 'ar' 
            ? 'اسأل أي سؤال عن الإسلام، القرآن، الحديث، أو التاريخ الإسلامي'
            : 'Ask anything about Islam, Quran, Hadith, or Islamic history'}
        </p>
      </div>

      {/* Messages */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-4 mb-4"
      >
        {messages.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {settings.language === 'ar'
                ? 'مرحباً بك في قلم'
                : 'Welcome to Qalam'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {settings.language === 'ar'
                ? 'اطرح أي سؤال عن الإسلام وسأساعدك بإجابات مفصلة ومصادر موثوقة'
                : 'Ask me anything about Islam and I\'ll help with detailed answers and trusted sources'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {[
                { q: settings.language === 'ar' ? 'ما هي أركان الإسلام؟' : 'What are the pillars of Islam?', icon: '🕌' },
                { q: settings.language === 'ar' ? 'اشرح لي سورة الفاتحة' : 'Explain Surah Al-Fatiha', icon: '📖' },
                { q: settings.language === 'ar' ? 'من هم الخلفاء الراشدون؟' : 'Who were the Rashidun Caliphs?', icon: '👥' },
                { q: settings.language === 'ar' ? 'ما هي أوقات الصلاة؟' : 'What are the prayer times?', icon: '⏰' },
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(example.q)}
                  className="glass-effect rounded-2xl p-4 text-left hover:border-primary/30 border border-border/30 smooth-transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 smooth-transition">{example.icon}</span>
                    <span className="text-sm">{example.q}</span>
                  </div>
                </button>
              ))}
            </div>
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

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="fixed bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 z-10">
          <Button
            onClick={scrollToBottom}
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-lg glass-effect"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="glass-effect rounded-2xl p-3 md:p-4 flex gap-2 mb-4 md:mb-0 sticky bottom-0 bg-background/95 backdrop-blur-sm border border-border/30 shadow-lg">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && !isLoading && handleSend()}
          placeholder={settings.language === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
          className="border-0 bg-transparent focus-visible:ring-0 text-base"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="rounded-xl h-10 w-10 md:h-12 md:w-12"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default Qalam;
