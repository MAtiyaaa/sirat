import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { isRamadan } from './RamadanBanner';
import { BookOpen, CheckCircle, AlertTriangle, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toArabicNumerals } from '@/lib/surah-pages';

// 30-day Quran plan: each day maps to Juz number (1-30)
// Each Juz roughly covers specific surahs
const JUZ_SURAH_MAP: Record<number, { surahs: { number: number; nameAr: string; nameEn: string; ayahs: number }[] }> = {
  1: { surahs: [{ number: 1, nameAr: 'الفاتحة', nameEn: 'Al-Fatiha', ayahs: 7 }, { number: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', ayahs: 141 }] },
  2: { surahs: [{ number: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', ayahs: 145 }] },
  3: { surahs: [{ number: 2, nameAr: 'البقرة', nameEn: 'Al-Baqarah', ayahs: 0 }, { number: 3, nameAr: 'آل عمران', nameEn: 'Ali Imran', ayahs: 91 }] },
  4: { surahs: [{ number: 3, nameAr: 'آل عمران', nameEn: 'Ali Imran', ayahs: 109 }, { number: 4, nameAr: 'النساء', nameEn: 'An-Nisa', ayahs: 23 }] },
  5: { surahs: [{ number: 4, nameAr: 'النساء', nameEn: 'An-Nisa', ayahs: 153 }] },
  6: { surahs: [{ number: 4, nameAr: 'النساء', nameEn: 'An-Nisa', ayahs: 0 }, { number: 5, nameAr: 'المائدة', nameEn: 'Al-Ma\'idah', ayahs: 82 }] },
  7: { surahs: [{ number: 5, nameAr: 'المائدة', nameEn: 'Al-Ma\'idah', ayahs: 38 }, { number: 6, nameAr: 'الأنعام', nameEn: 'Al-An\'am', ayahs: 110 }] },
  8: { surahs: [{ number: 6, nameAr: 'الأنعام', nameEn: 'Al-An\'am', ayahs: 55 }, { number: 7, nameAr: 'الأعراف', nameEn: 'Al-A\'raf', ayahs: 87 }] },
  9: { surahs: [{ number: 7, nameAr: 'الأعراف', nameEn: 'Al-A\'raf', ayahs: 119 }, { number: 8, nameAr: 'الأنفال', nameEn: 'Al-Anfal', ayahs: 40 }] },
  10: { surahs: [{ number: 8, nameAr: 'الأنفال', nameEn: 'Al-Anfal', ayahs: 35 }, { number: 9, nameAr: 'التوبة', nameEn: 'At-Tawbah', ayahs: 93 }] },
  11: { surahs: [{ number: 9, nameAr: 'التوبة', nameEn: 'At-Tawbah', ayahs: 36 }, { number: 10, nameAr: 'يونس', nameEn: 'Yunus', ayahs: 109 }, { number: 11, nameAr: 'هود', nameEn: 'Hud', ayahs: 5 }] },
  12: { surahs: [{ number: 11, nameAr: 'هود', nameEn: 'Hud', ayahs: 118 }, { number: 12, nameAr: 'يوسف', nameEn: 'Yusuf', ayahs: 52 }] },
  13: { surahs: [{ number: 12, nameAr: 'يوسف', nameEn: 'Yusuf', ayahs: 59 }, { number: 13, nameAr: 'الرعد', nameEn: 'Ar-Ra\'d', ayahs: 43 }, { number: 14, nameAr: 'إبراهيم', nameEn: 'Ibrahim', ayahs: 52 }] },
  14: { surahs: [{ number: 15, nameAr: 'الحجر', nameEn: 'Al-Hijr', ayahs: 99 }, { number: 16, nameAr: 'النحل', nameEn: 'An-Nahl', ayahs: 128 }] },
  15: { surahs: [{ number: 17, nameAr: 'الإسراء', nameEn: 'Al-Isra', ayahs: 111 }, { number: 18, nameAr: 'الكهف', nameEn: 'Al-Kahf', ayahs: 74 }] },
  16: { surahs: [{ number: 18, nameAr: 'الكهف', nameEn: 'Al-Kahf', ayahs: 36 }, { number: 19, nameAr: 'مريم', nameEn: 'Maryam', ayahs: 98 }, { number: 20, nameAr: 'طه', nameEn: 'Ta-Ha', ayahs: 135 }] },
  17: { surahs: [{ number: 21, nameAr: 'الأنبياء', nameEn: 'Al-Anbiya', ayahs: 112 }, { number: 22, nameAr: 'الحج', nameEn: 'Al-Hajj', ayahs: 78 }] },
  18: { surahs: [{ number: 23, nameAr: 'المؤمنون', nameEn: 'Al-Mu\'minun', ayahs: 118 }, { number: 24, nameAr: 'النور', nameEn: 'An-Nur', ayahs: 64 }, { number: 25, nameAr: 'الفرقان', nameEn: 'Al-Furqan', ayahs: 20 }] },
  19: { surahs: [{ number: 25, nameAr: 'الفرقان', nameEn: 'Al-Furqan', ayahs: 57 }, { number: 26, nameAr: 'الشعراء', nameEn: 'Ash-Shu\'ara', ayahs: 227 }, { number: 27, nameAr: 'النمل', nameEn: 'An-Naml', ayahs: 55 }] },
  20: { surahs: [{ number: 27, nameAr: 'النمل', nameEn: 'An-Naml', ayahs: 38 }, { number: 28, nameAr: 'القصص', nameEn: 'Al-Qasas', ayahs: 88 }, { number: 29, nameAr: 'العنكبوت', nameEn: 'Al-Ankabut', ayahs: 45 }] },
  21: { surahs: [{ number: 29, nameAr: 'العنكبوت', nameEn: 'Al-Ankabut', ayahs: 24 }, { number: 30, nameAr: 'الروم', nameEn: 'Ar-Rum', ayahs: 60 }, { number: 31, nameAr: 'لقمان', nameEn: 'Luqman', ayahs: 34 }, { number: 32, nameAr: 'السجدة', nameEn: 'As-Sajdah', ayahs: 30 }, { number: 33, nameAr: 'الأحزاب', nameEn: 'Al-Ahzab', ayahs: 30 }] },
  22: { surahs: [{ number: 33, nameAr: 'الأحزاب', nameEn: 'Al-Ahzab', ayahs: 43 }, { number: 34, nameAr: 'سبأ', nameEn: 'Saba', ayahs: 54 }, { number: 35, nameAr: 'فاطر', nameEn: 'Fatir', ayahs: 45 }, { number: 36, nameAr: 'يس', nameEn: 'Ya-Sin', ayahs: 27 }] },
  23: { surahs: [{ number: 36, nameAr: 'يس', nameEn: 'Ya-Sin', ayahs: 56 }, { number: 37, nameAr: 'الصافات', nameEn: 'As-Saffat', ayahs: 182 }, { number: 38, nameAr: 'ص', nameEn: 'Sad', ayahs: 88 }, { number: 39, nameAr: 'الزمر', nameEn: 'Az-Zumar', ayahs: 31 }] },
  24: { surahs: [{ number: 39, nameAr: 'الزمر', nameEn: 'Az-Zumar', ayahs: 44 }, { number: 40, nameAr: 'غافر', nameEn: 'Ghafir', ayahs: 85 }, { number: 41, nameAr: 'فصلت', nameEn: 'Fussilat', ayahs: 46 }] },
  25: { surahs: [{ number: 41, nameAr: 'فصلت', nameEn: 'Fussilat', ayahs: 8 }, { number: 42, nameAr: 'الشورى', nameEn: 'Ash-Shura', ayahs: 53 }, { number: 43, nameAr: 'الزخرف', nameEn: 'Az-Zukhruf', ayahs: 89 }, { number: 44, nameAr: 'الدخان', nameEn: 'Ad-Dukhan', ayahs: 59 }, { number: 45, nameAr: 'الجاثية', nameEn: 'Al-Jathiyah', ayahs: 37 }] },
  26: { surahs: [{ number: 46, nameAr: 'الأحقاف', nameEn: 'Al-Ahqaf', ayahs: 35 }, { number: 47, nameAr: 'محمد', nameEn: 'Muhammad', ayahs: 38 }, { number: 48, nameAr: 'الفتح', nameEn: 'Al-Fath', ayahs: 29 }, { number: 49, nameAr: 'الحجرات', nameEn: 'Al-Hujurat', ayahs: 18 }, { number: 50, nameAr: 'ق', nameEn: 'Qaf', ayahs: 45 }, { number: 51, nameAr: 'الذاريات', nameEn: 'Adh-Dhariyat', ayahs: 30 }] },
  27: { surahs: [{ number: 51, nameAr: 'الذاريات', nameEn: 'Adh-Dhariyat', ayahs: 30 }, { number: 52, nameAr: 'الطور', nameEn: 'At-Tur', ayahs: 49 }, { number: 53, nameAr: 'النجم', nameEn: 'An-Najm', ayahs: 62 }, { number: 54, nameAr: 'القمر', nameEn: 'Al-Qamar', ayahs: 55 }, { number: 55, nameAr: 'الرحمن', nameEn: 'Ar-Rahman', ayahs: 78 }, { number: 56, nameAr: 'الواقعة', nameEn: 'Al-Waqi\'ah', ayahs: 96 }, { number: 57, nameAr: 'الحديد', nameEn: 'Al-Hadid', ayahs: 29 }] },
  28: { surahs: [{ number: 58, nameAr: 'المجادلة', nameEn: 'Al-Mujadilah', ayahs: 22 }, { number: 59, nameAr: 'الحشر', nameEn: 'Al-Hashr', ayahs: 24 }, { number: 60, nameAr: 'الممتحنة', nameEn: 'Al-Mumtahanah', ayahs: 13 }, { number: 61, nameAr: 'الصف', nameEn: 'As-Saff', ayahs: 14 }, { number: 62, nameAr: 'الجمعة', nameEn: 'Al-Jumu\'ah', ayahs: 11 }, { number: 63, nameAr: 'المنافقون', nameEn: 'Al-Munafiqun', ayahs: 11 }, { number: 64, nameAr: 'التغابن', nameEn: 'At-Taghabun', ayahs: 18 }, { number: 65, nameAr: 'الطلاق', nameEn: 'At-Talaq', ayahs: 12 }, { number: 66, nameAr: 'التحريم', nameEn: 'At-Tahrim', ayahs: 12 }] },
  29: { surahs: [{ number: 67, nameAr: 'الملك', nameEn: 'Al-Mulk', ayahs: 30 }, { number: 68, nameAr: 'القلم', nameEn: 'Al-Qalam', ayahs: 52 }, { number: 69, nameAr: 'الحاقة', nameEn: 'Al-Haqqah', ayahs: 52 }, { number: 70, nameAr: 'المعارج', nameEn: 'Al-Ma\'arij', ayahs: 44 }, { number: 71, nameAr: 'نوح', nameEn: 'Nuh', ayahs: 28 }, { number: 72, nameAr: 'الجن', nameEn: 'Al-Jinn', ayahs: 28 }, { number: 73, nameAr: 'المزمل', nameEn: 'Al-Muzzammil', ayahs: 20 }, { number: 74, nameAr: 'المدثر', nameEn: 'Al-Muddathir', ayahs: 56 }, { number: 75, nameAr: 'القيامة', nameEn: 'Al-Qiyamah', ayahs: 40 }, { number: 76, nameAr: 'الإنسان', nameEn: 'Al-Insan', ayahs: 31 }, { number: 77, nameAr: 'المرسلات', nameEn: 'Al-Mursalat', ayahs: 50 }] },
  30: { surahs: [{ number: 78, nameAr: 'النبأ', nameEn: 'An-Naba', ayahs: 40 }, { number: 79, nameAr: 'النازعات', nameEn: 'An-Nazi\'at', ayahs: 46 }, { number: 80, nameAr: 'عبس', nameEn: 'Abasa', ayahs: 42 }, { number: 81, nameAr: 'التكوير', nameEn: 'At-Takwir', ayahs: 29 }, { number: 82, nameAr: 'الانفطار', nameEn: 'Al-Infitar', ayahs: 19 }, { number: 83, nameAr: 'المطففين', nameEn: 'Al-Mutaffifin', ayahs: 36 }, { number: 84, nameAr: 'الانشقاق', nameEn: 'Al-Inshiqaq', ayahs: 25 }, { number: 85, nameAr: 'البروج', nameEn: 'Al-Buruj', ayahs: 22 }, { number: 86, nameAr: 'الطارق', nameEn: 'At-Tariq', ayahs: 17 }, { number: 87, nameAr: 'الأعلى', nameEn: 'Al-A\'la', ayahs: 19 }, { number: 88, nameAr: 'الغاشية', nameEn: 'Al-Ghashiyah', ayahs: 26 }, { number: 89, nameAr: 'الفجر', nameEn: 'Al-Fajr', ayahs: 30 }, { number: 90, nameAr: 'البلد', nameEn: 'Al-Balad', ayahs: 20 }, { number: 91, nameAr: 'الشمس', nameEn: 'Ash-Shams', ayahs: 15 }, { number: 92, nameAr: 'الليل', nameEn: 'Al-Layl', ayahs: 21 }, { number: 93, nameAr: 'الضحى', nameEn: 'Ad-Duha', ayahs: 11 }, { number: 94, nameAr: 'الشرح', nameEn: 'Ash-Sharh', ayahs: 8 }, { number: 95, nameAr: 'التين', nameEn: 'At-Tin', ayahs: 8 }, { number: 96, nameAr: 'العلق', nameEn: 'Al-Alaq', ayahs: 19 }, { number: 97, nameAr: 'القدر', nameEn: 'Al-Qadr', ayahs: 5 }, { number: 98, nameAr: 'البينة', nameEn: 'Al-Bayyinah', ayahs: 8 }, { number: 99, nameAr: 'الزلزلة', nameEn: 'Az-Zalzalah', ayahs: 8 }, { number: 100, nameAr: 'العاديات', nameEn: 'Al-Adiyat', ayahs: 11 }, { number: 101, nameAr: 'القارعة', nameEn: 'Al-Qari\'ah', ayahs: 11 }, { number: 102, nameAr: 'التكاثر', nameEn: 'At-Takathur', ayahs: 8 }, { number: 103, nameAr: 'العصر', nameEn: 'Al-Asr', ayahs: 3 }, { number: 104, nameAr: 'الهمزة', nameEn: 'Al-Humazah', ayahs: 9 }, { number: 105, nameAr: 'الفيل', nameEn: 'Al-Fil', ayahs: 5 }, { number: 106, nameAr: 'قريش', nameEn: 'Quraysh', ayahs: 4 }, { number: 107, nameAr: 'الماعون', nameEn: 'Al-Ma\'un', ayahs: 7 }, { number: 108, nameAr: 'الكوثر', nameEn: 'Al-Kawthar', ayahs: 3 }, { number: 109, nameAr: 'الكافرون', nameEn: 'Al-Kafirun', ayahs: 6 }, { number: 110, nameAr: 'النصر', nameEn: 'An-Nasr', ayahs: 3 }, { number: 111, nameAr: 'المسد', nameEn: 'Al-Masad', ayahs: 5 }, { number: 112, nameAr: 'الإخلاص', nameEn: 'Al-Ikhlas', ayahs: 4 }, { number: 113, nameAr: 'الفلق', nameEn: 'Al-Falaq', ayahs: 5 }, { number: 114, nameAr: 'الناس', nameEn: 'An-Nas', ayahs: 6 }] },
};

const RAMADAN_DAY_1 = new Date(2026, 1, 28); // Feb 28, 2026

const RamadanQuranPlan = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const isArabic = settings.language === 'ar';
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('reading_progress')
      .select('surah_number, ayah_number')
      .eq('user_id', user.id);
    if (data) {
      const map: Record<number, number> = {};
      data.forEach(p => { map[p.surah_number] = p.ayah_number; });
      setProgress(map);
    }
  };

  const today = useMemo(() => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - RAMADAN_DAY_1.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(diff + 1, 30));
  }, []);

  // Calculate completion per Juz day
  const dayStatus = useMemo(() => {
    const statuses: { day: number; completed: boolean; partial: boolean }[] = [];
    
    // Simple check: for each juz, check if user has read the surahs in that juz
    for (let day = 1; day <= 30; day++) {
      const juzData = JUZ_SURAH_MAP[day];
      if (!juzData) { statuses.push({ day, completed: false, partial: false }); continue; }
      
      let hasAny = false;
      let allDone = true;
      
      juzData.surahs.forEach(s => {
        const p = progress[s.number] || 0;
        if (p > 0) hasAny = true;
        if (p < s.ayahs) allDone = false;
      });
      
      statuses.push({ day, completed: allDone && juzData.surahs.length > 0, partial: hasAny && !allDone });
    }
    return statuses;
  }, [progress]);

  const completedDays = dayStatus.filter(d => d.completed).length;
  const overallPercent = (completedDays / 30) * 100;

  // Status: ahead, on track, behind
  const statusInfo = useMemo(() => {
    if (today === 0) return { status: 'on-track' as const, label: isArabic ? 'مستعد' : 'Ready' };
    if (completedDays >= today) return { status: 'ahead' as const, label: isArabic ? 'متقدم' : 'Ahead' };
    if (completedDays >= today - 1) return { status: 'on-track' as const, label: isArabic ? 'في الوقت' : 'On Track' };
    return { status: 'behind' as const, label: isArabic ? 'متأخر' : 'Behind' };
  }, [today, completedDays, isArabic]);

  if (!isRamadan()) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="glass-effect rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/5 to-primary/5">
        <CollapsibleTrigger asChild>
          <button className="w-full p-5 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {isArabic ? 'ختم القرآن في رمضان' : 'Finish Quran in Ramadan'}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    {isArabic ? 'جزء واحد كل يوم' : '1 Juz per day'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  statusInfo.status === 'ahead' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                  statusInfo.status === 'on-track' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                  'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                }`}>
                  {statusInfo.status === 'ahead' && <TrendingUp className="h-3 w-3 inline mr-1" />}
                  {statusInfo.status === 'behind' && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                  {statusInfo.label}
                </div>
                <span className="font-semibold text-sm text-primary">{overallPercent.toFixed(0)}%</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground smooth-transition ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            
            {/* Progress bar always visible */}
            <div className="mt-3">
              <Progress value={overallPercent} className="h-1.5" />
              {today > 0 && (
                <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                  {isArabic ? `اليوم ${toArabicNumerals(today)} من رمضان` : `Day ${today} of Ramadan`}
                </p>
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-5 pb-5 space-y-4">
            {/* Days Grid */}
            <div className="grid grid-cols-6 gap-1.5">
              {dayStatus.map(({ day, completed, partial }) => {
                const isToday = day === today;
                return (
                  <button
                    key={day}
                    onClick={() => setExpandedDay(expandedDay === day ? null : day)}
                    className={`relative rounded-xl p-2 text-center text-xs font-semibold smooth-transition border ${
                      completed
                        ? 'bg-green-500/10 border-green-500/20 text-green-600'
                        : isToday
                        ? 'bg-primary/10 border-primary/30 text-primary ring-1 ring-primary/30'
                        : partial
                        ? 'bg-amber-500/10 border-amber-500/15 text-amber-600'
                        : 'glass-effect border-border/20 text-muted-foreground'
                    }`}
                  >
                    {completed && <CheckCircle className="h-2.5 w-2.5 absolute top-0.5 right-0.5 text-green-500" />}
                    {isArabic ? toArabicNumerals(day) : day}
                  </button>
                );
              })}
            </div>

            {/* Expanded Day Detail */}
            {expandedDay && JUZ_SURAH_MAP[expandedDay] && (
              <div className="glass-effect rounded-2xl p-4 border border-border/30 animate-fade-in">
                <h4 className="text-sm font-bold mb-3">
                  {isArabic ? `الجزء ${toArabicNumerals(expandedDay)}` : `Juz ${expandedDay}`}
                  {expandedDay === today && (
                    <span className="text-[10px] text-primary font-normal ml-2">
                      {isArabic ? '(اليوم)' : '(Today)'}
                    </span>
                  )}
                </h4>
                <div className="space-y-2">
                  {JUZ_SURAH_MAP[expandedDay].surahs.map(s => {
                    const p = progress[s.number] || 0;
                    const pct = s.ayahs > 0 ? Math.min((p / s.ayahs) * 100, 100) : 0;
                    return (
                      <Link
                        key={`${expandedDay}-${s.number}`}
                        to={`/quran/${s.number}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/5 smooth-transition"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {isArabic ? toArabicNumerals(s.number) : s.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {isArabic ? s.nameAr : s.nameEn}
                          </p>
                          {s.ayahs > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={pct} className="h-1 flex-1" />
                              <span className="text-[10px] text-muted-foreground w-8 text-right">{pct.toFixed(0)}%</span>
                            </div>
                          )}
                        </div>
                        {pct >= 100 && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default RamadanQuranPlan;
