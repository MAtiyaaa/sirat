import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings = () => {
  const { settings, updateSettings } = useSettings();

  const content = {
    ar: {
      title: 'الإعدادات',
      language: 'اللغة',
      theme: 'المظهر',
      qari: 'القارئ',
      tajweed: 'تفعيل التجويد',
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
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      qari: 'Reciter',
      tajweed: 'Enable Tajweed',
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground">
          {settings.language === 'ar' 
            ? 'خصص تجربتك في قراءة القرآن'
            : 'Customize your Quran reading experience'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Language */}
        <div className="glass-effect rounded-2xl p-6 space-y-4">
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
        <div className="glass-effect rounded-2xl p-6 space-y-4">
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
        <div className="glass-effect rounded-2xl p-6 space-y-4">
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
        <div className="glass-effect rounded-2xl p-6 space-y-4">
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
        <div className="glass-effect rounded-2xl p-6 space-y-4">
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
        <div className="glass-effect rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">{t.tajweed}</Label>
            <Switch
              checked={settings.tajweedEnabled}
              onCheckedChange={(checked) => updateSettings({ tajweedEnabled: checked })}
            />
          </div>

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
      </div>
    </div>
  );
};

export default Settings;
