import React from 'react';
import { Link } from 'react-router-dom';
import { Book, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';

const Home = () => {
  const { settings } = useSettings();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      icon: Book,
      title: { ar: 'القرآن الكريم', en: 'Holy Quran' },
      description: { 
        ar: 'اقرأ وتعلم مع التفسير والترجمة', 
        en: 'Read and learn with tafsir and translation' 
      },
      link: '/quran',
      gradient: 'from-blue-500/20 via-blue-400/20 to-cyan-500/20',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: MessageSquare,
      title: { ar: 'قلم - المساعد الذكي', en: 'Qalam AI' },
      description: { 
        ar: 'اسأل أسئلة إسلامية واحصل على إجابات', 
        en: 'Islamic questions answered instantly' 
      },
      link: '/qalam',
      gradient: 'from-purple-500/20 via-pink-400/20 to-rose-500/20',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-6 py-16 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-border/50">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {settings.language === 'ar' ? 'بسم الله الرحمن الرحيم' : 'In the name of Allah, the Most Gracious'}
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Sirat
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
            {settings.language === 'ar' 
              ? 'رفيقك في رحلة تعلم القرآن الكريم'
              : 'Your companion in the journey of learning the Quran'}
          </p>

          {!user && (
            <Link 
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 smooth-transition"
            >
              {settings.language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.link}
                to={feature.link}
                className="group relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                
                <div className="relative glass-effect rounded-3xl p-8 md:p-10 h-full border border-border/50 hover:border-border smooth-transition backdrop-blur-xl">
                  <div className="space-y-6">
                    <div className={`inline-flex w-16 h-16 rounded-2xl ${feature.iconBg} items-center justify-center group-hover:scale-110 smooth-transition`}>
                      <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold tracking-tight">
                        {feature.title[settings.language]}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description[settings.language]}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 smooth-transition">
                      <span className="text-sm">
                        {settings.language === 'ar' ? 'استكشف' : 'Explore'}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { value: '114', label: settings.language === 'ar' ? 'سورة' : 'Surahs' },
            { value: '6,236', label: settings.language === 'ar' ? 'آية' : 'Verses' },
            { value: '30', label: settings.language === 'ar' ? 'جزء' : 'Juz' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="text-center glass-effect rounded-2xl p-6 border border-border/50 animate-fade-in"
              style={{ animationDelay: `${(i + 2) * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
