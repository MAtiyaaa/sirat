import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

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
      toast.success(settings.language === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {settings.language === 'ar' ? 'سجل المحادثات' : 'Chat History'}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          {settings.language === 'ar' 
            ? 'راجع محادثاتك السابقة مع قلم'
            : 'Review your past conversations with Qalam'}
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center glass-effect rounded-3xl p-12 border border-border/50">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {settings.language === 'ar' 
              ? 'لا توجد محادثات بعد'
              : 'No conversations yet'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`glass-effect rounded-2xl p-4 cursor-pointer smooth-transition border ${
                  selectedConversation === conv.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border/50 hover:border-border'
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(conv.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Messages */}
          <div className="md:col-span-2">
            {selectedConversation ? (
              <ScrollArea className="h-[600px] glass-effect rounded-3xl p-6 border border-border/50">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id}>
                      {msg.ayah_context && (
                        <div className="glass-effect rounded-xl p-3 mb-2 text-sm text-muted-foreground">
                          {msg.ayah_context}
                        </div>
                      )}
                      <div
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'glass-effect border border-border/50'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[600px] glass-effect rounded-3xl p-6 border border-border/50 flex items-center justify-center">
                <p className="text-muted-foreground">
                  {settings.language === 'ar' 
                    ? 'اختر محادثة لعرضها'
                    : 'Select a conversation to view'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

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
            <AlertDialogAction onClick={deleteConversation}>
              {settings.language === 'ar' ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatHistory;
