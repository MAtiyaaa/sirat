import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Language = 'ar' | 'en';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColor = 'blue' | 'green' | 'gold' | 'pink' | 'red';
export type FontType = 'quran' | 'amiri' | 'scheherazade' | 'lateef' | 'noto-naskh' | 'normal';
export type ReadingTrackingMode = 'auto' | 'scroll' | 'bookmark' | 'reciting' | 'click';
export type WordByWordMode = 'off' | 'click' | 'under';
export type QuranDisplayMode = 'surah' | 'juz' | 'surah-juz-markers';

interface Settings {
  language: Language;
  themeMode: ThemeMode;
  themeColor: ThemeColor;
  translationEnabled: boolean;
  translationSource: string;
  fontType: FontType;
  tafsirEnabled: boolean;
  tafsirSource: string;
  prayerTimeRegion: string | null;
  readingTrackingMode: ReadingTrackingMode;
  wordByWordMode: WordByWordMode;
  quranDisplayMode: QuranDisplayMode;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  language: 'ar',
  themeMode: 'system',
  themeColor: 'blue',
  translationEnabled: true,
  translationSource: 'ar.muyassar',
  fontType: 'quran',
  tafsirEnabled: true,
  tafsirSource: 'ar-tafsir-ibn-kathir',
  prayerTimeRegion: null,
  readingTrackingMode: 'auto',
  wordByWordMode: 'off',
  quranDisplayMode: 'surah',
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
const applyTheme = (mode: ThemeMode, color: ThemeColor) => {
  document.documentElement.classList.remove('light', 'dark', 'blue', 'green', 'gold', 'pink', 'red');
  
  let actualMode = mode;
  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    actualMode = prefersDark ? 'dark' : 'light';
  }
  
  document.documentElement.classList.add(actualMode, color);
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
    applyTheme(initialSettings.themeMode, initialSettings.themeColor);
    document.documentElement.dir = initialSettings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = initialSettings.language;
  }, []);

  // Load settings from database or localStorage
  useEffect(() => {
    let isSubscribed = true;

    const loadSettings = async () => {
      try {
        console.log('[Settings] Loading settings...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('[Settings] Error getting session:', sessionError);
          setIsLoaded(true);
          return;
        }

        if (!isSubscribed) {
          console.log('[Settings] Component unmounted, aborting load');
          return;
        }

        const currentUserId = session?.user?.id || null;
        console.log('[Settings] User ID:', currentUserId);
        setUserId(currentUserId);

        if (currentUserId) {
          console.log('[Settings] Fetching from database for user:', currentUserId);
          
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', currentUserId)
            .maybeSingle();

          if (error) {
            console.error('[Settings] Error loading from database:', error);
            setIsLoaded(true);
            return;
          }

          if (!isSubscribed) {
            console.log('[Settings] Component unmounted after DB fetch, aborting');
            return;
          }

          if (data) {
            console.log('[Settings] Loaded from database:', data);
            const dbSettings: Settings = {
              language: (data.language as Language) || defaultSettings.language,
              themeMode: (data.theme_mode as ThemeMode) || defaultSettings.themeMode,
              themeColor: (data.theme_color as ThemeColor) || defaultSettings.themeColor,
              translationEnabled: data.translation_enabled ?? defaultSettings.translationEnabled,
              translationSource: data.translation_source || defaultSettings.translationSource,
              fontType: (data.font_type as FontType) || defaultSettings.fontType,
              tafsirEnabled: data.tafsir_enabled ?? defaultSettings.tafsirEnabled,
              tafsirSource: data.tafsir_source || defaultSettings.tafsirSource,
              prayerTimeRegion: data.prayer_time_region || defaultSettings.prayerTimeRegion,
              readingTrackingMode: (data.reading_tracking_mode as ReadingTrackingMode) || defaultSettings.readingTrackingMode,
              // Handle migration from boolean to string
              wordByWordMode: typeof data.word_by_word_display === 'boolean' 
                ? (data.word_by_word_display ? 'under' : 'click') 
                : (data.word_by_word_display as WordByWordMode) || defaultSettings.wordByWordMode,
              quranDisplayMode: (data.quran_display_mode as QuranDisplayMode) || defaultSettings.quranDisplayMode,
            };
            console.log('[Settings] Setting state to DB settings:', dbSettings);
            setSettings(dbSettings);
            
            // Also update localStorage
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
      } catch (error) {
        console.error('[Settings] Unexpected error in loadSettings:', error);
        setIsLoaded(true);
      }
    };

    loadSettings();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isSubscribed) return;
      
      console.log('[Settings] Auth state changed:', event, 'User:', session?.user?.id);
      setUserId(session?.user?.id || null);
      setIsLoaded(false);
      
      // Use setTimeout to break out of the auth callback context
      setTimeout(() => {
        if (isSubscribed) {
          loadSettings();
        }
      }, 0);
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Apply theme whenever settings change
    applyTheme(settings.themeMode, settings.themeColor);
    
    // Apply direction
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;

    // Listen for system theme changes when in system mode
    if (settings.themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme('system', settings.themeColor);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.themeMode, settings.themeColor, settings.language]);

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
        theme_mode: settings.themeMode,
        theme_color: settings.themeColor,
        translation_enabled: settings.translationEnabled,
        translation_source: settings.translationSource,
        font_type: settings.fontType,
        tafsir_enabled: settings.tafsirEnabled,
        tafsir_source: settings.tafsirSource,
        prayer_time_region: settings.prayerTimeRegion,
        reading_tracking_mode: settings.readingTrackingMode,
        word_by_word_display: settings.wordByWordMode as string,
        quran_display_mode: settings.quranDisplayMode,
      } as any;
      
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
