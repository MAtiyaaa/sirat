import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, User, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(settings.language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Signed out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || (settings.language === 'ar' ? 'حدث خطأ' : 'An error occurred'));
    }
  };

  const content = {
    ar: {
      title: 'الإعدادات',
      language: 'اللغة',
      theme: 'المظهر',
      qari: 'القارئ',
      translation: 'إظهار الترجمة',
      transliteration: 'إظهار النطق',
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
      },
      fonts: {
        quran: 'خط المصحف',
        normal: 'خط عادي',
      },
      trackingModes: {
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
      qari: 'Reciter',
      translation: 'Show Translation',
      transliteration: 'Show Transliteration',
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
      },
      fonts: {
        quran: 'Quran Font',
        normal: 'Normal Font',
      },
      trackingModes: {
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
              <SelectItem value="light">{t.themes.light}</SelectItem>
              <SelectItem value="dark">{t.themes.dark}</SelectItem>
              <SelectItem value="gold">{t.themes.gold}</SelectItem>
              <SelectItem value="pink">{t.themes.pink}</SelectItem>
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
              <SelectItem value="normal">{t.fonts.normal}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Qari */}
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-4 border border-border/50 backdrop-blur-xl">
          <Label className="text-base font-semibold">{t.qari}</Label>
          <Select
            value={settings.qari}
            onValueChange={(value) => updateSettings({ qari: value })}
          >
            <SelectTrigger className="glass-effect">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar.alafasy">Mishary Alafasy</SelectItem>
              <SelectItem value="ar.abdulbasitmurattal">Abdul Basit</SelectItem>
              <SelectItem value="ar.husary">Mahmoud Khalil Al-Husary</SelectItem>
              <SelectItem value="ar.minshawi">Mohamed Siddiq Al-Minshawi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tafsir Source */}
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-4 border border-border/50 backdrop-blur-xl">
          <Label className="text-base font-semibold">{t.tafsirSource}</Label>
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
        </div>

        {/* Toggle Settings */}
        <div className="glass-effect rounded-3xl p-6 md:p-8 space-y-6 border border-border/50 backdrop-blur-xl">
          <Label className="text-lg font-semibold mb-4 block">
            {settings.language === 'ar' ? 'خيارات العرض' : 'Display Options'}
          </Label>

          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">{t.translation}</Label>
            <Switch
              checked={settings.translationEnabled}
              onCheckedChange={(checked) => updateSettings({ translationEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">{t.transliteration}</Label>
            <Switch
              checked={settings.transliterationEnabled}
              onCheckedChange={(checked) => updateSettings({ transliterationEnabled: checked })}
            />
          </div>
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
      </div>
    </div>
  );
};

export default Settings;
