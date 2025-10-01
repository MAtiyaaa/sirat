import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, BookOpen, Home, MessageSquare, Settings } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { settings } = useSettings();

  const navItems = [
    { 
      path: '/quran', 
      icon: Book, 
      label: { ar: 'القرآن', en: 'Quran' } 
    },
    { 
      path: '/duas', 
      icon: BookOpen, 
      label: { ar: 'أدعية', en: 'Duas' } 
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
    { 
      path: '/settings', 
      icon: Settings, 
      label: { ar: 'الإعدادات', en: 'Settings' } 
    },
  ];

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
              const isActive = location.pathname === item.path;
              const isHome = item.path === '/';
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
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
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
