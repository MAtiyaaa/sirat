import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark' | 'gold' | 'pink' | 'system';
export type FontType = 'quran' | 'normal';
export type ReadingTrackingMode = 'auto' | 'scroll' | 'bookmark' | 'reciting' | 'click';

interface Settings {
  language: Language;
  theme: Theme;
  qari: string;
  translationEnabled: boolean;
  transliterationEnabled: boolean;
  fontType: FontType;
  tafsirSource: string;
  prayerTimeRegion: string | null;
  readingTrackingMode: ReadingTrackingMode;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  language: 'en',
  theme: 'light',
  qari: 'ar.alafasy',
  translationEnabled: true,
  transliterationEnabled: true,
  fontType: 'quran',
  tafsirSource: 'en-tafisr-ibn-kathir',
  prayerTimeRegion: null,
  readingTrackingMode: 'auto',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [userId, setUserId] = useState<string | null>(null);

  // Load settings from database or localStorage
  useEffect(() => {
    const loadSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);

      if (session?.user?.id) {
        // Load from database
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (data && !error) {
          setSettings({
            language: (data.language as Language) || defaultSettings.language,
            theme: (data.theme as Theme) || defaultSettings.theme,
            qari: data.qari || defaultSettings.qari,
            translationEnabled: data.translation_enabled ?? defaultSettings.translationEnabled,
            transliterationEnabled: data.transliteration_enabled ?? defaultSettings.transliterationEnabled,
            fontType: (data.font_type as FontType) || defaultSettings.fontType,
            tafsirSource: data.tafsir_source || defaultSettings.tafsirSource,
            prayerTimeRegion: data.prayer_time_region || defaultSettings.prayerTimeRegion,
            readingTrackingMode: (data.reading_tracking_mode as ReadingTrackingMode) || defaultSettings.readingTrackingMode,
          });
        }
      } else {
        // Load from localStorage
        const stored = localStorage.getItem('sirat-settings');
        if (stored) {
          setSettings({ ...defaultSettings, ...JSON.parse(stored) });
        }
      }
    };

    loadSettings();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
      if (session?.user?.id) {
        loadSettings();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.remove('light', 'dark', 'gold', 'pink');
    
    if (settings.theme === 'system') {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.classList.add(settings.theme);
    }
    
    // Apply direction
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;

    // Save settings
    if (userId) {
      // Save to database
      supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          language: settings.language,
          theme: settings.theme,
          qari: settings.qari,
          translation_enabled: settings.translationEnabled,
          transliteration_enabled: settings.transliterationEnabled,
          font_type: settings.fontType,
          tafsir_source: settings.tafsirSource,
          prayer_time_region: settings.prayerTimeRegion,
          reading_tracking_mode: settings.readingTrackingMode,
        })
        .then(() => {});
    } else {
      // Save to localStorage
      localStorage.setItem('sirat-settings', JSON.stringify(settings));
    }
  }, [settings, userId]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
