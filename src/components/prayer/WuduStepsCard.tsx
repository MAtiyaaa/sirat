import React, { useState } from 'react';
import { HandHeart, ChevronDown, Sparkles, Check, Heart, BookOpen, Droplets, Smile, Dumbbell, Brain, Ear, Footprints } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { LucideIcon } from 'lucide-react';

const WuduStepsCard = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: {
    ar: { title: string; count: number | null; description: string; icon: LucideIcon }[];
    en: { title: string; count: number | null; description: string; icon: LucideIcon }[];
  } = {
    ar: [
      { title: 'النية', count: null, description: 'انوِ في قلبك الوضوء لله تعالى', icon: Heart },
      { title: 'التسمية', count: null, description: 'قل: بسم الله الرحمن الرحيم', icon: BookOpen },
      { title: 'اليدين', count: 3, description: 'ابدأ باليد اليمنى ثم اليسرى، اغسل إلى الرسغين', icon: HandHeart },
      { title: 'الفم والأنف', count: 3, description: 'تمضمض بيدك اليمنى، استنشق بيدك اليمنى واستنثر بيدك اليسرى', icon: Droplets },
      { title: 'الوجه', count: 3, description: 'من منابت الشعر إلى الذقن، ومن الأذن إلى الأذن', icon: Smile },
      { title: 'الذراعين', count: 3, description: 'ابدأ باليد اليمنى إلى المرفق، ثم اليسرى إلى المرفق', icon: Dumbbell },
      { title: 'الرأس', count: 1, description: 'امسح من الأمام إلى الخلف ثم من الخلف إلى الأمام', icon: Brain },
      { title: 'الأذنين', count: 1, description: 'امسح داخل الأذنين بالسبابة، وخلفهما بالإبهام', icon: Ear },
      { title: 'القدمين', count: 3, description: 'ابدأ بالقدم اليمنى إلى الكعبين، ثم اليسرى إلى الكعبين', icon: Footprints },
    ],
    en: [
      { title: 'Intention', count: null, description: 'Intend in your heart to perform wudu for the sake of Allah', icon: Heart },
      { title: 'Bismillah', count: null, description: 'Say: In the name of Allah, the Most Gracious, the Most Merciful', icon: BookOpen },
      { title: 'Hands', count: 3, description: 'Start with right hand, then left hand, wash up to wrists', icon: HandHeart },
      { title: 'Mouth & Nose', count: 3, description: 'Rinse mouth with right hand, sniff water with right hand, blow out with left', icon: Droplets },
      { title: 'Face', count: 3, description: 'From hairline to chin, from ear to ear', icon: Smile },
      { title: 'Arms', count: 3, description: 'Start with right arm to elbow, then left arm to elbow', icon: Dumbbell },
      { title: 'Head', count: 1, description: 'Wipe from front to back, then back to front', icon: Brain },
      { title: 'Ears', count: 1, description: 'Wipe inside ears with index fingers, behind with thumbs', icon: Ear },
      { title: 'Feet', count: 3, description: 'Start with right foot to ankles, then left foot to ankles', icon: Footprints },
    ],
  };

  const currentSteps = steps[settings.language];
  const progress = (completedSteps.length / currentSteps.length) * 100;

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const resetProgress = () => setCompletedSteps([]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative overflow-hidden rounded-3xl">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10" />
        
        <div className="relative glass-effect border border-border/50 p-6">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <HandHeart className="h-6 w-6 text-cyan-500" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold">
                      {settings.language === 'ar' ? 'خطوات الوضوء' : 'Wudu Steps'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {settings.language === 'ar' ? '9 خطوات للطهارة' : '9 steps to purity'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Progress indicator */}
                  {completedSteps.length > 0 && (
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full smooth-transition"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {completedSteps.length}/{currentSteps.length}
                      </span>
                    </div>
                  )}
                  <ChevronDown className={`h-5 w-5 text-muted-foreground smooth-transition ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            {/* Reset button */}
            {completedSteps.length > 0 && (
              <button
                onClick={resetProgress}
                className="mb-4 text-sm text-primary hover:underline"
              >
                {settings.language === 'ar' ? 'إعادة التعيين' : 'Reset Progress'}
              </button>
            )}

            {/* Steps */}
            <div className="space-y-3">
              {currentSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const StepIcon = step.icon;
                
                return (
                  <button
                    key={index}
                    onClick={() => toggleStep(index)}
                    className={`w-full text-left relative overflow-hidden rounded-2xl smooth-transition hover:scale-[1.01] ${
                      isCompleted ? 'opacity-60' : ''
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${
                      isCompleted 
                        ? 'from-green-500/20 to-emerald-500/20' 
                        : 'from-background/50 to-background/30'
                    }`} />
                    
                    <div className="relative glass-effect border border-border/50 p-4 md:p-5">
                      <div className="flex items-start gap-4">
                        {/* Step number / check */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center smooth-transition ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-primary/10'
                        }`}>
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-bold text-primary">{index + 1}</span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                              <StepIcon className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className={`text-lg font-bold ${isCompleted ? 'line-through' : ''}`}>
                              {step.title}
                            </h3>
                            {step.count && (
                              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-sm font-bold">
                                ×{step.count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dua after wudu */}
            <div className="relative overflow-hidden rounded-2xl mt-4">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
              <div className="relative glass-effect border border-primary/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">
                      {settings.language === 'ar' ? 'دعاء بعد الوضوء' : 'Dua After Wudu'}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {settings.language === 'ar'
                        ? 'أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمداً عبده ورسوله'
                        : 'I bear witness that there is no deity except Allah alone, without partner, and I bear witness that Muhammad is His servant and Messenger'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};

export default WuduStepsCard;
