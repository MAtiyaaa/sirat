import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, Moon, Home, MessageSquare, Play, Pause, Lock, LockOpen, Eye, ChevronUp, X, Volume2 } from 'lucide-react';
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

  useEffect(() => {
    if (playingSurah && isInQuranPage) {
      const autoLockEnabled = localStorage.getItem('quran_auto_lock') === 'true';
      setIsLocked(autoLockEnabled);
    }
  }, [playingSurah, isInQuranPage]);

  useEffect(() => {
    if (!isInQuranPage) setIsLocked(false);
  }, [isInQuranPage]);

  useEffect(() => { window.quranLockState = isLocked; }, [isLocked]);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.startsWith('/quran/') && currentPath !== '/quran') {
      localStorage.setItem('lastSurahPath', currentPath);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleBeforeNavigate = async () => {
      const currentPath = location.pathname;
      if (currentPath.startsWith('/quran/') && currentPath !== '/quran') {
        const surahNumber = currentPath.split('/')[2];
        if (!surahNumber) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        await supabase.from('last_viewed_surah').upsert({
          user_id: session.user.id, surah_number: parseInt(surahNumber),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      }
    };
    handleBeforeNavigate();
  }, [location.pathname]);

  const handleQuranClick = (e: React.MouseEvent) => {
    const currentPath = location.pathname;
    const lastSurahPath = localStorage.getItem('lastSurahPath');
    if (currentPath.startsWith('/quran/') && currentPath !== '/quran') {
      localStorage.removeItem('lastSurahPath');
      return;
    }
    if (lastSurahPath && currentPath !== lastSurahPath) {
      e.preventDefault();
      navigate(lastSurahPath);
    }
  };

  const handleGoToAyah = () => {
    if (playingSurah && playingAyah) {
      navigate(`/quran/${playingSurah}?ayah=${playingAyah}`);
    }
  };

  const navItems = [
    { path: '/quran', icon: Book, label: { ar: 'القرآن', en: 'Quran' } },
    { path: '/prayer', icon: Moon, label: { ar: 'الصلاة', en: 'Prayer' } },
    { path: '/', icon: Home, label: { ar: 'الرئيسية', en: 'Home' } },
    { path: '/qalam', icon: MessageSquare, label: { ar: 'قلم', en: 'Qalam' } },
  ];

  return (
    <div className="min-h-screen bg-background islamic-pattern-bg">
      <main className="container mx-auto px-4 py-6 max-w-4xl pb-28 md:pb-24">
        {children}
      </main>

      {/* Minimized Player - Floating Pill */}
      {playingSurah && isPlayerMinimized && (
        <button
          onClick={() => setIsPlayerMinimized(false)}
          className="fixed bottom-24 left-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-glow-md animate-fade-in-scale interactive-press"
        >
          <Volume2 className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-semibold">
            {settings.language === 'ar' ? `سورة ${playingSurah}` : `Surah ${playingSurah}`}
          </span>
          <ChevronUp className="h-3.5 w-3.5 opacity-60" />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="glass-nav">
          <div className="container mx-auto max-w-4xl">
            {/* Global Play Controls */}
            {playingSurah && !isPlayerMinimized && (
              <div className="border-b border-border/20 py-3 px-4 animate-fade-in-down">
                <div className="flex items-center justify-center gap-2.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsPlayerMinimized(true)} 
                    className="rounded-full w-8 h-8 hover:bg-destructive/10 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {isInQuranPage && (
                    <Button 
                      variant={isLocked ? "default" : "outline"} 
                      size="icon" 
                      onClick={() => setIsLocked(!isLocked)} 
                      className="rounded-full w-10 h-10"
                    >
                      {isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleGoToAyah} 
                    className="rounded-full w-10 h-10"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={isPlaying ? pauseSurah : resumeSurah} 
                    className="rounded-full w-12 h-12 shadow-glow-md"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <span className="text-xs font-medium text-muted-foreground ml-1">
                    {settings.language === 'ar' ? `سورة ${playingSurah} - آية ${playingAyah || 1}` : `Surah ${playingSurah} - Ayah ${playingAyah || 1}`}
                  </span>
                </div>
              </div>
            )}
            
            {/* Navigation Tabs */}
            <div className="flex justify-around items-center py-2 px-2">
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
                    className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl smooth-transition relative ${
                      isActive 
                        ? 'nav-pill-active' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-primary animate-scale-bounce" />
                    )}
                    <Icon 
                      className={`${isHome ? 'h-7 w-7' : 'h-[22px] w-[22px]'} smooth-transition ${
                        isActive ? 'drop-shadow-sm' : ''
                      }`} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                      {item.label[settings.language]}
                    </span>
                  </Link>
                );
              })}
              <MoreDialog />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
