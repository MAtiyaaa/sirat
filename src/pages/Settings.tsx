import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, User, MessageSquare, RotateCcw } from 'lucide-react';
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
      // Clear from database
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

      // Clear from localStorage
      localStorage.removeItem('quran_last_position');
      localStorage.removeItem('reading_progress');
      localStorage.removeItem('last_viewed_surah');

      toast.success(settings.language === 'ar' ? 'تم إعادة التعيين' : 'Progress reset');
      
      // Reload page to reflect changes
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
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {t.title}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          {settings.language === 'ar' 
            ? 'خصص تجربتك في قراءة القرآن'
            : 'Customize your Quran reading experience'}
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Account Section */}
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-6 border border-border/50 backdrop-blur-xl">
          <Label className="text-base font-semibold">{t.account}</Label>
          {user ? (
            <div className="space-y-4">
              <Link to="/account">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.signOut}
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              {t.signIn}
            </Button>
          )}
        </div>

        {/* Language */}
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-4 border border-border/50 backdrop-blur-xl">
          <Label className="text-base font-semibold">{t.language}</Label>
          <Select
            value={settings.language}
            onValueChange={(value: 'ar' | 'en') => updateSettings({ language: value })}
          >
            <SelectTrigger className="glass-effect">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Theme */}
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-4 border border-border/50 backdrop-blur-xl">
          <Label className="text-base font-semibold">{t.theme}</Label>
          <Select
            value={settings.theme}
            onValueChange={(value: any) => updateSettings({ theme: value })}
          >
            <SelectTrigger className="glass-effect">
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
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-4 border border-border/50 backdrop-blur-xl">
          <Label className="text-base font-semibold">{t.fontType}</Label>
          <Select
            value={settings.fontType}
            onValueChange={(value: any) => updateSettings({ fontType: value })}
          >
            <SelectTrigger className="glass-effect">
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
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-4 border border-border/50 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
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
              <SelectTrigger className="glass-effect">
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
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-4 border border-border/50 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
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
              <SelectTrigger className="glass-effect">
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
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-4 border border-border/50 backdrop-blur-xl">
          <Label className="text-base font-semibold">{t.prayerRegion}</Label>
          <Select
            value={settings.prayerTimeRegion || 'auto'}
            onValueChange={(value) => updateSettings({ prayerTimeRegion: value === 'auto' ? null : value })}
          >
            <SelectTrigger className="glass-effect">
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
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-4 border border-border/50 backdrop-blur-xl">
          <div className="space-y-2">
            <Label className="text-base font-semibold">{t.trackingMode}</Label>
            <p className="text-sm text-muted-foreground">{t.trackingModeDesc}</p>
          </div>
          <Select
            value={settings.readingTrackingMode}
            onValueChange={(value: any) => updateSettings({ readingTrackingMode: value })}
          >
            <SelectTrigger className="glass-effect">
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

        {/* Chat History Link */}
        <div className="glass-effect rounded-3xl p-6 md:p-8 border border-border/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <Label className="text-lg font-semibold">
              {settings.language === 'ar' ? 'الذكاء الاصطناعي' : 'AI Assistant'}
            </Label>
          </div>
          <Link to="/chat-history">
            <Button variant="outline" className="w-full">
              {settings.language === 'ar' ? 'عرض سجل المحادثات' : 'View Chat History'}
            </Button>
          </Link>
        </div>

        {/* Reset Reading Progress */}
        {user && (
          <div className="glass-effect rounded-3xl p-6 md:p-8 border border-destructive/30 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="h-5 w-5 text-destructive" />
              <Label className="text-lg font-semibold text-destructive">
                {settings.language === 'ar' ? 'إعادة تعيين التقدم' : 'Reset Progress'}
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {settings.language === 'ar' 
                ? 'سيؤدي هذا إلى حذف جميع بيانات التقدم في القراءة من الجهاز والخادم'
                : 'This will delete all reading progress data from local storage, server, and database'}
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  {settings.language === 'ar' ? 'إعادة تعيين كل التقدم' : 'Reset All Progress'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {settings.language === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {settings.language === 'ar'
                      ? 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع بيانات تقدم القراءة بشكل دائم.'
                      : 'This action cannot be undone. This will permanently delete all your reading progress data.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {settings.language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetAllProgress} className="bg-destructive hover:bg-destructive/90">
                    {settings.language === 'ar' ? 'إعادة التعيين' : 'Reset'}
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
