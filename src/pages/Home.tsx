import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Droplet, MessageSquare, Sparkles } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Home = () => {
  const { settings } = useSettings();

  const features = [
    {
      icon: Book,
      title: { ar: 'القرآن الكريم', en: 'Holy Quran' },
      description: { 
        ar: 'اقرأ وتعلم مع التفسير والترجمة', 
        en: 'Read and learn with tafsir and translation' 
      },
      link: '/quran',
      gradient: 'from-primary/20 to-accent/20',
    },
    {
      icon: Droplet,
      title: { ar: 'خطوات الوضوء', en: 'Wudu Steps' },
      description: { 
        ar: 'دليل كامل لأداء الوضوء', 
        en: 'Complete guide to performing wudu' 
      },
      link: '/wudu',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: MessageSquare,
      title: { ar: 'قلم - المساعد الذكي', en: 'Qalam - AI Assistant' },
      description: { 
        ar: 'اسأل أسئلة إسلامية واحصل على إجابات', 
        en: 'Ask Islamic questions and get answers' 
      },
      link: '/qalam',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Hero Section */}
      <div className="text-center py-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {settings.language === 'ar' ? 'بسم الله الرحمن الرحيم' : 'In the name of Allah'}
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {settings.language === 'ar' ? 'سراط' : 'Sirat'}
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {settings.language === 'ar' 
            ? 'رفيقك في رحلة تعلم القرآن الكريم'
            : 'Your companion in the journey of learning the Quran'}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 flex-1">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.link}
              to={feature.link}
              className="group"
            >
              <div className="glass-effect rounded-3xl p-8 h-full smooth-transition hover:scale-[1.02] hover:shadow-xl apple-shadow">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 smooth-transition`}>
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title[settings.language]}
                </h3>
                
                <p className="text-muted-foreground">
                  {feature.description[settings.language]}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-3 gap-4">
        <div className="text-center glass-effect rounded-2xl p-4">
          <div className="text-2xl font-bold text-primary">114</div>
          <div className="text-sm text-muted-foreground">
            {settings.language === 'ar' ? 'سورة' : 'Surahs'}
          </div>
        </div>
        <div className="text-center glass-effect rounded-2xl p-4">
          <div className="text-2xl font-bold text-primary">6236</div>
          <div className="text-sm text-muted-foreground">
            {settings.language === 'ar' ? 'آية' : 'Ayahs'}
          </div>
        </div>
        <div className="text-center glass-effect rounded-2xl p-4">
          <div className="text-2xl font-bold text-primary">30</div>
          <div className="text-sm text-muted-foreground">
            {settings.language === 'ar' ? 'جزء' : 'Juz'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
