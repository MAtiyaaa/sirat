import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, Moon, Home, MessageSquare } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import MoreDialog from './MoreDialog';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();

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
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border z-50">
        <div className="container mx-auto max-w-4xl">
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
