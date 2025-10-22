import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Trash2, Loader2, ArrowLeft, Search, Calendar, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ayah_context: string | null;
  created_at: string;
}

const ChatHistory = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter(conv => 
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const loadConversations = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });

    if (data && !error) {
      setConversations(data);
      setFilteredConversations(data);
    }
    setLoading(false);
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (data && !error) {
      setMessages(data as Message[]);
    }
  };

  const deleteConversation = async () => {
    if (!deleteId) return;

    // Delete messages first
    await supabase.from('ai_messages').delete().eq('conversation_id', deleteId);
    
    // Then delete conversation
    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', deleteId);

    if (!error) {
      setConversations(prev => prev.filter(c => c.id !== deleteId));
      if (selectedConversation === deleteId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      toast.success(settings.language === 'ar' ? 'تم الحذف' : 'Deleted');
    }
    setDeleteId(null);
  };

  const openInQalam = (conversationId: string) => {
    navigate('/qalam', { state: { conversationId } });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return settings.language === 'ar' ? 'الآن' : 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}${settings.language === 'ar' ? ' د' : 'm'}`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}${settings.language === 'ar' ? ' س' : 'h'}`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}${settings.language === 'ar' ? ' ي' : 'd'}`;
    
    return date.toLocaleDateString(settings.language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isRTL = settings.language === 'ar';

  return (
    <div className="min-h-screen relative">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className={`fixed top-6 ${isRTL ? 'right-6' : 'left-6'} z-50 rounded-full w-10 h-10 glass-effect`}
      >
        <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
      </Button>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-effect border border-border/30">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                {settings.language === 'ar' ? 'سجل المحادثات' : 'Chat History'}
              </span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {settings.language === 'ar' 
              ? 'راجع وأعد فتح محادثاتك السابقة مع قلم'
              : 'Review and continue your past conversations with Qalam'}
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={settings.language === 'ar' ? 'ابحث في المحادثات...' : 'Search conversations...'}
                className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 glass-effect border-border/50`}
              />
            </div>
          </div>
        </div>

        {filteredConversations.length === 0 ? (
          <div className="text-center glass-effect rounded-3xl p-16 border border-border/50 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery 
                ? (settings.language === 'ar' ? 'لم يتم العثور على محادثات' : 'No conversations found')
                : (settings.language === 'ar' ? 'لا توجد محادثات بعد' : 'No conversations yet')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? (settings.language === 'ar' ? 'جرب مصطلح بحث مختلف' : 'Try a different search term')
                : (settings.language === 'ar' ? 'ابدأ محادثة جديدة مع قلم' : 'Start a new conversation with Qalam')}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/qalam')} size="lg">
                {settings.language === 'ar' ? 'بدء محادثة' : 'Start Conversation'}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {settings.language === 'ar' ? 'المحادثات' : 'Conversations'}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {filteredConversations.length} {settings.language === 'ar' ? 'محادثة' : 'conversations'}
                </span>
              </div>
              
              <ScrollArea className="h-[calc(100vh-320px)]">
                <div className="space-y-2 pr-4">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full text-left glass-effect rounded-2xl p-4 smooth-transition border group hover:scale-[1.02] ${
                        selectedConversation === conv.id
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border/30 hover:border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 space-y-2">
                          <h3 className="font-semibold truncate text-sm">
                            {conv.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(conv.updated_at)}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              openInQalam(conv.id);
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(conv.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Messages Preview */}
            <div className="lg:col-span-3">
              {selectedConversation ? (
                <div className="glass-effect rounded-3xl border border-border/50 overflow-hidden">
                  <div className="p-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {conversations.find(c => c.id === selectedConversation)?.title}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(conversations.find(c => c.id === selectedConversation)?.created_at || '')}
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => openInQalam(selectedConversation)}>
                        {settings.language === 'ar' ? 'متابعة المحادثة' : 'Continue Chat'}
                      </Button>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-[calc(100vh-400px)] p-6">
                    <div className="space-y-6">
                      {messages.map((msg) => (
                        <div key={msg.id}>
                          {msg.ayah_context && (
                            <div className="glass-effect rounded-xl p-3 mb-3 text-sm border border-primary/20 bg-primary/5">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-xs font-medium text-primary">
                                  {settings.language === 'ar' ? 'سياق الآية' : 'Ayah Context'}
                                </span>
                              </div>
                              <p className="text-muted-foreground">{msg.ayah_context}</p>
                            </div>
                          )}
                          <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground shadow-lg'
                                  : 'glass-effect border border-border/30'
                              }`}
                            >
                              {msg.role === 'assistant' ? (
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
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
                                  {msg.content}
                                </ReactMarkdown>
                              ) : (
                                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                              )}
                              <p className="text-xs opacity-60 mt-2">
                                {new Date(msg.created_at).toLocaleTimeString(settings.language === 'ar' ? 'ar-SA' : 'en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="h-[calc(100vh-320px)] glass-effect rounded-3xl border border-border/50 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {settings.language === 'ar' ? 'اختر محادثة' : 'Select a conversation'}
                  </h3>
                  <p className="text-muted-foreground">
                    {settings.language === 'ar' 
                      ? 'انقر على محادثة من القائمة لعرض الرسائل'
                      : 'Click on a conversation from the list to view messages'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {settings.language === 'ar' ? 'حذف المحادثة' : 'Delete Conversation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {settings.language === 'ar' 
                ? 'هل أنت متأكد من حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this conversation? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{settings.language === 'ar' ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={deleteConversation} className="bg-destructive hover:bg-destructive/90">
              {settings.language === 'ar' ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatHistory;
