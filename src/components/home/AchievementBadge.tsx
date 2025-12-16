import { useState, useEffect } from 'react';
import { Trophy, Flame, BookOpen, Star, Moon } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface AchievementBadgeProps {
  stats: {
    surahsRead: number;
    daysOpened: number;
    streak?: number;
  } | null;
}

type Achievement = {
  id: string;
  icon: typeof Trophy;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  gradient: string;
  unlocked: boolean;
};

const AchievementBadge = ({ stats }: AchievementBadgeProps) => {
  const { settings } = useSettings();
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!stats) return;

    // Define achievements based on user stats
    const achievements: Achievement[] = [
      {
        id: 'streak-3',
        icon: Flame,
        title: { ar: 'سلسلة 3 أيام!', en: '3-Day Streak!' },
        description: { ar: 'استمر في القراءة', en: 'Keep reading daily' },
        gradient: 'from-orange-500 to-red-500',
        unlocked: (stats.streak || stats.daysOpened) >= 3,
      },
      {
        id: 'streak-7',
        icon: Flame,
        title: { ar: 'سلسلة أسبوع!', en: '7-Day Streak!' },
        description: { ar: 'أسبوع من القراءة المستمرة', en: 'A week of consistent reading' },
        gradient: 'from-orange-500 to-amber-500',
        unlocked: (stats.streak || stats.daysOpened) >= 7,
      },
      {
        id: 'surahs-10',
        icon: BookOpen,
        title: { ar: '10 سور مكتملة!', en: '10 Surahs Complete!' },
        description: { ar: 'بداية رائعة', en: 'Great start on your journey' },
        gradient: 'from-green-500 to-emerald-500',
        unlocked: stats.surahsRead >= 10,
      },
      {
        id: 'surahs-30',
        icon: Star,
        title: { ar: '30 سورة مكتملة!', en: '30 Surahs Complete!' },
        description: { ar: 'ربع القرآن', en: 'A quarter of the Quran' },
        gradient: 'from-purple-500 to-pink-500',
        unlocked: stats.surahsRead >= 30,
      },
      {
        id: 'night-reader',
        icon: Moon,
        title: { ar: 'قارئ الليل', en: 'Night Reader' },
        description: { ar: 'القراءة في الليل', en: 'Reading during the night' },
        gradient: 'from-indigo-500 to-purple-500',
        unlocked: new Date().getHours() >= 21 || new Date().getHours() < 5,
      },
    ];

    // Find the highest unlocked achievement
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    if (unlockedAchievements.length > 0) {
      // Show the most impressive one (last in the filtered list as they're ordered by difficulty)
      setCurrentAchievement(unlockedAchievements[unlockedAchievements.length - 1]);
      setIsVisible(true);
    }
  }, [stats]);

  if (!isVisible || !currentAchievement) return null;

  const Icon = currentAchievement.icon;

  return (
    <div className="animate-fade-in">
      <div className={`relative overflow-hidden rounded-2xl border border-border/30 p-4 bg-gradient-to-r ${currentAchievement.gradient} bg-opacity-10`}>
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        
        {/* Sparkle effects */}
        <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-4 right-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-3 right-6 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
        
        <div className="relative flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentAchievement.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-foreground">
              {currentAchievement.title[settings.language]}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentAchievement.description[settings.language]}
            </p>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground smooth-transition p-1"
            aria-label="Dismiss"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;
