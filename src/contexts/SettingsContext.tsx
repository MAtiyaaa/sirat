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
  theme: 'system', // System is default
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
  const [isSaving, setIsSaving] = useState(false);

  // Apply theme immediately on mount
  React.useEffect(() => {
    applyTheme(initialSettings.theme);
    document.documentElement.dir = initialSettings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = initialSettings.language;
  }, []);

  // Load settings from database or localStorage
  useEffect(() => {
    const loadSettings = async () => {
      console.log('[Settings] Loading settings...');
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || null;
      console.log('[Settings] User ID:', currentUserId);
      setUserId(currentUserId);

      if (currentUserId) {
        console.log('[Settings] Fetching from database for user:', currentUserId);
        // Load from database for logged-in users
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', currentUserId)
          .maybeSingle();

        if (error) {
          console.error('[Settings] Error loading from database:', error);
        }

        if (data && !error) {
          console.log('[Settings] Loaded from database:', data);
          const dbSettings = {
            language: (data.language as Language) || defaultSettings.language,
            theme: (data.theme as Theme) || defaultSettings.theme,
            qari: data.qari || defaultSettings.qari,
            translationEnabled: data.translation_enabled ?? defaultSettings.translationEnabled,
            transliterationEnabled: data.transliteration_enabled ?? defaultSettings.transliterationEnabled,
            fontType: (data.font_type as FontType) || defaultSettings.fontType,
            tafsirSource: data.tafsir_source || defaultSettings.tafsirSource,
            prayerTimeRegion: data.prayer_time_region || defaultSettings.prayerTimeRegion,
            readingTrackingMode: (data.reading_tracking_mode as ReadingTrackingMode) || defaultSettings.readingTrackingMode,
          };
          console.log('[Settings] Setting state to DB settings:', dbSettings);
          setSettings(dbSettings);
          // Also update localStorage to keep them in sync
          try {
            localStorage.setItem('sirat-settings', JSON.stringify(dbSettings));
            console.log('[Settings] Synced to localStorage');
          } catch (error) {
            console.error('[Settings] Error syncing to localStorage:', error);
          }
        } else {
          console.log('[Settings] No settings in database, using localStorage/defaults');
        }
      } else {
        console.log('[Settings] No user logged in, using localStorage');
      }
      setIsLoaded(true);
      console.log('[Settings] Load complete, isLoaded=true');
    };

    loadSettings();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Settings] Auth state changed:', event, 'User:', session?.user?.id);
      setUserId(session?.user?.id || null);
      setIsLoaded(false);
      await loadSettings();
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
    if (!isLoaded) {
      console.log('[Settings] Skipping save - not loaded yet');
      return;
    }
    
    if (isSaving) {
      console.log('[Settings] Skipping save - already saving');
      return;
    }

    console.log('[Settings] Save triggered. UserId:', userId, 'Settings:', settings);

    // Always save to localStorage for instant availability on refresh
    try {
      localStorage.setItem('sirat-settings', JSON.stringify(settings));
      console.log('[Settings] Saved to localStorage');
    } catch (error) {
      console.error('[Settings] Error saving to localStorage:', error);
    }

    // Also save to database if logged in
    if (userId) {
      console.log('[Settings] Saving to database for user:', userId);
      setIsSaving(true);
      
      const settingsData = {
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
      };
      
      console.log('[Settings] Upserting data:', settingsData);
      
      supabase
        .from('user_settings')
        .upsert(settingsData, {
          onConflict: 'user_id'
        })
        .then(({ data, error }) => {
          setIsSaving(false);
          if (error) {
            console.error('[Settings] Database save ERROR:', error);
          } else {
            console.log('[Settings] Database save SUCCESS:', data);
          }
        });
    } else {
      console.log('[Settings] Not saving to database - no user logged in');
    }
  }, [settings, userId, isLoaded, isSaving]);

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
