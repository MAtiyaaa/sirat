import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Clock, Sparkles, User, Settings, BookMarked, History } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface NavigationCardProps {
  type: 'surah' | 'ayah' | 'prayer' | 'stories' | 'account' | 'settings' | 'bookmarks' | 'history';
  data?: {
    surahNumber?: number;
    ayahNumber?: number;
    surahName?: string;
    ayahText?: string;
  };
}

const NavigationCard: React.FC<NavigationCardProps> = ({ type, data }) => {
  const getCardConfig = () => {
    switch (type) {
      case 'surah':
        return {
          icon: Book,
          title: data?.surahName || `Surah ${data?.surahNumber}`,
          description: `Go to Surah ${data?.surahNumber}`,
          link: `/quran/${data?.surahNumber}`,
          gradient: 'from-blue-500/20 via-blue-400/20 to-cyan-500/20',
          iconBg: 'bg-blue-500/10',
          iconColor: 'text-blue-600 dark:text-blue-400',
        };
      case 'ayah':
        return {
          icon: BookMarked,
          title: `Surah ${data?.surahNumber}, Ayah ${data?.ayahNumber}`,
          description: data?.ayahText?.slice(0, 60) + '...' || 'View this ayah',
          link: `/quran/${data?.surahNumber}?ayah=${data?.ayahNumber}`,
          gradient: 'from-emerald-500/20 via-emerald-400/20 to-teal-500/20',
          iconBg: 'bg-emerald-500/10',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'prayer':
        return {
          icon: Clock,
          title: 'Prayer Times',
          description: 'View daily prayer times',
          link: '/prayer',
          gradient: 'from-amber-500/20 via-orange-400/20 to-yellow-500/20',
          iconBg: 'bg-amber-500/10',
          iconColor: 'text-amber-600 dark:text-amber-400',
        };
      case 'stories':
        return {
          icon: Sparkles,
          title: 'Prophet Stories',
          description: 'Learn from the stories of prophets',
          link: '/prophet-stories',
          gradient: 'from-purple-500/20 via-pink-400/20 to-rose-500/20',
          iconBg: 'bg-purple-500/10',
          iconColor: 'text-purple-600 dark:text-purple-400',
        };
      case 'account':
        return {
          icon: User,
          title: 'Account',
          description: 'Manage your profile',
          link: '/account',
          gradient: 'from-indigo-500/20 via-blue-400/20 to-cyan-500/20',
          iconBg: 'bg-indigo-500/10',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
        };
      case 'settings':
        return {
          icon: Settings,
          title: 'Settings',
          description: 'Customize your experience',
          link: '/settings',
          gradient: 'from-slate-500/20 via-gray-400/20 to-zinc-500/20',
          iconBg: 'bg-slate-500/10',
          iconColor: 'text-slate-600 dark:text-slate-400',
        };
      case 'bookmarks':
        return {
          icon: BookMarked,
          title: 'Bookmarks',
          description: 'View your saved ayahs',
          link: '/bookmarks',
          gradient: 'from-rose-500/20 via-pink-400/20 to-fuchsia-500/20',
          iconBg: 'bg-rose-500/10',
          iconColor: 'text-rose-600 dark:text-rose-400',
        };
      case 'history':
        return {
          icon: History,
          title: 'Chat History',
          description: 'View past conversations',
          link: '/chat-history',
          gradient: 'from-teal-500/20 via-cyan-400/20 to-sky-500/20',
          iconBg: 'bg-teal-500/10',
          iconColor: 'text-teal-600 dark:text-teal-400',
        };
      default:
        return null;
    }
  };

  const config = getCardConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Link to={config.link} className="block group my-3 animate-fade-in">
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
        
        <Card className="relative glass-effect border border-border/30 hover:border-primary/30 smooth-transition backdrop-blur-xl p-4">
          <div className="flex items-center gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-0.5 truncate">
                {config.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {config.description}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Link>
  );
};

export default NavigationCard;
