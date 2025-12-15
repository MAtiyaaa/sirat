import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, Moon, Home, MessageSquare, Play, Pause, Lock, LockOpen, Eye, ChevronUp, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAudio } from '@/contexts/AudioContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import MoreDialog from './MoreDialog';

declare global {
  interface Window {
    quranLockState?: boolean;
  }
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { playingSurah, playingAyah, isPlaying, pauseSurah, resumeSurah, stopSurah } = useAudio();
  const [isLocked, setIsLocked] = useState(false);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  
  const appName = settings.language === 'ar' 
    ? <span className="arabic-regal text-3xl">صراط</span>
    : 'Sirat';

  const isInQuranPage = location.pathname.startsWith('/quran/') && location.pathname !== '/quran';

  // Check auto-lock setting when surah starts playing
  useEffect(() => {
    if (playingSurah && isInQuranPage) {
      const autoLockEnabled = localStorage.getItem('quran_auto_lock') === 'true';
      setIsLocked(autoLockEnabled);
    }
  }, [playingSurah, isInQuranPage]);

  // Reset lock when leaving Quran page
  useEffect(() => {
    if (!isInQuranPage) {
      setIsLocked(false);
    }
  }, [isInQuranPage]);

  // Store lock state globally so SurahDetail can access it
  useEffect(() => {
    window.quranLockState = isLocked;
  }, [isLocked]);

  // Track when user leaves a surah to remember position
  useEffect(() => {
    const currentPath = location.pathname;
    
    // If we're in a surah detail page, save it
    if (currentPath.startsWith('/quran/') && currentPath !== '/quran') {
      localStorage.setItem('lastSurahPath', currentPath);
    }
  }, [location.pathname]);

  // Save position to database when leaving a surah
  useEffect(() => {
    const handleBeforeNavigate = async () => {
      const currentPath = location.pathname;
      
      // If we're leaving a surah page
      if (currentPath.startsWith('/quran/') && currentPath !== '/quran') {
        const surahNumber = currentPath.split('/')[2];
        if (!surahNumber) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // Update last viewed surah
        await supabase
          .from('last_viewed_surah')
          .upsert({
            user_id: session.user.id,
            surah_number: parseInt(surahNumber),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
      }
    };

    // Save when the path changes (user navigates away)
    handleBeforeNavigate();
  }, [location.pathname]);

  const handleQuranClick = (e: React.MouseEvent) => {
    const currentPath = location.pathname;
    const lastSurahPath = localStorage.getItem('lastSurahPath');
    
    // If we're in a surah and clicking Quran tab, go to list
    if (currentPath.startsWith('/quran/') && currentPath !== '/quran') {
      // Clear the saved path since they explicitly want to go to list
      localStorage.removeItem('lastSurahPath');
      return; // Let Link navigate normally to /quran
    }
    
    // If we have a saved surah and we're not already viewing it, restore it
    if (lastSurahPath && currentPath !== lastSurahPath) {
      e.preventDefault();
      navigate(lastSurahPath);
    }
  };

  const handleOtherTabClick = (path: string) => (e: React.MouseEvent) => {
    const currentPath = location.pathname;
    
    // If we're in a surah, the useEffect will save it
    // Just navigate normally
    if (currentPath.startsWith('/quran/') && currentPath !== '/quran') {
      // Path is already being saved by useEffect
      return;
    }
  };

  const handleGoToAyah = () => {
    if (playingSurah && playingAyah) {
      navigate(`/quran/${playingSurah}?ayah=${playingAyah}`);
    }
  };

  const navItems = [
    { 
      path: '/quran', 
      icon: Book, 
      label: { ar: 'القرآن', en: 'Quran' } 
    },
    { 
      path: '/prayer', 
      icon: Moon, 
      label: { ar: 'الصلاة', en: 'Prayer' } 
    },
    { 
      path: '/', 
      icon: Home, 
      label: { ar: 'الرئيسية', en: 'Home' } 
    },
    { 
      path: '/qalam', 
      icon: MessageSquare, 
      label: { ar: 'قلم', en: 'Qalam' } 
    },
  ];

  const isInSurahDetail = location.pathname.startsWith('/quran/') && location.pathname !== '/quran';

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-4xl pb-24 md:pb-20">
        {children}
      </main>

      {/* Minimized Player Button */}
      {playingSurah && isPlayerMinimized && (
        <button
          onClick={() => setIsPlayerMinimized(false)}
          className="fixed bottom-20 left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-50 animate-pulse"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border z-50 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl">
          {/* Global Play Controls - Above Nav */}
          {playingSurah && !isPlayerMinimized && (
            <div className="border-b border-border/50 py-2 px-4">
              <div className="flex items-center justify-center gap-2">
                {/* Minimize button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPlayerMinimized(true)}
                  className="rounded-full w-8 h-8"
                  title={settings.language === 'ar' ? 'تصغير' : 'Minimize'}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Lock button - only show on Quran page */}
                {isInQuranPage && (
                  <Button
                    variant={isLocked ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsLocked(!isLocked)}
                    className="rounded-full w-10 h-10"
                    title={settings.language === 'ar' ? 
                      (isLocked ? 'إلغاء القفل' : 'قفل') : 
                      (isLocked ? 'Unlock' : 'Lock')}
                  >
                    {isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                  </Button>
                )}

                {/* Go to Ayah button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleGoToAyah}
                  className="rounded-full w-10 h-10"
                  title={settings.language === 'ar' ? 'اذهب إلى الآية' : 'Go to Ayah'}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                {/* Play/Pause - always show when playing */}
                <Button
                  onClick={isPlaying ? pauseSurah : resumeSurah}
                  className="rounded-full w-12 h-12 shadow-lg"
                  title={isPlaying ? 
                    (settings.language === 'ar' ? 'إيقاف مؤقت' : 'Pause') : 
                    (settings.language === 'ar' ? 'تشغيل' : 'Play')}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                
                <span className="text-xs text-muted-foreground">
                  {settings.language === 'ar' 
                    ? `سورة ${playingSurah} - آية ${playingAyah || 1}` 
                    : `Surah ${playingSurah} - Ayah ${playingAyah || 1}`}
                </span>
              </div>
            </div>
          )}
          
          {/* Navigation Tabs */}
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isQuranTab = item.path === '/quran';
              const isActive = isQuranTab 
                ? (location.pathname === '/quran' || location.pathname.startsWith('/quran/'))
                : location.pathname === item.path;
              const isHome = item.path === '/';
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={isQuranTab ? handleQuranClick : undefined}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl smooth-transition ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground'
                  } ${isHome ? 'scale-110' : ''}`}
                >
                  <Icon className={`h-6 w-6 ${isHome ? 'h-7 w-7' : ''}`} />
                  <span className="text-xs font-medium">
                    {item.label[settings.language]}
                  </span>
                </Link>
              );
            })}
            <MoreDialog />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
