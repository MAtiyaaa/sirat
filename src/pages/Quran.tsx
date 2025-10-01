import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Link } from 'react-router-dom';
import { Book, Loader2 } from 'lucide-react';
import { fetchSurahs, Surah } from '@/lib/quran-api';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const Quran = () => {
  const { settings } = useSettings();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    loadSurahs();
    loadProgress();
  }, []);

  const loadSurahs = async () => {
    setLoading(true);
    try {
      const data = await fetchSurahs();
      setSurahs(data);
    } catch (error) {
      console.error('Error loading surahs:', error);
      toast.error('Failed to load surahs');
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', session.user.id);

    if (data && !error) {
      const progressMap: Record<number, number> = {};
      let totalAyahs = 6236;
      let completedAyahs = 0;

      data.forEach(p => {
        progressMap[p.surah_number] = p.ayah_number;
        completedAyahs += p.ayah_number;
      });

      setProgress(progressMap);
      setOverallProgress((completedAyahs / totalAyahs) * 100);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {settings.language === 'ar' ? 'القرآن الكريم' : 'The Holy Quran'}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          {settings.language === 'ar' 
            ? 'اختر سورة للقراءة'
            : 'Select a surah to read'}
        </p>
      </div>

      {overallProgress > 0 && (
        <div className="glass-effect rounded-3xl p-8 space-y-4 border border-border/50 apple-shadow">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">
              {settings.language === 'ar' ? 'التقدم الإجمالي' : 'Overall Progress'}
            </span>
            <span className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              {overallProgress.toFixed(1)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-4" />
        </div>
      )}

      <div className="space-y-3">
        {surahs.map((surah) => {
          const surahProgress = progress[surah.number] || 0;
          const surahProgressPercent = (surahProgress / surah.numberOfAyahs) * 100;

          return (
            <Link
              key={surah.number}
              to={`/quran/${surah.number}`}
              className="block"
            >
              <div className="glass-effect rounded-3xl p-6 md:p-8 smooth-transition hover:scale-[1.02] apple-shadow hover:shadow-xl border border-border/50 hover:border-border backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">{surah.number}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-xl font-semibold ${settings.fontType === 'quran' ? 'quran-font' : ''}`}>
                        {settings.language === 'ar' ? surah.name : surah.englishName}
                      </h3>
                      <Book className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {settings.language === 'ar' ? surah.englishName : surah.englishNameTranslation}
                    </p>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>
                        {settings.language === 'ar' 
                          ? `${surah.numberOfAyahs} آية`
                          : `${surah.numberOfAyahs} verses`}
                      </span>
                      <span>•</span>
                      <span>
                        {settings.language === 'ar' 
                          ? (surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية')
                          : surah.revelationType}
                      </span>
                    </div>
                  </div>
                </div>

                {surahProgressPercent > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {settings.language === 'ar' 
                          ? `الآية ${surahProgress} من ${surah.numberOfAyahs}`
                          : `Ayah ${surahProgress} of ${surah.numberOfAyahs}`}
                      </span>
                      <span className="font-medium">{surahProgressPercent.toFixed(0)}%</span>
                    </div>
                    <Progress value={surahProgressPercent} className="h-2" />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Quran;
