import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, Moon, Home, MessageSquare, Play, Pause, Lock, LockOpen, X } from 'lucide-react';
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
      <main className="container mx-auto px-4 py-6 max-w-4xl pb-24 md:pb-20">
        {children}
      </main>

      {/* Minimized Player */}
      {playingSurah && isPlayerMinimized && (
        <button
          onClick={() => setIsPlayerMinimized(false)}
          className="fixed bottom-24 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rich-shadow flex items-center justify-center z-50 animate-glow-pulse hover:scale-110 smooth-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={settings.language === 'ar' ? 'إظهار المشغل' : 'Show audio player'}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>
      )}

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        aria-label={settings.language === 'ar' ? 'القائمة الرئيسية' : 'Main navigation'}
      >
        {/* Frosted glass background with rich blur */}
        <div className="glass-effect border-t border-border/50 backdrop-blur-2xl">
          <div className="container mx-auto max-w-4xl">
            {/* Global Play Controls */}
            {playingSurah && !isPlayerMinimized && (
              <div
                className="border-b border-border/30 px-3 py-2.5"
                role="region"
                aria-label={settings.language === 'ar' ? 'مشغل القرآن' : 'Quran audio player'}
              >
                <div className="flex items-center gap-2.5">
                  {/* Now playing info */}
                  <button
                    onClick={handleGoToAyah}
                    className="flex items-center gap-2.5 flex-1 min-w-0 text-left rounded-xl px-2 py-1.5 hover:bg-primary/8 smooth-transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                    aria-label={
                      settings.language === 'ar'
                        ? `الذهاب إلى سورة ${playingSurah} آية ${playingAyah || 1}`
                        : `Jump to Surah ${playingSurah}, Ayah ${playingAyah || 1}`
                    }
                  >
                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center rich-shadow flex-shrink-0">
                      {isPlaying && (
                        <div className="absolute inset-0 rounded-xl bg-primary/40 blur-md animate-glow-pulse" aria-hidden="true" />
                      )}
                      <Book className="h-4 w-4 text-primary-foreground relative z-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none">
                        {settings.language === 'ar' ? 'يُتلى الآن' : 'Now Reciting'}
                      </p>
                      <p className="text-xs font-semibold truncate mt-0.5">
                        {settings.language === 'ar' ? `سورة ${playingSurah} • آية ${playingAyah || 1}` : `Surah ${playingSurah} • Ayah ${playingAyah || 1}`}
                      </p>
                    </div>
                  </button>

                  {/* Controls */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isInQuranPage && (
                      <Button
                        variant={isLocked ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setIsLocked(!isLocked)}
                        className="rounded-full w-9 h-9 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        title={isLocked ? 'Unlock' : 'Lock'}
                        aria-label={
                          settings.language === 'ar'
                            ? isLocked ? 'إلغاء قفل التمرير' : 'قفل التمرير'
                            : isLocked ? 'Unlock auto-scroll' : 'Lock auto-scroll'
                        }
                        aria-pressed={isLocked}
                      >
                        {isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                      </Button>
                    )}
                    <Button
                      onClick={isPlaying ? pauseSurah : resumeSurah}
                      className="rounded-full w-11 h-11 rich-shadow bg-gradient-to-br from-primary to-primary/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      title={isPlaying ? 'Pause' : 'Play'}
                      aria-label={
                        settings.language === 'ar'
                          ? isPlaying ? 'إيقاف مؤقت' : 'تشغيل'
                          : isPlaying ? 'Pause recitation' : 'Resume recitation'
                      }
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsPlayerMinimized(true)}
                      className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      title="Minimize"
                      aria-label={settings.language === 'ar' ? 'تصغير المشغل' : 'Minimize player'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Tabs - Enhanced */}
            <div className="flex justify-around items-center py-1.5">
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
                    aria-label={item.label[settings.language]}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl smooth-transition relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    } ${isHome ? 'scale-110' : ''}`}
                  >
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-primary" aria-hidden="true" />
                    )}
                    <Icon
                      className={`${isHome ? 'h-7 w-7' : 'h-6 w-6'} smooth-transition ${isActive ? 'drop-shadow-sm' : ''}`}
                      aria-hidden="true"
                    />
                    <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
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
