import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark' | 'gold' | 'pink';
export type FontType = 'quran' | 'normal';

interface Settings {
  language: Language;
  theme: Theme;
  qari: string;
  tajweedEnabled: boolean;
  translationEnabled: boolean;
  transliterationEnabled: boolean;
  fontType: FontType;
  tafsirSource: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  language: 'ar',
  theme: 'light',
  qari: 'ar.alafasy',
  tajweedEnabled: false,
  translationEnabled: true,
  transliterationEnabled: true,
  fontType: 'quran',
  tafsirSource: 'en-tafisr-ibn-kathir',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('sirat-settings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('sirat-settings', JSON.stringify(settings));
    
    // Apply theme
    document.documentElement.classList.remove('light', 'dark', 'gold', 'pink');
    document.documentElement.classList.add(settings.theme);
    
    // Apply direction
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings]);

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
