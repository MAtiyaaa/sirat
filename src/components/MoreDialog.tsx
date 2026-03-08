import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSettings } from '@/contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, User, Settings as SettingsIcon, MoreHorizontal,
  Bookmark, CircleDot, Hand, Scroll, MapPin, Calculator, ChevronRight
} from 'lucide-react';

const MoreDialog = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const content = {
    ar: { more: 'المزيد', duas: 'الأدعية', hadith: 'الأحاديث', tasbih: 'التسبيح', zakat: 'الزكاة', stories: 'تعليم', mosque: 'المساجد', bookmarks: 'الإشارات المرجعية', account: 'الحساب', settings: 'الإعدادات' },
    en: { more: 'More', duas: 'Duas', hadith: 'Hadith', tasbih: 'Tasbih', zakat: 'Zakat', stories: 'Education', mosque: 'Mosques', bookmarks: 'Bookmarks', account: 'Account', settings: 'Settings' },
  };

  const t = content[settings.language];

  const menuItems = [
    { icon: BookOpen, label: t.hadith, path: '/hadith', gradient: 'from-green-500 to-emerald-500' },
    { icon: Hand, label: t.duas, path: '/duas', gradient: 'from-purple-500 to-pink-500' },
    { icon: Scroll, label: t.stories, path: '/education', gradient: 'from-indigo-500 to-purple-500' },
    { icon: CircleDot, label: t.tasbih, path: '/tasbih', gradient: 'from-teal-500 to-cyan-500' },
    { icon: Calculator, label: t.zakat, path: '/zakat', gradient: 'from-amber-500 to-yellow-500' },
    { icon: MapPin, label: t.mosque, path: '/mosquelocator', gradient: 'from-violet-500 to-purple-500' },
    { icon: Bookmark, label: t.bookmarks, path: '/bookmarks', gradient: 'from-rose-500 to-pink-500' },
    { icon: User, label: t.account, path: '/account', gradient: 'from-blue-500 to-cyan-500' },
    { icon: SettingsIcon, label: t.settings, path: '/settings', gradient: 'from-slate-500 to-zinc-500' },
  ];

  const handleNavigation = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl smooth-transition text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-6 w-6" />
          <span className="text-[10px] font-medium">{t.more}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-52 p-2 glass-card backdrop-blur-2xl border-border/30 shadow-2xl"
        align="center"
        side="top"
        sideOffset={8}
      >
        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/8 smooth-transition text-left group"
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0`}>
                <item.icon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-medium flex-1">{item.label}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary/60 smooth-transition" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MoreDialog;
