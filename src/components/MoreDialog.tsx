import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSettings } from '@/contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  User, 
  Settings as SettingsIcon,
  MoreHorizontal,
  Bookmark,
  CircleDot,
  Hand,
  Scroll,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';

const MoreDialog = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const content = {
    ar: {
      more: 'المزيد',
      duas: 'الأدعية',
      hadith: 'الأحاديث',
      tasbih: 'التسبيح',
      zakat: 'الزكاة',
      stories: 'تعليم',
      mosque: 'المساجد',
      bookmarks: 'الإشارات المرجعية',
      account: 'الحساب',
      settings: 'الإعدادات',
    },
    en: {
      more: 'More',
      duas: 'Duas',
      hadith: 'Hadith',
      tasbih: 'Tasbih',
      zakat: 'Zakat',
      stories: 'Education',
      mosque: 'Mosques',
      bookmarks: 'Bookmarks',
      account: 'Account',
      settings: 'Settings',
    },
  };

  const t = content[settings.language];

  const menuItems = [
    { icon: BookOpen, label: t.hadith, path: '/hadith' },
    { icon: Hand, label: t.duas, path: '/duas' },
    { icon: Scroll, label: t.stories, path: '/education' },
    { icon: CircleDot, label: t.tasbih, path: '/tasbih' },
    { icon: Calculator, label: t.zakat, path: '/zakat' },
    { icon: MapPin, label: t.mosque, path: '/mosquelocator' },
    { icon: Bookmark, label: t.bookmarks, path: '/bookmarks' },
    { icon: User, label: t.account, path: '/account' },
    { icon: SettingsIcon, label: t.settings, path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl smooth-transition text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-6 w-6" />
          <span className="text-xs font-medium">{t.more}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-48 p-2 glass-effect backdrop-blur-xl border-border/50 shadow-xl"
        align="center"
        side="top"
        sideOffset={8}
      >
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/50 smooth-transition text-left"
            >
              <item.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MoreDialog;
