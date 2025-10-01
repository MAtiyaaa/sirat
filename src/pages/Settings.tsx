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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                </div>
              </div>
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
