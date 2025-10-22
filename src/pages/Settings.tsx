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
      back: 'رجوع',
      account: 'الحساب',
      myAccount: 'حسابي',
      appearance: 'المظهر',
      quran: 'القرآن',
      prayer: 'الصلاة',
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
      translationOptions: {
        transliteration: 'النقل الحرفي',
      },
      mode: 'الوضع',
      color: 'اللون',
      modes: {
        light: 'فاتح',
        dark: 'داكن',
        system: 'حسب النظام',
      },
      colors: {
        blue: 'أزرق',
        green: 'أخضر',
        gold: 'ذهبي',
        pink: 'وردي',
        red: 'أحمر',
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
      back: 'Back',
      account: 'Account',
      myAccount: 'My Account',
      appearance: 'Appearance',
      quran: 'Quran',
      prayer: 'Prayer',
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
      translationOptions: {
        transliteration: 'Transliteration',
      },
      mode: 'Mode',
      color: 'Color',
      modes: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
      colors: {
        blue: 'Blue',
        green: 'Green',
        gold: 'Gold',
        pink: 'Pink',
        red: 'Red',
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

  const lang = (settings.language ?? 'en') as 'ar' | 'en';
  const t = content[lang];
  const isRTL = lang === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
            aria-label={t.back}
          >
            <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Button>
          <h1 className="text-3xl font-bold">{t.title}</h1>
        </div>

      {/* Account */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2">{t.account}</h2>
        <div className="space-y-2">
          {user ? (
            <>
              <Link to="/account">
                <button className="w-full glass-effect rounded-2xl p-4 border border-border/30 hover:border-primary/30 smooth-transition flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 smooth-transition">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium truncate">{t.myAccount}</span>
                  </div>
                  <ArrowLeft className={`h-4 w-4 text-muted-foreground ${isRTL ? '' : 'rotate-180'} shrink-0`} />
                </button>
              </Link>
              <Link to="/chat-history">
                <button className="w-full glass-effect rounded-2xl p-4 border border-border/30 hover:border-primary/30 smooth-transition flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 smooth-transition">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                    </div>
                    <span className="font-medium truncate">{t.chatHistory}</span>
                  </div>
                  <ArrowLeft className={`h-4 w-4 text-muted-foreground ${isRTL ? '' : 'rotate-180'} shrink-0`} />
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full glass-effect rounded-2xl p-4 border border-border/30 hover:border-destructive/30 smooth-transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-destructive" />
                </div>
                <span className="font-medium text-destructive truncate">{t.signOut}</span>
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
              <SelectTrigger className={isRTL ? 'w-40' : 'w-32'}>
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
            <Label className="font-medium">{t.mode}</Label>
            <Select value={settings.themeMode} onValueChange={(value: any) => updateSettings({ themeMode: value })}>
              <SelectTrigger className={isRTL ? 'w-40' : 'w-32'}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">{t.modes.system}</SelectItem>
                <SelectItem value="light">{t.modes.light}</SelectItem>
                <SelectItem value="dark">{t.modes.dark}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <Label className="font-medium">{t.color}</Label>
            <Select value={settings.themeColor} onValueChange={(value: any) => updateSettings({ themeColor: value })}>
              <SelectTrigger className={isRTL ? 'w-40' : 'w-32'}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">{t.colors.blue}</SelectItem>
                <SelectItem value="green">{t.colors.green}</SelectItem>
                <SelectItem value="gold">{t.colors.gold}</SelectItem>
                <SelectItem value="pink">{t.colors.pink}</SelectItem>
                <SelectItem value="red">{t.colors.red}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Quran */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2">{t.quran}</h2>
        <div className="glass-effect rounded-2xl p-5 border border-border/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="font-medium">{t.autoLock}</Label>
              <p className="text-xs text-muted-foreground mt-1">{t.autoLockDesc}</p>
            </div>
            <Switch checked={autoLock} onCheckedChange={toggleAutoLock} />
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <Label className="font-medium">{t.fontType}</Label>
            <Select value={settings.fontType} onValueChange={(value: any) => updateSettings({ fontType: value })}>
              <SelectTrigger className={isRTL ? 'w-44' : 'w-32'}>
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
            <div className="flex items-center justify-between">
              <Label className="font-medium">{t.translationSource}</Label>
              <Switch checked={settings.translationEnabled} onCheckedChange={(checked) => updateSettings({ translationEnabled: checked })} />
            </div>
            {settings.translationEnabled && (
              <Select value={settings.translationSource} onValueChange={(value) => updateSettings({ translationSource: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transliteration">{t.translationOptions?.transliteration || 'Transliteration'}</SelectItem>
                  <SelectItem value="en.sahih">Sahih International</SelectItem>
                  <SelectItem value="en.pickthall">Pickthall</SelectItem>
                  <SelectItem value="ar.muyassar">الميسر</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="h-px bg-border" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-medium">{t.tafsirSource}</Label>
              <Switch checked={settings.tafsirEnabled} onCheckedChange={(checked) => updateSettings({ tafsirEnabled: checked })} />
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
              <SelectTrigger className={isRTL ? 'w-44' : 'w-32'}>
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
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2">{t.prayer}</h2>
        <div className="glass-effect rounded-2xl p-5 border border-border/30">
          <div className="flex items-center justify-between">
            <Label className="font-medium">{t.prayerRegion}</Label>
            <Select value={settings.prayerTimeRegion || 'auto'} onValueChange={(value) => updateSettings({ prayerTimeRegion: value === 'auto' ? null : value })}>
              <SelectTrigger className={isRTL ? 'w-44' : 'w-32'}>
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
                <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'} min-w-0`}>
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
    </div>
  );
};

export default Settings;
