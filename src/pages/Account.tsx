import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useUserStats } from '@/hooks/useUserStats';
import { getLinkedProviders, hasPasswordIdentity } from '@/lib/auth-identities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Lock, 
  LogOut, 
  AlertTriangle, 
  RotateCcw,
  Camera,
  Edit,
  Trash2,
  Calendar,
  Activity,
  BookOpen,
  Flame,
  ArrowLeft,
  Link2,
  Check,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path
      d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      fill="currentColor"
    />
  </svg>
);

const Account = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { stats, loading: statsLoading } = useUserStats(user?.id);

  const [authUser, setAuthUser] = useState(user);

  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [googleLinkLoading, setGoogleLinkLoading] = useState(false);
  const [appleLinkLoading, setAppleLinkLoading] = useState(false);

  const linkedProviders = getLinkedProviders(authUser);
  const hasGoogleLinked = linkedProviders.has('google');
  const hasAppleLinked = linkedProviders.has('apple');
  const canUsePasswordDelete = hasPasswordIdentity(authUser);

  useEffect(() => {
    if (user) {
      setAuthUser(user);
      loadProfile();
    }
  }, [user]);

  const refreshAuthUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) setAuthUser(data.user);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Reload profile when returning to the page or when navigating
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        refreshAuthUser();
        loadProfile();
      }
    };
    
    const handleFocus = () => {
      if (user) {
        refreshAuthUser();
        loadProfile();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const content = {
    ar: {
      title: 'حسابي',
      subtitle: 'إدارة ملفك الشخصي وإعداداتك',
      // Section headers
      profileSection: 'الملف الشخصي',
      accountSection: 'إعدادات الحساب',
      connectedAccounts: 'الحسابات المرتبطة',
      dataSection: 'إدارة البيانات',
      dangerSection: 'منطقة الخطر',
      // Stats
      joinedDate: 'تاريخ الانضمام',
      timesUsed: 'هذا الشهر',
      surahsRead: 'سور مقروءة',
      daysOpenedThisYear: 'أيام هذا العام',
      timesOpenedThisYear: 'مرات هذا العام',
      // Actions
      changeName: 'تغيير الاسم',
      changeEmail: 'تغيير البريد الإلكتروني',
      changePassword: 'تغيير كلمة المرور',
      clearQalamHistory: 'مسح محادثات قلم',
      clearQalamHistoryWarning: 'سيؤدي هذا إلى حذف جميع محادثاتك مع قلم.',
      clearReadingData: 'مسح بيانات القراءة',
      clearAllData: 'مسح جميع البيانات',
      deleteAccount: 'حذف الحساب',
      signOut: 'تسجيل الخروج',
      // Form fields
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور',
      save: 'حفظ',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      // Toast messages
      nameUpdated: 'تم تحديث الاسم بنجاح',
      emailUpdated: 'تم تحديث البريد الإلكتروني بنجاح',
      passwordUpdated: 'تم تحديث كلمة المرور بنجاح',
      photoUpdated: 'تم تحديث الصورة بنجاح',
      dataCleared: 'تم مسح البيانات بنجاح',
      accountDeleted: 'تم حذف الحساب',
      signedOut: 'تم تسجيل الخروج',
      error: 'حدث خطأ',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      passwordRequired: 'كلمة المرور مطلوبة',
      emailTaken: 'البريد الإلكتروني مستخدم بالفعل',
      // Warnings
      clearReadingWarning: 'سيؤدي هذا إلى مسح سجل القراءة وتقدمك.',
      clearAllWarning: 'سيؤدي هذا إلى مسح جميع بياناتك مع الاحتفاظ بحسابك.',
      deleteAccountWarning: 'سيؤدي هذا إلى حذف حسابك وجميع بياناتك بشكل دائم.',
      enterPasswordToDelete: 'أدخل كلمة المرور لتأكيد الحذف',
      signInRequired: 'يرجى تسجيل الدخول أولاً',
      signIn: 'تسجيل الدخول',
      // Google
      linkGoogle: 'ربط حساب جوجل',
      googleLinked: 'حساب جوجل مرتبط',
      googleLinkSuccess: 'تم ربط حساب جوجل بنجاح',
      googleLinkError: 'فشل في ربط حساب جوجل',
      // Apple
      linkApple: 'ربط حساب Apple',
      appleLinked: 'حساب Apple مرتبط',
      appleLinkSuccess: 'تم ربط حساب Apple بنجاح',
      appleLinkError: 'فشل في ربط حساب Apple',
    },
    en: {
      title: 'My Account',
      subtitle: 'Manage your profile and preferences',
      // Section headers
      profileSection: 'Profile',
      accountSection: 'Account Settings',
      connectedAccounts: 'Connected Accounts',
      dataSection: 'Data Management',
      dangerSection: 'Danger Zone',
      // Stats
      joinedDate: 'Joined',
      timesUsed: 'This Month',
      surahsRead: 'Surahs Read',
      daysOpenedThisYear: 'Days This Year',
      timesOpenedThisYear: 'Opens This Year',
      // Actions
      changeName: 'Change Name',
      changeEmail: 'Change Email',
      changePassword: 'Change Password',
      clearQalamHistory: 'Clear Qalam History',
      clearQalamHistoryWarning: 'This will delete all your conversations with Qalam.',
      clearReadingData: 'Clear Reading Data',
      clearAllData: 'Clear All Data',
      deleteAccount: 'Delete Account',
      signOut: 'Sign Out',
      // Form fields
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      // Toast messages
      nameUpdated: 'Name updated successfully',
      emailUpdated: 'Email updated successfully',
      passwordUpdated: 'Password updated successfully',
      photoUpdated: 'Photo updated successfully',
      dataCleared: 'Data cleared successfully',
      accountDeleted: 'Account deleted',
      signedOut: 'Signed out successfully',
      error: 'An error occurred',
      passwordMismatch: 'Passwords do not match',
      passwordRequired: 'Password is required',
      emailTaken: 'Email is already taken',
      // Warnings
      clearReadingWarning: 'This will clear your reading history and progress.',
      clearAllWarning: 'This will clear all your data but keep your account active.',
      deleteAccountWarning: 'This will permanently delete your account and all your data.',
      enterPasswordToDelete: 'Enter your password to confirm deletion',
      signInRequired: 'Please sign in first',
      signIn: 'Sign In',
      // Google
      linkGoogle: 'Link Google Account',
      googleLinked: 'Google Account Linked',
      googleLinkSuccess: 'Google account linked successfully',
      googleLinkError: 'Failed to link Google account',
      // Apple
      linkApple: 'Link Apple Account',
      appleLinked: 'Apple Account Linked',
      appleLinkSuccess: 'Apple account linked successfully',
      appleLinkError: 'Failed to link Apple account',
    },
  };

  const t = content[settings.language];

  const nameSchema = z.object({
    firstName: z.string().trim().min(1, 'First name required').max(50, 'First name too long'),
    lastName: z.string().trim().max(50, 'Last name too long'),
  });

  const emailSchema = z.object({
    email: z.string().trim().email('Invalid email').max(255, 'Email too long'),
  });

  const passwordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
  });


  const handleUpdateName = async () => {
    if (!user) return;

    const validation = nameSchema.safeParse({ 
      firstName: firstName.trim(),
      lastName: lastName.trim() 
    });
    if (!validation.success) {
      toast({
        title: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({ 
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: fullName
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert({ 
            user_id: user.id, 
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: fullName
          });

        if (error) throw error;
      }

      toast({
        title: t.nameUpdated,
      });
      setShowNameDialog(false);
      await loadProfile();
    } catch (error) {
      console.error('Name update error:', error);
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!user) return;

    const validation = emailSchema.safeParse({ email: newEmail.trim() });
    if (!validation.success) {
      toast({
        title: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });

      if (error) {
        if (error.message.includes('already')) {
          toast({
            title: t.emailTaken,
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: t.emailUpdated,
      });
      setShowEmailDialog(false);
      setNewEmail('');
    } catch (error) {
      console.error('Email update error:', error);
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: t.passwordRequired,
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: t.passwordMismatch,
        variant: 'destructive',
      });
      return;
    }

    const validation = passwordSchema.safeParse({ password: newPassword });
    if (!validation.success) {
      toast({
        title: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      toast({
        title: t.passwordUpdated,
      });
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkGoogle = async () => {
    setGoogleLinkLoading(true);
    try {
      // IMPORTANT: when already signed in, we must LINK (not sign-in) to avoid creating a new user.
      const { data, error } = await (supabase.auth as any).linkIdentity({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/account',
        },
      });
      if (error) throw error;
      if (data?.url) window.location.assign(data.url);
    } catch (error: any) {
      console.error('Google link error:', error);
      toast({
        title: t.googleLinkError,
        description: error.message,
        variant: 'destructive',
      });
      setGoogleLinkLoading(false);
    }
  };

  const handleLinkApple = async () => {
    setAppleLinkLoading(true);
    try {
      // IMPORTANT: when already signed in, we must LINK (not sign-in) to avoid creating a new user.
      const { data, error } = await (supabase.auth as any).linkIdentity({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin + '/account',
        },
      });
      if (error) throw error;
      if (data?.url) window.location.assign(data.url);
    } catch (error: any) {
      console.error('Apple link error:', error);
      toast({
        title: t.appleLinkError,
        description: error.message,
        variant: 'destructive',
      });
      setAppleLinkLoading(false);
    }
  };

  const handleClearQalamHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: conversations } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', user.id);

      if (conversations && conversations.length > 0) {
        const conversationIds = conversations.map(c => c.id);
        await supabase.from('ai_messages').delete().in('conversation_id', conversationIds);
        await supabase.from('ai_conversations').delete().in('id', conversationIds);
      }

      toast({
        title: t.dataCleared,
      });
    } catch (error) {
      console.error('Clear Qalam history error:', error);
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearReadingData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await Promise.all([
        supabase.from('reading_progress').delete().eq('user_id', user.id),
        supabase.from('last_viewed_surah').delete().eq('user_id', user.id),
      ]);

      toast({
        title: t.dataCleared,
      });
    } catch (error) {
      console.error('Clear reading data error:', error);
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Get conversations for message deletion
      const { data: conversations } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', user.id);

      if (conversations && conversations.length > 0) {
        const conversationIds = conversations.map(c => c.id);
        await supabase.from('ai_messages').delete().in('conversation_id', conversationIds);
      }

      await Promise.allSettled([
        supabase.from('ai_conversations').delete().eq('user_id', user.id),
        supabase.from('bookmarks').delete().eq('user_id', user.id),
        supabase.from('hadith_bookmarks').delete().eq('user_id', user.id),
        supabase.from('reading_progress').delete().eq('user_id', user.id),
        supabase.from('last_viewed_surah').delete().eq('user_id', user.id),
        supabase.from('ayah_interactions').delete().eq('user_id', user.id),
        supabase.from('user_zakat_data').delete().eq('user_id', user.id),
      ]);

      localStorage.clear();

      toast({
        title: t.dataCleared,
      });

      setTimeout(() => window.location.href = '/', 1000);
    } catch (error) {
      console.error('Clear all data error:', error);
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const expects = settings.language === 'ar' ? 'حذف' : 'DELETE';
    if (deleteConfirmText.trim().toUpperCase() !== expects) {
      toast({
        title: settings.language === 'ar' ? 'اكتب كلمة التأكيد' : 'Type the confirmation word',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // If user has an email/password identity, verify password; OAuth-only users can't.
      if (canUsePasswordDelete) {
        if (!deleteAccountPassword) {
          toast({ title: t.passwordRequired, variant: 'destructive' });
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email!,
          password: deleteAccountPassword,
        });

        if (signInError) {
          toast({
            title: settings.language === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password',
            variant: 'destructive',
          });
          return;
        }
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) throw new Error('Missing session');

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Delete failed');
      }

      // Session is now invalid; clear locally
      await supabase.auth.signOut();
      localStorage.clear();

      toast({
        title: t.accountDeleted,
      });

      navigate('/');
    } catch (error) {
      console.error('Delete account error:', error);
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setDeleteAccountPassword('');
      setDeleteConfirmText('');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: t.signedOut,
      });
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: t.error,
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
        <div className="p-6 bg-primary/10 rounded-full">
          <User className="h-16 w-16 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{t.signInRequired}</h2>
          <p className="text-muted-foreground">{settings.language === 'ar' ? 'قم بتسجيل الدخول لإدارة حسابك' : 'Sign in to manage your account'}</p>
        </div>
        <Button onClick={() => navigate('/auth')} size="lg">
          {t.signIn}
        </Button>
      </div>
    );
  }

  const joinedDate = stats.joinedDate 
    ? new Date(stats.joinedDate).toLocaleDateString(settings.language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : (profile?.created_at 
      ? new Date(profile.created_at).toLocaleDateString(settings.language === 'ar' ? 'ar-SA' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '—');

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
            aria-label={settings.language === 'ar' ? 'رجوع' : 'Back'}
          >
            <ArrowLeft className={`h-5 w-5 ${settings.language === 'ar' ? 'rotate-180' : ''}`} />
          </Button>
          <h1 className="text-3xl font-bold">{t.title}</h1>
        </div>

        {/* Profile Card */}
        <div className="glass-effect rounded-2xl p-6 border border-border/30 animate-fade-in">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-primary/20 shadow-lg">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {(profile?.full_name || user.email)?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{profile?.full_name || user.email}</h2>
              {profile?.full_name && (
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {t.joinedDate} {joinedDate}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-border/30">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.timesOpenedThisMonth}</p>
              <p className="text-xs text-muted-foreground">{t.timesUsed}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.surahsRead}</p>
              <p className="text-xs text-muted-foreground">{t.surahsRead}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.daysOpenedThisYear}</p>
              <p className="text-xs text-muted-foreground">{t.daysOpenedThisYear}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.timesOpenedThisYear}</p>
              <p className="text-xs text-muted-foreground">{t.timesOpenedThisYear}</p>
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
            {t.accountSection}
          </h3>
          <div className="glass-effect rounded-2xl border border-border/30 divide-y divide-border/30 overflow-hidden">
            {/* Change Name */}
            <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
              <DialogTrigger asChild>
                <button className="w-full p-4 hover:bg-accent/50 smooth-transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Edit className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t.changeName}</span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.changeName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{t.firstName}</Label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t.firstName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.lastName}</Label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t.lastName}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNameDialog(false)}>
                    {t.cancel}
                  </Button>
                  <Button onClick={handleUpdateName} disabled={isLoading}>
                    {t.save}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Change Email */}
            <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
              <DialogTrigger asChild>
                <button className="w-full p-4 hover:bg-accent/50 smooth-transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t.changeEmail}</span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.changeEmail}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{t.email}</Label>
                    <Input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder={user.email || ''}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                    {t.cancel}
                  </Button>
                  <Button onClick={handleUpdateEmail} disabled={isLoading}>
                    {t.save}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Change Password */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogTrigger asChild>
                <button className="w-full p-4 hover:bg-accent/50 smooth-transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t.changePassword}</span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.changePassword}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{t.currentPassword}</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.newPassword}</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.confirmPassword}</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                    {t.cancel}
                  </Button>
                  <Button onClick={handleUpdatePassword} disabled={isLoading}>
                    {t.save}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Connected Accounts Section */}
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
            {t.connectedAccounts}
          </h3>
          <div className="glass-effect rounded-2xl border border-border/30 divide-y divide-border/30 overflow-hidden">
            {/* Google */}
            <button
              onClick={hasGoogleLinked ? undefined : handleLinkGoogle}
              disabled={hasGoogleLinked || googleLinkLoading}
              className={`w-full p-4 flex items-center justify-between ${
                hasGoogleLinked 
                  ? 'cursor-default' 
                  : 'hover:bg-accent/50 smooth-transition'
              }`}
            >
              <div className="flex items-center gap-3">
                <GoogleIcon />
                <div className="text-left">
                  <span className="font-medium block">Google</span>
                  {hasGoogleLinked && (
                    <span className="text-xs text-green-500">{t.googleLinked}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {googleLinkLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : hasGoogleLinked ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Link2 className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Apple */}
            <button
              onClick={hasAppleLinked ? undefined : handleLinkApple}
              disabled={hasAppleLinked || appleLinkLoading}
              className={`w-full p-4 flex items-center justify-between ${
                hasAppleLinked 
                  ? 'cursor-default' 
                  : 'hover:bg-accent/50 smooth-transition'
              }`}
            >
              <div className="flex items-center gap-3">
                <AppleIcon />
                <div className="text-left">
                  <span className="font-medium block">Apple</span>
                  {hasAppleLinked && (
                    <span className="text-xs text-green-500">{t.appleLinked}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {appleLinkLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : hasAppleLinked ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Link2 className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">
            {t.dataSection}
          </h3>
          <div className="glass-effect rounded-2xl border border-border/30 divide-y divide-border/30 overflow-hidden">
            {/* Clear Reading Data */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full p-4 hover:bg-accent/50 smooth-transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">{t.clearReadingData}</span>
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.clearReadingData}</AlertDialogTitle>
                  <AlertDialogDescription>{t.clearReadingWarning}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearReadingData} disabled={isLoading}>
                    {t.confirm}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Clear Qalam History */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full p-4 hover:bg-accent/50 smooth-transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">{t.clearQalamHistory}</span>
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.clearQalamHistory}</AlertDialogTitle>
                  <AlertDialogDescription>{t.clearQalamHistoryWarning}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearQalamHistory} disabled={isLoading}>
                    {t.confirm}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Clear All Data */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full p-4 hover:bg-accent/50 smooth-transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">{t.clearAllData}</span>
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.clearAllData}</AlertDialogTitle>
                  <AlertDialogDescription>{t.clearAllWarning}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllData}
                    disabled={isLoading}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {t.confirm}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="space-y-3 animate-fade-in">
          <h3 className="text-sm font-medium text-destructive uppercase tracking-wider px-1">
            {t.dangerSection}
          </h3>
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 overflow-hidden">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <button className="w-full p-4 hover:bg-destructive/10 smooth-transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    <span className="font-medium text-destructive">{t.deleteAccount}</span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive">{t.deleteAccount}</DialogTitle>
                  <DialogDescription>{t.deleteAccountWarning}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>
                      {settings.language === 'ar' ? 'اكتب كلمة التأكيد لإتمام الحذف' : 'Type the confirmation word to delete'}
                    </Label>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder={settings.language === 'ar' ? 'حذف' : 'DELETE'}
                    />
                  </div>

                  {canUsePasswordDelete && (
                    <div className="space-y-2">
                      <Label>{t.enterPasswordToDelete}</Label>
                      <Input
                        type="password"
                        value={deleteAccountPassword}
                        onChange={(e) => setDeleteAccountPassword(e.target.value)}
                        placeholder={t.currentPassword}
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    {t.cancel}
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {t.deleteAccount}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-4 animate-fade-in">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full h-12"
          >
            <LogOut className="h-5 w-5 mr-2" />
            {t.signOut}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Account;