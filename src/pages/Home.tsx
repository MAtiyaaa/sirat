import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Droplet, MessageSquare } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Home = () => {
  const { settings } = useSettings();

  const features = [
    {
      icon: Book,
      title: { ar: 'القرآن الكريم', en: 'Holy Quran' },
      link: '/quran',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Droplet,
      title: { ar: 'معلومات', en: 'Info' },
      link: '/info',
      bgColor: 'bg-cyan-100 dark:bg-cyan-950',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      icon: MessageSquare,
      title: { ar: 'قلم', en: 'Qalam' },
      link: '/qalam',
      bgColor: 'bg-purple-100 dark:bg-purple-950',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4 space-y-12">
        {/* Logo and Title */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center mb-8">
            <div className="text-6xl md:text-7xl" style={{ fontFamily: 'serif' }}>
              الله
            </div>
            <div className="text-6xl md:text-7xl ml-2">🌙</div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Sirat
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground">
            {settings.language === 'ar' 
              ? 'رفيقك في رحلة تعلم القرآن'
              : 'Your companion in the journey of learning the Quran'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.link}
                to={feature.link}
                className="group"
              >
                <div className="glass-effect rounded-3xl p-8 h-48 flex flex-col items-center justify-center hover:scale-105 smooth-transition apple-shadow">
                  <div className={`w-20 h-20 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 smooth-transition`}>
                    <Icon className={`h-10 w-10 ${feature.iconColor}`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-center">
                    {feature.title[settings.language]}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
