import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Clock, Sparkles, User, Settings, BookMarked, History, Repeat, Crown, Star, Landmark, Scroll, ChevronRight } from 'lucide-react';

interface NavigationCardProps {
  type: 'surah' | 'ayah' | 'prayer' | 'stories' | 'account' | 'settings' | 'bookmarks' | 'history' | 'hadith' | 'duas' | 'tasbih' | 'stories-and-names' | 'islamic-history' | 'rashidun' | 'empires' | 'golden-age' | 'holy-cities' | 'names-allah';
  data?: {
    surahNumber?: number;
    ayahNumber?: number;
    surahName?: string;
    ayahText?: string;
    book?: string;
    search?: string;
  };
}

const NavigationCard: React.FC<NavigationCardProps> = ({ type, data }) => {
  const getCardConfig = () => {
    switch (type) {
      case 'surah':
        return { icon: Book, title: data?.surahName || `Surah ${data?.surahNumber}`, description: `Go to Surah ${data?.surahNumber}`, link: `/quran/${data?.surahNumber}`, iconGradient: 'from-blue-500 to-cyan-500', accentColor: 'bg-blue-500/8 border-blue-500/15' };
      case 'ayah':
        return { icon: BookMarked, title: `Surah ${data?.surahNumber}, Ayah ${data?.ayahNumber}`, description: data?.ayahText?.slice(0, 60) + '...' || 'View this ayah', link: `/quran/${data?.surahNumber}?ayah=${data?.ayahNumber}`, iconGradient: 'from-emerald-500 to-teal-500', accentColor: 'bg-emerald-500/8 border-emerald-500/15' };
      case 'prayer':
        return { icon: Clock, title: 'Prayer Times', description: 'View daily prayer times', link: '/prayer', iconGradient: 'from-amber-500 to-orange-500', accentColor: 'bg-amber-500/8 border-amber-500/15' };
      case 'stories':
        return { icon: Sparkles, title: 'Prophet Stories', description: 'Learn from the stories of prophets', link: '/prophet-stories', iconGradient: 'from-purple-500 to-pink-500', accentColor: 'bg-purple-500/8 border-purple-500/15' };
      case 'stories-and-names':
        return { icon: Book, title: 'Education', description: 'Islamic stories and names', link: '/stories-and-names', iconGradient: 'from-violet-500 to-indigo-500', accentColor: 'bg-violet-500/8 border-violet-500/15' };
      case 'account':
        return { icon: User, title: 'Account', description: 'Manage your profile', link: '/account', iconGradient: 'from-indigo-500 to-cyan-500', accentColor: 'bg-indigo-500/8 border-indigo-500/15' };
      case 'settings':
        return { icon: Settings, title: 'Settings', description: 'Customize your experience', link: '/settings', iconGradient: 'from-slate-500 to-zinc-500', accentColor: 'bg-slate-500/8 border-slate-500/15' };
      case 'bookmarks':
        return { icon: BookMarked, title: 'Bookmarks', description: 'View your saved ayahs', link: '/bookmarks', iconGradient: 'from-rose-500 to-pink-500', accentColor: 'bg-rose-500/8 border-rose-500/15' };
      case 'history':
        return { icon: History, title: 'Chat History', description: 'View past conversations', link: '/chat-history', iconGradient: 'from-teal-500 to-cyan-500', accentColor: 'bg-teal-500/8 border-teal-500/15' };
      case 'hadith':
        const hadithLink = data?.book ? `/hadith?book=${data.book}${data.search ? `&search=${data.search}` : ''}` : data?.search ? `/hadith?search=${data.search}` : '/hadith';
        return { icon: Book, title: 'Hadith Collection', description: data?.search ? `Search: ${data.search}` : 'Explore authentic Hadiths', link: hadithLink, iconGradient: 'from-green-500 to-emerald-500', accentColor: 'bg-green-500/8 border-green-500/15' };
      case 'duas':
        return { icon: Sparkles, title: 'Duas', description: 'Islamic supplications', link: '/duas', iconGradient: 'from-violet-500 to-purple-500', accentColor: 'bg-violet-500/8 border-violet-500/15' };
      case 'tasbih':
        return { icon: Repeat, title: 'Tasbih Counter', description: 'Digital dhikr counter', link: '/tasbih', iconGradient: 'from-cyan-500 to-blue-500', accentColor: 'bg-cyan-500/8 border-cyan-500/15' };
      case 'islamic-history':
        return { icon: Book, title: 'Islamic History', description: 'Explore Islamic history & civilizations', link: '/islamichistory', iconGradient: 'from-amber-500 to-yellow-500', accentColor: 'bg-amber-500/8 border-amber-500/15' };
      case 'rashidun':
        return { icon: Crown, title: 'Rashidun Caliphs', description: 'The rightly guided caliphs', link: '/empires/rashidun', iconGradient: 'from-emerald-500 to-teal-500', accentColor: 'bg-emerald-500/8 border-emerald-500/15' };
      case 'empires':
        return { icon: Crown, title: 'Islamic Empires', description: 'Major Islamic empires through history', link: '/empires', iconGradient: 'from-purple-500 to-rose-500', accentColor: 'bg-purple-500/8 border-purple-500/15' };
      case 'golden-age':
        return { icon: Star, title: 'Golden Age of Islam', description: 'Sciences, arts & civilizational achievements', link: '/islamichistory/golden-age', iconGradient: 'from-amber-500 to-orange-500', accentColor: 'bg-amber-500/8 border-amber-500/15' };
      case 'holy-cities':
        return { icon: Landmark, title: 'Holy Cities', description: 'Makkah, Madinah & Jerusalem', link: '/holy-cities', iconGradient: 'from-green-500 to-emerald-500', accentColor: 'bg-green-500/8 border-green-500/15' };
      case 'names-allah':
        return { icon: Scroll, title: 'Names of Allah', description: 'The 99 Beautiful Names', link: '/names-of-allah', iconGradient: 'from-fuchsia-500 to-pink-500', accentColor: 'bg-fuchsia-500/8 border-fuchsia-500/15' };
      default:
        return null;
    }
  };

  const config = getCardConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Link to={config.link} className="block group my-2 animate-fade-in">
      <div className="glass-card rounded-2xl p-4 hover:border-primary/25 smooth-transition relative overflow-hidden group-hover:rich-shadow">
        {/* Subtle accent glow on hover */}
        <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 smooth-transition ${config.accentColor.split(' ')[0]}`} />
        
        <div className="flex items-center gap-4 relative">
          <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${config.iconGradient} flex items-center justify-center group-hover:scale-105 smooth-transition shadow-lg`}>
            <Icon className="h-5 w-5 text-white drop-shadow-sm" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-0.5 truncate">
              {config.title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {config.description}
            </p>
          </div>
          
          <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 smooth-transition flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
};

export default NavigationCard;
