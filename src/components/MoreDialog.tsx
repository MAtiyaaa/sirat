import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/contexts/SettingsContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, 
  BookOpen, 
  User, 
  Settings as SettingsIcon, 
  LogOut,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

const MoreDialog = () => {
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [open, setOpen] = React.useState(false);

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
      setOpen(false);
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || (settings.language === 'ar' ? 'حدث خطأ' : 'An error occurred'));
    }
  };

  const content = {
    ar: {
      more: 'المزيد',
      prayerTimes: 'أوقات الصلاة',
      stories: 'قصص الأنبياء',
      account: 'الحساب',
      settings: 'الإعدادات',
      signOut: 'تسجيل الخروج',
      signIn: 'تسجيل الدخول',
      language: 'اللغة',
      theme: 'المظهر',
      qari: 'القارئ',
      translation: 'إظهار الترجمة',
      transliteration: 'إظهار النطق',
      fontType: 'نوع الخط',
      tafsirSource: 'مصدر التفسير',
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
      more: 'More',
      prayerTimes: 'Prayer Times',
      stories: 'Prophet Stories',
      account: 'Account',
      settings: 'Settings',
      signOut: 'Sign Out',
      signIn: 'Sign In',
      language: 'Language',
      theme: 'Theme',
      qari: 'Reciter',
      translation: 'Show Translation',
      transliteration: 'Show Transliteration',
      fontType: 'Font Type',
      tafsirSource: 'Tafsir Source',
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

  const handleNavigation = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl smooth-transition text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-6 w-6" />
          <span className="text-xs font-medium">{t.more}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto glass-effect backdrop-blur-xl border-border/50 p-0">
        <div className="sticky top-0 z-10 glass-effect border-b border-border/50 px-6 py-4">
          <h2 className="text-2xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {t.more}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={() => handleNavigation('/info')}
              className="w-full flex items-center justify-between p-4 rounded-2xl glass-effect border border-border/50 hover:border-border smooth-transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{t.prayerTimes}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <button
              onClick={() => handleNavigation('/prophet-stories')}
              className="w-full flex items-center justify-between p-4 rounded-2xl glass-effect border border-border/50 hover:border-border smooth-transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{t.stories}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Account Section */}
          <div className="glass-effect rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">{t.account}</Label>
            </div>
            {user ? (
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">{user.email}</p>
                  <p className="text-muted-foreground">
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.signOut}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => handleNavigation('/auth')}
                className="w-full"
                size="sm"
              >
                {t.signIn}
              </Button>
            )}
          </div>

          {/* Settings Section */}
          <div className="glass-effect rounded-2xl p-4 border border-border/50 space-y-4">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">{t.settings}</Label>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label className="text-sm">{t.language}</Label>
              <Select
                value={settings.language}
                onValueChange={(value: 'ar' | 'en') => updateSettings({ language: value })}
              >
                <SelectTrigger className="glass-effect h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <Label className="text-sm">{t.theme}</Label>
              <Select
                value={settings.theme}
                onValueChange={(value: any) => updateSettings({ theme: value })}
              >
                <SelectTrigger className="glass-effect h-9">
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

            {/* Font */}
            <div className="space-y-2">
              <Label className="text-sm">{t.fontType}</Label>
              <Select
                value={settings.fontType}
                onValueChange={(value: any) => updateSettings({ fontType: value })}
              >
                <SelectTrigger className="glass-effect h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quran">{t.fonts.quran}</SelectItem>
                  <SelectItem value="normal">{t.fonts.normal}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Qari */}
            <div className="space-y-2">
              <Label className="text-sm">{t.qari}</Label>
              <Select
                value={settings.qari}
                onValueChange={(value) => updateSettings({ qari: value })}
              >
                <SelectTrigger className="glass-effect h-9">
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

            {/* Tafsir */}
            <div className="space-y-2">
              <Label className="text-sm">{t.tafsirSource}</Label>
              <Select
                value={settings.tafsirSource}
                onValueChange={(value) => updateSettings({ tafsirSource: value })}
              >
                <SelectTrigger className="glass-effect h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-tafisr-ibn-kathir">Ibn Kathir (EN)</SelectItem>
                  <SelectItem value="ar-tafsir-ibn-kathir">ابن كثير (AR)</SelectItem>
                  <SelectItem value="en-tafseer-maududi">Maududi (EN)</SelectItem>
                  <SelectItem value="ar-tafsir-al-jalalayn">الجلالين (AR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Toggles */}
            <div className="pt-2 space-y-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{t.translation}</Label>
                <Switch
                  checked={settings.translationEnabled}
                  onCheckedChange={(checked) => updateSettings({ translationEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">{t.transliteration}</Label>
                <Switch
                  checked={settings.transliterationEnabled}
                  onCheckedChange={(checked) => updateSettings({ transliterationEnabled: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoreDialog;
