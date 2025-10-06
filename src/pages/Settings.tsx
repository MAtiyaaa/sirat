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
import { LogOut, User, MessageSquare, RotateCcw, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    if (user) {
      loadProfile();
    }
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

  const content = {
    ar: {
      title: 'الإعدادات',
      language: 'اللغة',
      theme: 'المظهر',
      translationSource: 'مصدر الترجمة',
      translationOff: 'الترجمة متوقفة',
      tafsirOff: 'التفسير متوقف',
      fontType: 'نوع الخط',
      tafsirSource: 'مصدر التفسير',
      prayerRegion: 'منطقة أوقات الصلاة',
      trackingMode: 'طريقة التذكر',
      trackingModeDesc: 'كيف تريد أن يتذكر التطبيق مكانك في القراءة؟',
      account: 'الحساب',
      signOut: 'تسجيل الخروج',
      signIn: 'تسجيل الدخول',
      chatHistory: 'سجل المحادثات',
      resetProgress: 'إعادة تعيين التقدم',
      resetWarning: 'سيؤدي هذا إلى مسح سجل القراءة وتقدمك.',
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
        auto: 'تلقائي (موصى به) - يستخدم آخر موضع من أي طريقة',
        scroll: 'حسب التمرير (آخر موضع قمت بالتمرير إليه)',
        bookmark: 'حسب الإشارة المرجعية (آخر آية أضفتها للإشارات)',
        reciting: 'حسب التلاوة (آخر آية قمت بتشغيلها)',
        click: 'حسب النقر (آخر آية تفاعلت معها)',
      },
      regions: {
        auto: 'تلقائي (حسب الموقع)',
        mecca: 'مكة المكرمة',
        medina: 'المدينة المنورة',
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
      language: 'Language',
      theme: 'Theme',
      translationSource: 'Translation Source',
      translationOff: 'Translation Off',
      tafsirOff: 'Tafsir Off',
      fontType: 'Font Type',
      tafsirSource: 'Tafsir Source',
      prayerRegion: 'Prayer Times Region',
      trackingMode: 'Reading Tracking Mode',
      trackingModeDesc: 'How should the app remember where you left off?',
      account: 'Account',
      signOut: 'Sign Out',
      signIn: 'Sign In',
      chatHistory: 'Chat History',
      resetProgress: 'Reset Progress',
      resetWarning: 'This will clear your reading history and progress.',
      themes: {
        light: 'Light',
        dark: 'Dark',
        gold: 'Gold',
        pink: 'Pink',
        green: 'Green',
        system: 'System',
      },
      fonts: {
        quran: 'Uthmanic Hafs',
        amiri: 'Amiri',
        scheherazade: 'Scheherazade New',
        lateef: 'Lateef',
        'noto-naskh': 'Noto Naskh Arabic',
        normal: 'Normal Font',
      },
      trackingModes: {
        auto: 'Auto (Recommended) - uses most recent from any method',
        scroll: 'By Scroll (last position you scrolled to)',
        bookmark: 'By Bookmark (last ayah you bookmarked)',
        reciting: 'By Reciting (last ayah you played)',
        click: 'By Click (last ayah you interacted with)',
      },
      regions: {
        auto: 'Auto (based on location)',
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
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Header - Centered like Account */}
      <div className="text-center space-y-3 pt-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {t.title}
          </span>
        </h1>
      </div>

      {/* Profile Section - Centered like Account */}
      {user && profile && (
        <div className="text-center space-y-4 glass-effect rounded-3xl p-8 border border-border/30 backdrop-blur-xl">
          <Avatar className="h-24 w-24 mx-auto">
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {profile.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{profile.full_name || 'User'}</h2>
            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
          </div>
        </div>
      )}

      {/* Account Actions */}
      <div className="glass-effect rounded-3xl p-6 space-y-4 border border-border/30 backdrop-blur-xl">
        {user ? (
          <div className="space-y-3">
            <Link to="/account">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <User className="h-5 w-5" />
                <span className="font-semibold">{t.account}</span>
              </Button>
            </Link>
            <Link to="/chat-history">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <MessageSquare className="h-5 w-5" />
                <span className="font-semibold">{t.chatHistory}</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-semibold">{t.signOut}</span>
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate('/auth')} className="w-full h-12">
            {t.signIn}
          </Button>
        )}
      </div>

      {/* Language */}
      <div className="glass-effect rounded-3xl p-6 space-y-4 border border-border/30 backdrop-blur-xl">
        <Label className="text-base font-semibold">{t.language}</Label>
        <Select
          value={settings.language}
          onValueChange={(value: 'ar' | 'en') => updateSettings({ language: value })}
        >
          <SelectTrigger className="glass-effect h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Theme */}
      <div className="glass-effect rounded-3xl p-6 space-y-4 border border-border/30 backdrop-blur-xl">
        <Label className="text-base font-semibold">{t.theme}</Label>
        <Select
          value={settings.theme}
          onValueChange={(value: any) => updateSettings({ theme: value })}
        >
          <SelectTrigger className="glass-effect h-12">
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

      {/* Font Type */}
      <div className="glass-effect rounded-3xl p-6 space-y-4 border border-border/30 backdrop-blur-xl">
        <Label className="text-base font-semibold">{t.fontType}</Label>
        <Select
          value={settings.fontType}
          onValueChange={(value: any) => updateSettings({ fontType: value })}
        >
          <SelectTrigger className="glass-effect h-12">
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

      {/* Translation Source */}
      <div className="glass-effect rounded-3xl p-6 space-y-4 border border-border/30 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">{t.translationSource}</Label>
          <Switch
            checked={settings.translationEnabled}
            onCheckedChange={(checked) => updateSettings({ translationEnabled: checked })}
          />
        </div>
        {settings.translationEnabled ? (
          <Select
            value={settings.translationSource}
            onValueChange={(value) => updateSettings({ translationSource: value })}
          >
            <SelectTrigger className="glass-effect h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transliteration">{settings.language === 'ar' ? 'النطق اللاتيني' : 'Transliteration'}</SelectItem>
              <SelectItem value="en.sahih">Sahih International (English)</SelectItem>
              <SelectItem value="en.pickthall">Pickthall (English)</SelectItem>
              <SelectItem value="en.yusufali">Yusuf Ali (English)</SelectItem>
              <SelectItem value="ar.muyassar">الميسر (العربية)</SelectItem>
              <SelectItem value="ur.jalandhry">اردو - جالندری</SelectItem>
              <SelectItem value="fr.hamidullah">Hamidullah (Français)</SelectItem>
              <SelectItem value="tr.diyanet">Diyanet (Türkçe)</SelectItem>
              <SelectItem value="de.bubenheim">Bubenheim (Deutsch)</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-muted-foreground">{t.translationOff}</p>
        )}
      </div>

      {/* Tafsir Source */}
      <div className="glass-effect rounded-3xl p-6 space-y-4 border border-border/30 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">{t.tafsirSource}</Label>
          <Switch
            checked={settings.tafsirEnabled}
            onCheckedChange={(checked) => updateSettings({ tafsirEnabled: checked })}
          />
        </div>
        {settings.tafsirEnabled ? (
          <Select
            value={settings.tafsirSource}
            onValueChange={(value) => updateSettings({ tafsirSource: value })}
          >
            <SelectTrigger className="glass-effect h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-tafisr-ibn-kathir">Ibn Kathir (English)</SelectItem>
              <SelectItem value="ar-tafsir-ibn-kathir">ابن كثير (العربية)</SelectItem>
              <SelectItem value="en-tafseer-maududi">Maududi (English)</SelectItem>
              <SelectItem value="ar-tafsir-al-jalalayn">الجلالين (العربية)</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-muted-foreground">{t.tafsirOff}</p>
        )}
      </div>

      {/* Prayer Times Region */}
      <div className="glass-effect rounded-3xl p-6 space-y-4 border border-border/30 backdrop-blur-xl">
        <Label className="text-base font-semibold">{t.prayerRegion}</Label>
        <Select
          value={settings.prayerTimeRegion || 'auto'}
          onValueChange={(value) => updateSettings({ prayerTimeRegion: value === 'auto' ? null : value })}
        >
          <SelectTrigger className="glass-effect h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">{t.regions.auto}</SelectItem>
            <SelectItem value="21.4225,39.8262">{t.regions.mecca}</SelectItem>
            <SelectItem value="24.4672,39.6111">{t.regions.medina}</SelectItem>
            <SelectItem value="30.0444,31.2357">{t.regions.cairo}</SelectItem>
            <SelectItem value="24.7136,46.6753">{t.regions.riyadh}</SelectItem>
            <SelectItem value="25.2048,55.2708">{t.regions.dubai}</SelectItem>
            <SelectItem value="41.0082,28.9784">{t.regions.istanbul}</SelectItem>
            <SelectItem value="51.5074,-0.1278">{t.regions.london}</SelectItem>
            <SelectItem value="40.7128,-74.0060">{t.regions.newYork}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reading Tracking Mode */}
      <div className="glass-effect rounded-3xl p-6 space-y-4 border border-border/30 backdrop-blur-xl">
        <div className="space-y-2">
          <Label className="text-base font-semibold">{t.trackingMode}</Label>
          <p className="text-sm text-muted-foreground">{t.trackingModeDesc}</p>
        </div>
        <Select
          value={settings.readingTrackingMode}
          onValueChange={(value: any) => updateSettings({ readingTrackingMode: value })}
        >
          <SelectTrigger className="glass-effect h-12">
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

      {/* Reset Progress */}
      {user && (
        <div className="glass-effect rounded-3xl p-6 space-y-4 border border-destructive/30 backdrop-blur-xl">
          <div className="space-y-2">
            <Label className="text-base font-semibold text-destructive">{t.resetProgress}</Label>
            <p className="text-sm text-muted-foreground">{t.resetWarning}</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-3 h-12">
                <RotateCcw className="h-5 w-5" />
                <span className="font-semibold">{t.resetProgress}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {settings.language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
                </AlertDialogTitle>
                <AlertDialogDescription>{t.resetWarning}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {settings.language === 'ar' ? 'إلغاء' : 'Cancel'}
                </AlertDialogCancel>
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