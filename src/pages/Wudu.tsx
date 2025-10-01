import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Check } from 'lucide-react';

const Wudu = () => {
  const { settings } = useSettings();

  const steps = {
    ar: [
      { title: 'النية', description: 'انوِ في قلبك الوضوء لله تعالى' },
      { title: 'التسمية', description: 'قل: بسم الله الرحمن الرحيم' },
      { title: 'غسل اليدين', description: 'اغسل يديك ثلاث مرات إلى الرسغين' },
      { title: 'المضمضة والاستنشاق', description: 'تمضمض واستنشق ثلاث مرات' },
      { title: 'غسل الوجه', description: 'اغسل وجهك ثلاث مرات من منابت الشعر إلى الذقن' },
      { title: 'غسل اليدين إلى المرفقين', description: 'اغسل يدك اليمنى ثم اليسرى إلى المرفقين ثلاث مرات' },
      { title: 'مسح الرأس', description: 'امسح رأسك مرة واحدة' },
      { title: 'مسح الأذنين', description: 'امسح داخل وخلف الأذنين' },
      { title: 'غسل القدمين', description: 'اغسل قدمك اليمنى ثم اليسرى إلى الكعبين ثلاث مرات' },
    ],
    en: [
      { title: 'Intention (Niyyah)', description: 'Intend in your heart to perform wudu for Allah' },
      { title: 'Say Bismillah', description: 'Say: In the name of Allah, the Most Gracious, the Most Merciful' },
      { title: 'Wash Hands', description: 'Wash your hands three times up to the wrists' },
      { title: 'Rinse Mouth & Nose', description: 'Rinse your mouth and nose three times' },
      { title: 'Wash Face', description: 'Wash your face three times from hairline to chin' },
      { title: 'Wash Arms', description: 'Wash right arm then left arm up to elbows three times' },
      { title: 'Wipe Head', description: 'Wipe over your head once' },
      { title: 'Wipe Ears', description: 'Wipe inside and behind your ears' },
      { title: 'Wash Feet', description: 'Wash right foot then left foot up to ankles three times' },
    ],
  };

  const currentSteps = steps[settings.language];

  return (
    <div className="space-y-8">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">
          {settings.language === 'ar' ? 'خطوات الوضوء' : 'Wudu Steps'}
        </h1>
        <p className="text-muted-foreground">
          {settings.language === 'ar' 
            ? 'دليل كامل لأداء الوضوء الصحيح'
            : 'Complete guide to performing proper wudu'}
        </p>
      </div>

      <div className="space-y-4">
        {currentSteps.map((step, index) => (
          <div
            key={index}
            className="glass-effect rounded-2xl p-6 smooth-transition hover:scale-[1.01] apple-shadow"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-muted-foreground">
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
