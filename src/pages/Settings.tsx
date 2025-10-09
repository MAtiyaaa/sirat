import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, MessageSquare, RotateCcw, ArrowLeft, Settings as SettingsIcon, Lock } from 'lucide-react';
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

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [autoLock, setAutoLock] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // Load auto-lock setting
    const savedAutoLock = localStorage.getItem('quran_auto_lock') === 'true';
    setAutoLock(savedAutoLock);
    
    // Reload profile when returning to page
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadProfile();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(settings.language === 'ar' ? 'تم تسجيل الخروج' : 'Signed out');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || (settings.language === 'ar' ? 'حدث خطأ' : 'An error occurred'));
    }
  };

  const handleResetAllProgress = async () => {
    if (!user) {
      toast.error(settings.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    try {
      const { error: progressError } = await supabase
        .from('reading_progress')
        .delete()
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      const { error: lastViewedError } = await supabase
        .from('last_viewed_surah')
        .delete()
        .eq('user_id', user.id);

      if (lastViewedError) throw lastViewedError;

      const { error: interactionsError } = await supabase
        .from('ayah_interactions')
        .delete()
        .eq('user_id', user.id);

      if (interactionsError) throw interactionsError;

      localStorage.removeItem('quran_last_position');
      localStorage.removeItem('reading_progress');
      localStorage.removeItem('last_viewed_surah');

      toast.success(settings.language === 'ar' ? 'تم إعادة التعيين' : 'Progress reset');
      window.location.reload();
    } catch (error) {
      console.error('Error resetting all progress:', error);
      toast.error(settings.language === 'ar' ? 'فشل إعادة التعيين' : 'Failed to reset progress');
    }
  };

  const toggleAutoLock = (checked: boolean) => {
    setAutoLock(checked);
    localStorage.setItem('quran_auto_lock', checked.toString());
    toast.success(settings.language === 'ar' ? 
      (checked ? 'تم تفعيل القفل التلقائي' : 'تم إيقاف القفل التلقائي') : 
      (checked ? 'Auto-lock enabled' : 'Auto-lock disabled')
    );
  };

  const content = {
    ar: {
      title: 'الإعدادات',
      account: 'الحساب',
      appearance: 'المظهر',
      quran: 'القرآن',
      autoLock: 'قفل تلقائي عند التشغيل',
      autoLockDesc: 'قفل الشاشة تلقائياً والتمرير مع الإمام عند تشغيل السورة',
      signOut: 'تسجيل الخروج',
      signIn: 'تسجيل الدخول',
      chatHistory: 'سجل المحادثات',
      resetProgress: 'إعادة تعيين التقدم',
      resetWarning: 'سيؤدي هذا إلى مسح سجل القراءة وتقدمك.',
      language: 'اللغة',
      theme: 'المظهر',
      fontType: 'نوع الخط',
      translationSource: 'مصدر الترجمة',
      tafsirSource: 'مصدر التفسير',
      prayerRegion: 'منطقة أوقات الصلاة',
      trackingMode: 'طريقة التذكر',
      translationOff: 'الترجمة متوقفة',
      tafsirOff: 'التفسير متوقف',
      themes: {
        light: 'فاتح',
        dark: 'داكن',
        gold: 'ذهبي',
        pink: 'وردي',
        green: 'أخضر',
        system: 'حسب النظام',
      },
      fonts: {
        quran: 'خط المصحف',
        amiri: 'خط أميري',
        scheherazade: 'خط شهرزاد',
        lateef: 'خط لطيف',
        'noto-naskh': 'خط نوتو نسخ',
        normal: 'خط عادي',
      },
      trackingModes: {
        auto: 'تلقائي',
        scroll: 'حسب التمرير',
        bookmark: 'حسب الإشارة',
        reciting: 'حسب التلاوة',
        click: 'حسب النقر',
      },
      regions: {
        auto: 'تلقائي',
        mecca: 'مكة',
        medina: 'المدينة',
        cairo: 'القاهرة',
        riyadh: 'الرياض',
        dubai: 'دبي',
        istanbul: 'إسطنبول',
        london: 'لندن',
        newYork: 'نيويورك',
      },
    },
    en: {
      title: 'Settings',
      account: 'Account',
      appearance: 'Appearance',
      quran: 'Quran',
      autoLock: 'Auto-lock When Playing',
      autoLockDesc: 'Automatically lock screen and scroll with imam when surah plays',
      signOut: 'Sign Out',
      signIn: 'Sign In',
      chatHistory: 'Chat History',
      resetProgress: 'Reset Progress',
      resetWarning: 'This will clear your reading history and progress.',
      language: 'Language',
      theme: 'Theme',
      fontType: 'Font Type',
      translationSource: 'Translation',
      tafsirSource: 'Tafsir',
      prayerRegion: 'Prayer Region',
      trackingMode: 'Reading Tracking',
      translationOff: 'Translation Off',
      tafsirOff: 'Tafsir Off',
      themes: {
        light: 'Light',
        dark: 'Dark',
        gold: 'Gold',
        pink: 'Pink',
        green: 'Green',
        system: 'System',
      },
      fonts: {
        quran: 'Uthmanic',
        amiri: 'Amiri',
        scheherazade: 'Scheherazade',
        lateef: 'Lateef',
        'noto-naskh': 'Noto Naskh',
        normal: 'Normal',
      },
      trackingModes: {
        auto: 'Auto',
        scroll: 'Scroll',
        bookmark: 'Bookmark',
        reciting: 'Reciting',
        click: 'Click',
      },
      regions: {
        auto: 'Auto',
        mecca: 'Makkah',
        medina: 'Madinah',
        cairo: 'Cairo',
        riyadh: 'Riyadh',
        dubai: 'Dubai',
        istanbul: 'Istanbul',
        london: 'London',
        newYork: 'New York',
      },
    },
  };

  const t = content[settings.language];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Header with Avatar */}
      <div className="text-center space-y-4 pt-8 animate-fade-in">
        <div className="relative inline-block">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl">
            <SettingsIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>
          {user && profile && (
            <Link to="/account" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
              {profile.full_name || user.email}
            </Link>
          )}
        </div>
      </div>

      {/* Account */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2">{t.account}</h2>
        <div className="space-y-2">
          {user ? (
            <>
              <Link to="/account">
                <button className="w-full glass-effect rounded-2xl p-4 border border-border/30 hover:border-primary/30 smooth-transition flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 smooth-transition">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">My Account</span>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                </button>
              </Link>
              <Link to="/chat-history">
                <button className="w-full glass-effect rounded-2xl p-4 border border-border/30 hover:border-primary/30 smooth-transition flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 smooth-transition">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                    </div>
                    <span className="font-medium">{t.chatHistory}</span>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full glass-effect rounded-2xl p-4 border border-border/30 hover:border-destructive/30 smooth-transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-destructive" />
                </div>
                <span className="font-medium text-destructive">{t.signOut}</span>
              </button>
            </>
          ) : (
            <Button onClick={() => navigate('/auth')} className="w-full h-14 text-base">
              {t.signIn}
            </Button>
          )}
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2">{t.appearance}</h2>
        <div className="glass-effect rounded-2xl p-5 border border-border/30 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-medium">{t.language}</Label>
            <Select value={settings.language} onValueChange={(value: 'ar' | 'en') => updateSettings({ language: value })}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <Label className="font-medium">{t.theme}</Label>
            <Select value={settings.theme} onValueChange={(value: any) => updateSettings({ theme: value })}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">{t.themes.system}</SelectItem>
                <SelectItem value="light">{t.themes.light}</SelectItem>
                <SelectItem value="dark">{t.themes.dark}</SelectItem>
                <SelectItem value="gold">{t.themes.gold}</SelectItem>
                <SelectItem value="pink">{t.themes.pink}</SelectItem>
                <SelectItem value="green">{t.themes.green}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Quran */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2">{t.quran}</h2>
        <div className="glass-effect rounded-2xl p-5 border border-border/30 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Label className="font-medium">{t.autoLock}</Label>
              <p className="text-xs text-muted-foreground mt-1">{t.autoLockDesc}</p>
            </div>
            <Switch checked={autoLock} onCheckedChange={toggleAutoLock} className="shrink-0 mt-1" />
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <Label className="font-medium">{t.fontType}</Label>
            <Select value={settings.fontType} onValueChange={(value: any) => updateSettings({ fontType: value })}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quran">{t.fonts.quran}</SelectItem>
                <SelectItem value="amiri">{t.fonts.amiri}</SelectItem>
                <SelectItem value="scheherazade">{t.fonts.scheherazade}</SelectItem>
                <SelectItem value="lateef">{t.fonts.lateef}</SelectItem>
                <SelectItem value="noto-naskh">{t.fonts['noto-naskh']}</SelectItem>
                <SelectItem value="normal">{t.fonts.normal}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-px bg-border" />
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="font-medium shrink-0">{t.translationSource}</Label>
              <Switch checked={settings.translationEnabled} onCheckedChange={(checked) => updateSettings({ translationEnabled: checked })} className="shrink-0" />
            </div>
            {settings.translationEnabled && (
              <Select value={settings.translationSource} onValueChange={(value) => updateSettings({ translationSource: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transliteration">Transliteration</SelectItem>
                  <SelectItem value="en.sahih">Sahih International</SelectItem>
                  <SelectItem value="en.pickthall">Pickthall</SelectItem>
                  <SelectItem value="ar.muyassar">الميسر</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="h-px bg-border" />
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="font-medium shrink-0">{t.tafsirSource}</Label>
              <Switch checked={settings.tafsirEnabled} onCheckedChange={(checked) => updateSettings({ tafsirEnabled: checked })} className="shrink-0" />
            </div>
            {settings.tafsirEnabled && (
              <Select value={settings.tafsirSource} onValueChange={(value) => updateSettings({ tafsirSource: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-tafisr-ibn-kathir">Ibn Kathir</SelectItem>
                  <SelectItem value="ar-tafsir-ibn-kathir">ابن كثير</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <Label className="font-medium">{t.trackingMode}</Label>
            <Select value={settings.readingTrackingMode} onValueChange={(value: any) => updateSettings({ readingTrackingMode: value })}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">{t.trackingModes.auto}</SelectItem>
                <SelectItem value="scroll">{t.trackingModes.scroll}</SelectItem>
                <SelectItem value="bookmark">{t.trackingModes.bookmark}</SelectItem>
                <SelectItem value="reciting">{t.trackingModes.reciting}</SelectItem>
                <SelectItem value="click">{t.trackingModes.click}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Prayer */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2">Prayer</h2>
        <div className="glass-effect rounded-2xl p-5 border border-border/30">
          <div className="flex items-center justify-between">
            <Label className="font-medium">{t.prayerRegion}</Label>
            <Select value={settings.prayerTimeRegion || 'auto'} onValueChange={(value) => updateSettings({ prayerTimeRegion: value === 'auto' ? null : value })}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">{t.regions.auto}</SelectItem>
                <SelectItem value="21.4225,39.8262">{t.regions.mecca}</SelectItem>
                <SelectItem value="24.4672,39.6111">{t.regions.medina}</SelectItem>
                <SelectItem value="30.0444,31.2357">{t.regions.cairo}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reset */}
      {user && (
        <div className="glass-effect rounded-2xl p-5 border border-destructive/30">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-destructive">{t.resetProgress}</p>
                  <p className="text-xs text-muted-foreground">{t.resetWarning}</p>
                </div>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{settings.language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}</AlertDialogTitle>
                <AlertDialogDescription>{t.resetWarning}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{settings.language === 'ar' ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetAllProgress}>
                  {settings.language === 'ar' ? 'تأكيد' : 'Confirm'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default Settings;