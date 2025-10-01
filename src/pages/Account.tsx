import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Trash2, LogOut, AlertTriangle, RotateCcw } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Account = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          setFullName(profileData.full_name || '');
        }
      }
    };
    
    loadUser();
  }, []);

  const content = {
    ar: {
      title: 'إدارة الحساب',
      subtitle: 'إدارة معلومات حسابك وإعداداتك',
      personalInfo: 'المعلومات الشخصية',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      updateProfile: 'تحديث الملف الشخصي',
      security: 'الأمان',
      changePassword: 'تغيير كلمة المرور',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور',
      updatePassword: 'تحديث كلمة المرور',
      dangerZone: 'منطقة الخطر',
      clearAllData: 'مسح جميع البيانات',
      clearDataWarning: 'سيؤدي هذا إلى مسح جميع بياناتك (الدردشات، الإشارات المرجعية، سجل القراءة، الإعدادات) بشكل دائم.',
      clearDataConfirm: 'هل أنت متأكد أنك تريد مسح جميع بياناتك؟ لا يمكن التراجع عن هذا الإجراء.',
      deleteAccount: 'حذف الحساب',
      deleteWarning: 'سيؤدي هذا إلى حذف حسابك وجميع بياناتك بشكل دائم.',
      deleteConfirm: 'هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.',
      signOut: 'تسجيل الخروج',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      profileUpdated: 'تم تحديث الملف الشخصي',
      passwordUpdated: 'تم تحديث كلمة المرور',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      accountDeleted: 'تم حذف الحساب',
      dataCleared: 'تم مسح جميع البيانات بنجاح',
      error: 'حدث خطأ',
      signedOut: 'تم تسجيل الخروج بنجاح',
      signInRequired: 'يجب تسجيل الدخول أولاً',
    },
    en: {
      title: 'Account Management',
      subtitle: 'Manage your account information and settings',
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      email: 'Email Address',
      updateProfile: 'Update Profile',
      security: 'Security',
      changePassword: 'Change Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      updatePassword: 'Update Password',
      dangerZone: 'Danger Zone',
      clearAllData: 'Clear All Data',
      clearDataWarning: 'This will permanently clear all your data (chats, bookmarks, reading history, settings).',
      clearDataConfirm: 'Are you sure you want to clear all your data? This action cannot be undone.',
      deleteAccount: 'Delete Account',
      deleteWarning: 'This will permanently delete your account and all your data.',
      deleteConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
      signOut: 'Sign Out',
      cancel: 'Cancel',
      confirm: 'Confirm',
      profileUpdated: 'Profile updated successfully',
      passwordUpdated: 'Password updated successfully',
      passwordMismatch: 'Passwords do not match',
      accountDeleted: 'Account deleted successfully',
      dataCleared: 'All data cleared successfully',
      error: 'An error occurred',
      signedOut: 'Signed out successfully',
      signInRequired: 'Please sign in first',
    },
  };

  const t = content[settings.language];

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('user_id', user.id);
      
      toast.success(t.profileUpdated);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) return;
    
    if (newPassword !== confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }
    
    setIsLoading(true);
    try {
      await supabase.auth.updateUser({ password: newPassword });
      toast.success(t.passwordUpdated);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password update error:', error);
      toast.error(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      // Delete user data first
      await supabase.from('profiles').delete().eq('user_id', user.id);
      await supabase.from('user_settings').delete().eq('user_id', user.id);
      await supabase.from('ai_conversations').delete().eq('user_id', user.id);
      
      // Then delete auth user
      await supabase.auth.admin.deleteUser(user.id);
      
      toast.success(t.accountDeleted);
      navigate('/');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t.error);
    }
  };

  const handleClearAllData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get all conversation IDs first to properly delete messages
      const { data: conversations } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', user.id);

      // Delete all AI messages first
      if (conversations && conversations.length > 0) {
        const conversationIds = conversations.map(c => c.id);
        const { error: messagesError } = await supabase
          .from('ai_messages')
          .delete()
          .in('conversation_id', conversationIds);
        
        if (messagesError) console.error('Error deleting messages:', messagesError);
      }
      
      // Delete all other user data
      const deletions = await Promise.allSettled([
        supabase.from('ai_conversations').delete().eq('user_id', user.id),
        supabase.from('bookmarks').delete().eq('user_id', user.id),
        supabase.from('reading_progress').delete().eq('user_id', user.id),
        supabase.from('last_viewed_surah').delete().eq('user_id', user.id),
        supabase.from('ayah_interactions').delete().eq('user_id', user.id),
      ]);
      
      // Log any failures
      deletions.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Deletion ${index} failed:`, result.reason);
        }
      });
      
      // Reset user settings to defaults
      const { error: settingsError } = await supabase
        .from('user_settings')
        .update({
          language: 'en',
          theme: 'light',
          qari: 'ar.alafasy',
          font_type: 'quran',
          tafsir_source: 'en-tafisr-ibn-kathir',
          tajweed_enabled: false,
          translation_enabled: true,
          transliteration_enabled: true,
          reading_tracking_mode: 'auto',
          prayer_time_region: null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      
      if (settingsError) console.error('Error resetting settings:', settingsError);
      
      // Clear all localStorage
      localStorage.clear();
      
      toast.success(t.dataCleared);
      
      // Force a complete reload
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Clear data error:', error);
      toast.error(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(t.signedOut);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error(t.error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <User className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground">{t.signInRequired}</p>
        <Button onClick={() => navigate('/auth')}>
          {settings.language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {t.title}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light">
          {t.subtitle}
        </p>
      </div>

      {/* Personal Information */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-6 border border-border/50">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{t.personalInfo}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.fullName}</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="glass-effect"
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.email}</Label>
            <div className="flex items-center gap-2 glass-effect rounded-xl p-3 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          </div>
          
          <Button
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className="w-full"
          >
            {t.updateProfile}
          </Button>
        </div>
      </div>

      {/* Security */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-6 border border-border/50">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{t.security}</h2>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">{t.changePassword}</h3>
          
          <div className="space-y-2">
            <Label>{t.newPassword}</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="glass-effect"
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t.confirmPassword}</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="glass-effect"
            />
          </div>
          
          <Button
            onClick={handleUpdatePassword}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {t.updatePassword}
          </Button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 border border-border/50">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t.signOut}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-6 border border-destructive/50 bg-destructive/5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h2 className="text-xl font-semibold text-destructive">{t.dangerZone}</h2>
        </div>
        
        {/* Clear All Data */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t.clearDataWarning}</p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
                <RotateCcw className="h-4 w-4 mr-2" />
                {t.clearAllData}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.clearAllData}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.clearDataConfirm}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllData}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={isLoading}
                >
                  {t.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Delete Account */}
        <div className="space-y-4 pt-4 border-t border-destructive/20">
          <p className="text-sm text-muted-foreground">{t.deleteWarning}</p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                {t.deleteAccount}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.deleteAccount}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.deleteConfirm}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {t.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Account;
