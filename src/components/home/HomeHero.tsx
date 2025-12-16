import { Sparkles } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface HomeHeroProps {
  firstName?: string;
}

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const getGreeting = (timeOfDay: string, language: 'ar' | 'en', firstName?: string) => {
  const greetings = {
    morning: { ar: 'صباح الخير', en: 'Good Morning' },
    afternoon: { ar: 'مساء الخير', en: 'Good Afternoon' },
    evening: { ar: 'مساء النور', en: 'Good Evening' },
    night: { ar: 'مساء الخير', en: 'Good Night' },
  };
  
  const greeting = greetings[timeOfDay as keyof typeof greetings][language];
  if (firstName) {
    return language === 'ar' ? `${greeting}، ${firstName}` : `${greeting}, ${firstName}`;
  }
  return greeting;
};

const HomeHero = ({ firstName }: HomeHeroProps) => {
  const { settings } = useSettings();
  const timeOfDay = getTimeOfDay();
  const greeting = getGreeting(timeOfDay, settings.language, firstName);

  // Time-based gradient colors
  const timeGradients = {
    morning: 'from-amber-500/20 via-orange-400/10 to-yellow-300/20',
    afternoon: 'from-sky-500/20 via-blue-400/10 to-cyan-300/20',
    evening: 'from-orange-500/20 via-rose-400/10 to-pink-300/20',
    night: 'from-indigo-500/20 via-purple-400/10 to-blue-300/20',
  };

  return (
    <div className="relative pt-8 pb-6 animate-fade-in">
      {/* Decorative Islamic Pattern Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="islamic-pattern-hero" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 0 L20 10 L10 20 L0 10 Z M10 5 L15 10 L10 15 L5 10 Z" fill="currentColor"/>
          </pattern>
          <rect width="100" height="100" fill="url(#islamic-pattern-hero)" />
        </svg>
      </div>

      {/* Animated Gradient Orbs - Time Based */}
      <div className={`absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br ${timeGradients[timeOfDay]} rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '4s' }} />
      <div className={`absolute top-8 right-1/4 w-56 h-56 bg-gradient-to-br ${timeGradients[timeOfDay]} rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '5s', animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative text-center space-y-3">
        {/* Personalized Greeting */}
        {firstName && (
          <p className="text-sm font-medium text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
            {greeting}
          </p>
        )}
        
        {/* Bismillah Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary tracking-wider">
            بسم الله الرحمن الرحيم
          </span>
        </div>
        
        {/* Main Title */}
        <div className="relative">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight ios-26-style relative z-10">
            {settings.language === 'ar' ? (
              <span className="bg-gradient-to-br from-foreground via-primary to-foreground bg-clip-text text-transparent arabic-regal drop-shadow-sm" style={{ lineHeight: '1.1' }}>
                صراط
              </span>
            ) : (
              <span className="bg-gradient-to-br from-foreground via-primary to-foreground bg-clip-text text-transparent drop-shadow-sm" style={{ lineHeight: '1.1' }}>
                Sirat
              </span>
            )}
          </h1>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r from-primary/50 via-purple-500/50 to-primary/50 -z-10" />
        </div>
        
        {/* Subtitle */}
        <p className="text-sm text-muted-foreground font-light tracking-wide">
          {settings.language === 'ar' 
            ? 'اقرأ. تدبّر. تذكّر.'
            : 'Read. Reflect. Remember.'}
        </p>
      </div>
    </div>
  );
};

export default HomeHero;
