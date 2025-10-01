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
  theme: 'system',
  qari: 'ar.alafasy',
  translationEnabled: true,
  transliterationEnabled: true,
  fontType: 'quran',
  tafsirSource: 'en-tafisr-ibn-kathir',
  prayerTimeRegion: null,
  readingTrackingMode: 'auto',
};

// Load settings from localStorage immediately (synchronously) for instant availability
const loadInitialSettings = (): Settings => {
  try {
    const stored = localStorage.getItem('sirat-settings');
    if (stored) {
      const parsedSettings = JSON.parse(stored);
      return { ...defaultSettings, ...parsedSettings };
    }
  } catch (error) {
    console.error('Error loading initial settings from localStorage:', error);
  }
  return defaultSettings;
};

// Apply theme immediately on load
const applyTheme = (theme: Theme) => {
  document.documentElement.classList.remove('light', 'dark', 'gold', 'pink');
  
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.classList.add(theme);
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with localStorage settings immediately (synchronous)
  const initialSettings = loadInitialSettings();
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Apply theme immediately on mount
  React.useEffect(() => {
    applyTheme(initialSettings.theme);
    document.documentElement.dir = initialSettings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = initialSettings.language;
  }, []);

  // Load settings from database or localStorage
  useEffect(() => {
    const loadSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);

      if (session?.user?.id) {
        // Load from database for logged-in users
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

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
      }
      // Note: We don't need to load from localStorage here since it's already loaded in initial state
      setIsLoaded(true);
    };

    loadSettings();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUserId(session?.user?.id || null);
      setIsLoaded(false);
      if (session?.user?.id) {
        // User just signed in - load from database
        await loadSettings();
      } else {
        // User just signed out - reload from localStorage
        const stored = localStorage.getItem('sirat-settings');
        if (stored) {
          try {
            const parsedSettings = JSON.parse(stored);
            setSettings({ ...defaultSettings, ...parsedSettings });
          } catch (error) {
            console.error('Error parsing settings from localStorage:', error);
            setSettings(defaultSettings);
          }
        } else {
          setSettings(defaultSettings);
        }
        setIsLoaded(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Apply theme whenever settings change
    applyTheme(settings.theme);
    
    // Apply direction
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;

    // Listen for system theme changes when in system mode
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme, settings.language]);

  useEffect(() => {
    // Don't save settings until they've been loaded initially
    if (!isLoaded) return;

    // Always save to localStorage for instant availability on refresh
    try {
      localStorage.setItem('sirat-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }

    // Also save to database if logged in
    if (userId) {
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
    }
  }, [settings, userId, isLoaded]);

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
