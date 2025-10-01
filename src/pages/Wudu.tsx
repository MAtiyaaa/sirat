import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Card } from '@/components/ui/card';
import { Loader2, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const Wudu = () => {
  const { settings } = useSettings();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();

      if (data.code === 200) {
        setPrayerTimes({
          Fajr: data.data.timings.Fajr,
          Dhuhr: data.data.timings.Dhuhr,
          Asr: data.data.timings.Asr,
          Maghrib: data.data.timings.Maghrib,
          Isha: data.data.timings.Isha,
        });
        setLocation(`${data.data.meta.timezone}`);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      setPrayerTimes({
        Fajr: '05:00',
        Dhuhr: '12:30',
        Asr: '15:45',
        Maghrib: '18:15',
        Isha: '19:30',
      });
      setLocation(settings.language === 'ar' ? 'الموقع غير متاح' : 'Location unavailable');
    } finally {
      setLoading(false);
    }
  };

  const prayerNames = {
    Fajr: settings.language === 'ar' ? 'الفجر' : 'Fajr',
    Dhuhr: settings.language === 'ar' ? 'الظهر' : 'Dhuhr',
    Asr: settings.language === 'ar' ? 'العصر' : 'Asr',
    Maghrib: settings.language === 'ar' ? 'المغرب' : 'Maghrib',
    Isha: settings.language === 'ar' ? 'العشاء' : 'Isha',
  };

  const steps = {
    ar: [
      { title: 'النية', count: null, description: 'انوِ في قلبك الوضوء لله تعالى' },
      { title: 'التسمية', count: null, description: 'قل: بسم الله الرحمن الرحيم' },
      { title: 'اليدين', count: 3, description: 'ابدأ باليد اليمنى ثم اليسرى، اغسل إلى الرسغين' },
      { title: 'الفم والأنف', count: 3, description: 'تمضمض بيدك اليمنى، استنشق بيدك اليمنى واستنثر بيدك اليسرى' },
      { title: 'الوجه', count: 3, description: 'من منابت الشعر إلى الذقن، ومن الأذن إلى الأذن' },
      { title: 'الذراعين', count: 3, description: 'ابدأ باليد اليمنى إلى المرفق، ثم اليسرى إلى المرفق' },
      { title: 'الرأس', count: 1, description: 'امسح من الأمام إلى الخلف ثم من الخلف إلى الأمام' },
      { title: 'الأذنين', count: 1, description: 'امسح داخل الأذنين بالسبابة، وخلفهما بالإبهام' },
      { title: 'القدمين', count: 3, description: 'ابدأ بالقدم اليمنى إلى الكعبين، ثم اليسرى إلى الكعبين' },
    ],
    en: [
      { title: 'Intention', count: null, description: 'Intend in your heart to perform wudu for the sake of Allah' },
      { title: 'Bismillah', count: null, description: 'Say: In the name of Allah, the Most Gracious, the Most Merciful' },
      { title: 'Hands', count: 3, description: 'Start with right hand, then left hand, wash up to wrists' },
      { title: 'Mouth & Nose', count: 3, description: 'Rinse mouth with right hand, sniff water with right hand, blow out with left' },
      { title: 'Face', count: 3, description: 'From hairline to chin, from ear to ear' },
      { title: 'Arms', count: 3, description: 'Start with right arm to elbow, then left arm to elbow' },
      { title: 'Head', count: 1, description: 'Wipe from front to back, then back to front' },
      { title: 'Ears', count: 1, description: 'Wipe inside ears with index fingers, behind with thumbs' },
      { title: 'Feet', count: 3, description: 'Start with right foot to ankles, then left foot to ankles' },
    ],
  };

  const currentSteps = steps[settings.language];

  return (
    <div className="space-y-8">
      {/* Prayer Times Section */}
      <div className="glass-effect rounded-3xl p-6 border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">
            {settings.language === 'ar' ? 'أوقات الصلاة' : 'Prayer Times'}
          </h2>
        </div>

        {location && (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : prayerTimes ? (
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(prayerTimes).map(([prayer, time]) => (
              <Card key={prayer} className="p-4 text-center glass-effect border-border/50 hover:border-primary/50 smooth-transition">
                <div className="text-sm font-semibold text-muted-foreground mb-1">
                  {prayerNames[prayer as keyof PrayerTimes]}
                </div>
                <div className="text-lg font-bold text-primary">
                  {time}
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </div>

      {/* Wudu Steps Section */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">
          {settings.language === 'ar' ? 'خطوات الوضوء' : 'Wudu Steps'}
        </h1>
        <p className="text-muted-foreground">
          {settings.language === 'ar' 
            ? 'دليل كامل لأداء الوضوء الصحيح'
            : 'Complete guide to performing proper ablution'}
        </p>
      </div>

      <div className="space-y-3">
        {currentSteps.map((step, index) => (
          <div
            key={index}
            className="glass-effect rounded-2xl p-5 smooth-transition hover:scale-[1.01] apple-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">
                    {step.title}
                  </h3>
                  {step.count && (
                    <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                      <span className="text-lg font-bold text-primary">X{step.count}</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-effect rounded-2xl p-6 bg-primary/5 border-primary/20">
        <p className="text-center text-sm text-muted-foreground">
          {settings.language === 'ar'
            ? 'بعد إتمام الوضوء قل: أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمداً عبده ورسوله'
            : 'After completing wudu, say: I bear witness that there is no deity except Allah alone, without partner, and I bear witness that Muhammad is His servant and Messenger'}
        </p>
      </div>
    </div>
  );
};

export default Wudu;
