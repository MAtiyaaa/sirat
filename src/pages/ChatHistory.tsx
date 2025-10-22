import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Trash2, Loader2, ArrowLeft, Search, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
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
  message_count?: number;
}

const ChatHistory = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

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
      .select(`
        *,
        ai_messages(count)
      `)
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });

    if (data && !error) {
      const conversationsWithCount = data.map(conv => ({
        ...conv,
        message_count: conv.ai_messages?.[0]?.count || 0
      }));
      setConversations(conversationsWithCount);
      setFilteredConversations(conversationsWithCount);
    }
    setLoading(false);
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
      setFilteredConversations(prev => prev.filter(c => c.id !== deleteId));
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

    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return settings.language === 'ar' 
        ? `منذ ${mins} ${mins === 1 ? 'دقيقة' : 'دقائق'}`
        : `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return settings.language === 'ar'
        ? `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
        : `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return settings.language === 'ar'
        ? `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`
        : `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
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

  const getConversationGradient = (index: number) => {
    const gradients = [
      { gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20", iconBg: "bg-purple-500/10", iconColor: "text-purple-600 dark:text-purple-400" },
      { gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20", iconBg: "bg-blue-500/10", iconColor: "text-blue-600 dark:text-blue-400" },
      { gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400" },
      { gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20", iconBg: "bg-amber-500/10", iconColor: "text-amber-600 dark:text-amber-400" },
      { gradient: "from-red-500/20 via-orange-400/20 to-rose-500/20", iconBg: "bg-red-500/10", iconColor: "text-red-600 dark:text-red-400" },
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
            aria-label={settings.language === 'ar' ? 'رجوع' : 'Back'}
          >
            <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
          <h1 className="text-3xl font-bold">
            {settings.language === 'ar' ? 'سجل المحادثات' : 'Chat History'}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={settings.language === 'ar' ? 'ابحث في المحادثات...' : 'Search conversations...'}
            className={`${isRTL ? 'pr-10' : 'pl-10'} glass-effect border-border/50`}
          />
        </div>

        {/* Conversations */}
        {filteredConversations.length === 0 ? (
          <div className="text-center glass-effect rounded-3xl p-16 border border-border/50">
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
          <div className="grid gap-4">
            {filteredConversations.map((conv, index) => {
              const style = getConversationGradient(index);
              return (
                <div key={conv.id} className="cursor-pointer group">
                  <div className="relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                    
                    <Card 
                      className="relative glass-effect border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl p-6"
                      onClick={() => openInQalam(conv.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${style.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
                          <MessageSquare className={`h-7 w-7 ${style.iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">
                            {conv.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDate(conv.updated_at)}</span>
                            {conv.message_count && (
                              <>
                                <span>•</span>
                                <span>
                                  {conv.message_count} {settings.language === 'ar' ? 'رسالة' : 'messages'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(conv.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {settings.language === 'ar' ? 'حذف المحادثة' : 'Delete Conversation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {settings.language === 'ar'
                ? 'هل أنت متأكد؟ سيتم حذف جميع الرسائل ولا يمكن التراجع.'
                : 'Are you sure? All messages will be deleted and this cannot be undone.'}
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
