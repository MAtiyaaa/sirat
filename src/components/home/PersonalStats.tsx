import { useState, useEffect, useRef } from 'react';
import { BookOpen, Calendar, Bookmark, TrendingUp } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface PersonalStatsProps {
  stats: {
    surahsRead: number;
    daysOpened: number;
    bookmarksCount: number;
    quranProgress: number;
  } | null;
  loading: boolean;
}

const AnimatedCounter = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const increment = value / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={countRef}>{count}</span>;
};

const PersonalStats = ({ stats, loading }: PersonalStatsProps) => {
  const { settings } = useSettings();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-effect rounded-2xl p-4 border border-border/20 animate-pulse">
            <div className="h-12 bg-muted/50 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      icon: BookOpen,
      value: stats.surahsRead,
      total: 114,
      label: settings.language === 'ar' ? 'سورة مكتملة' : 'Surahs Read',
      gradient: 'from-primary to-primary/70',
      showProgress: true,
    },
    {
      icon: Calendar,
      value: stats.daysOpened,
      label: settings.language === 'ar' ? 'يوم نشاط' : 'Days Active',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Bookmark,
      value: stats.bookmarksCount,
      label: settings.language === 'ar' ? 'محفوظات' : 'Bookmarks',
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      icon: TrendingUp,
      value: stats.quranProgress,
      label: settings.language === 'ar' ? 'تقدم القرآن' : 'Quran Progress',
      gradient: 'from-purple-500 to-pink-500',
      isPercentage: true,
    },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground px-1">
        {settings.language === 'ar' ? 'رحلتك' : 'Your Journey'}
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="glass-effect rounded-2xl p-4 border border-border/20 hover:border-border/40 smooth-transition group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 smooth-transition`} />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    <AnimatedCounter value={item.value} />
                  </span>
                  {item.isPercentage && <span className="text-sm font-bold text-muted-foreground">%</span>}
                  {item.total && (
                    <span className="text-xs text-muted-foreground">/{item.total}</span>
                  )}
                </div>
                
                <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase mt-1">
                  {item.label}
                </p>
                
                {/* Mini progress bar for surahs */}
                {item.showProgress && (
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.gradient} rounded-full smooth-transition`}
                      style={{ width: `${(item.value / (item.total || 1)) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalStats;
