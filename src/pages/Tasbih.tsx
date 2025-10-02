import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Tasbih = () => {
  const { settings } = useSettings();
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState('subhanallah');

  const dhikrOptions = {
    ar: [
      { value: 'subhanallah', label: 'سبحان الله', text: 'سُبْحَانَ اللَّهِ' },
      { value: 'alhamdulillah', label: 'الحمد لله', text: 'الْحَمْدُ لِلَّهِ' },
      { value: 'allahuakbar', label: 'الله أكبر', text: 'اللَّهُ أَكْبَرُ' },
      { value: 'lailahaillallah', label: 'لا إله إلا الله', text: 'لَا إِلَٰهَ إِلَّا اللَّهُ' },
      { value: 'astaghfirullah', label: 'أستغفر الله', text: 'أَسْتَغْفِرُ اللَّهَ' },
      { value: 'lahaula', label: 'لا حول ولا قوة إلا بالله', text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ' },
    ],
    en: [
      { value: 'subhanallah', label: 'SubhanAllah', text: 'سُبْحَانَ اللَّهِ' },
      { value: 'alhamdulillah', label: 'Alhamdulillah', text: 'الْحَمْدُ لِلَّهِ' },
      { value: 'allahuakbar', label: 'Allahu Akbar', text: 'اللَّهُ أَكْبَرُ' },
      { value: 'lailahaillallah', label: 'La ilaha illallah', text: 'لَا إِلَٰهَ إِلَّا اللَّهُ' },
      { value: 'astaghfirullah', label: 'Astaghfirullah', text: 'أَسْتَغْفِرُ اللَّهَ' },
      { value: 'lahaula', label: 'La hawla wala quwwata', text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ' },
    ],
  };

  const content = {
    ar: {
      title: 'التسبيح',
      subtitle: 'عداد الذكر الإلكتروني',
      selectDhikr: 'اختر الذكر',
      reset: 'إعادة تعيين',
      counter: 'العدد',
    },
    en: {
      title: 'Tasbih',
      subtitle: 'Digital Dhikr Counter',
      selectDhikr: 'Select Dhikr',
      reset: 'Reset',
      counter: 'Count',
    },
  };

  const t = content[settings.language];
  const dhikrList = dhikrOptions[settings.language];
  const currentDhikr = dhikrList.find(d => d.value === selectedDhikr);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));
  const reset = () => setCount(0);

  return (
    <div className="min-h-screen space-y-6 pb-6">
      {/* Header */}
      <div className="text-center space-y-4 py-6 px-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {t.title}
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Dhikr Selector */}
      <div className="px-4">
        <div className="glass-effect rounded-3xl p-6 md:p-8 border border-border/50 backdrop-blur-xl space-y-4">
          <label className="text-sm font-medium text-muted-foreground">
            {t.selectDhikr}
          </label>
          <Select value={selectedDhikr} onValueChange={setSelectedDhikr}>
            <SelectTrigger className="h-12 text-base glass-effect">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dhikrList.map((dhikr) => (
                <SelectItem key={dhikr.value} value={dhikr.value}>
                  {dhikr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current Dhikr Display */}
      <div className="px-4">
        <div className="glass-effect rounded-3xl p-8 md:p-12 border border-primary/30 backdrop-blur-xl apple-shadow">
          <div className="text-center space-y-6">
            {/* Arabic Text */}
            <p className="text-4xl md:text-6xl font-bold quran-font text-primary">
              {currentDhikr?.text}
            </p>
            
            {/* Transliteration */}
            <p className="text-lg md:text-xl text-muted-foreground">
              {currentDhikr?.label}
            </p>
          </div>
        </div>
      </div>

      {/* Counter Display */}
      <div className="px-4">
        <div className="glass-effect rounded-3xl p-8 border border-border/50 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t.counter}
            </p>
            <div className="text-8xl md:text-9xl font-bold bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {count}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="px-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Decrement Button */}
          <Button
            onClick={decrement}
            size="lg"
            variant="outline"
            className="h-20 text-2xl font-semibold glass-effect hover:scale-[1.02] smooth-transition"
          >
            <Minus className="h-8 w-8" />
          </Button>

          {/* Increment Button */}
          <Button
            onClick={increment}
            size="lg"
            className="h-20 text-2xl font-semibold hover:scale-[1.02] smooth-transition"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </div>

        {/* Reset Button */}
        <Button
          onClick={reset}
          size="lg"
          variant="outline"
          className="w-full h-14 text-lg glass-effect hover:scale-[1.02] smooth-transition"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          {t.reset}
        </Button>
      </div>

      {/* Info Card */}
      <div className="px-4">
        <div className="glass-effect rounded-2xl p-6 border border-border/50 backdrop-blur-xl">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {settings.language === 'ar' 
              ? 'استخدم الأزرار للعد. يمكنك تغيير الذكر من القائمة أعلاه.'
              : 'Use the buttons to count. You can change the dhikr from the dropdown above.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tasbih;
