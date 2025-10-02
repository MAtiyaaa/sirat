import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { fetchPageVerses } from '@/lib/quran-api';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { IslamicFactsLoader } from '@/components/IslamicFactsLoader';
import { useAudio } from '@/contexts/AudioContext';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const QuranPages = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { playingSurah, isPlaying, playSurah, pauseSurah, resumeSurah } = useAudio();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastViewedPage, setLastViewedPage] = useState<number | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  const TOTAL_PAGES = 604;

  useEffect(() => {
    loadLastViewedPage();
    loadOverallProgress();
  }, []);

  useEffect(() => {
    if (lastViewedPage && !loading) {
      setCurrentPage(lastViewedPage);
    }
  }, [lastViewedPage, loading]);

  useEffect(() => {
    loadPage(currentPage);
    if (user) {
      savePageProgress(currentPage);
    }
  }, [currentPage]);

  const loadPage = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await fetchPageVerses(pageNumber);
      setVerses(data);
    } catch (error) {
      console.error('Error loading page:', error);
      toast.error(settings.language === 'ar' ? 'فشل تحميل الصفحة' : 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const loadLastViewedPage = async () => {
    if (!user) {
      const stored = localStorage.getItem('quran_last_page');
      if (stored) {
        setLastViewedPage(parseInt(stored));
      }
      return;
    }

    const { data } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('progress_type', 'page')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setLastViewedPage(data.surah_number); // Using surah_number field to store page number
    }
  };

  const loadOverallProgress = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('reading_progress')
      .select('surah_number')
      .eq('user_id', user.id)
      .eq('progress_type', 'page');

    if (data) {
      const uniquePages = new Set(data.map(d => d.surah_number));
      const progress = (uniquePages.size / TOTAL_PAGES) * 100;
      setOverallProgress(progress);
    }
  };

  const savePageProgress = async (pageNumber: number) => {
    localStorage.setItem('quran_last_page', pageNumber.toString());

    if (!user) return;

    await supabase
      .from('reading_progress')
      .upsert({
        user_id: user.id,
        surah_number: pageNumber, // Using surah_number to store page
        ayah_number: 1,
        progress_type: 'page',
      }, {
        onConflict: 'user_id,surah_number,progress_type'
      });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < TOTAL_PAGES) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePlaySurah = () => {
    if (verses.length === 0) return;
    
    const firstVerse = verses[0];
    const verseKey = firstVerse.verse_key || '';
    const surahNum = parseInt(verseKey.split(':')[0]);
    
    if (playingSurah === surahNum && isPlaying) {
      pauseSurah();
    } else if (playingSurah === surahNum && !isPlaying) {
      resumeSurah();
    } else {
      // Get the total ayahs for this surah
      const totalAyahs = firstVerse.chapter?.verses_count || 286;
      playSurah(surahNum, totalAyahs);
    }
  };

  const getSurahName = () => {
    if (verses.length === 0) return '';
    const firstVerse = verses[0];
    return firstVerse.chapter?.name_simple || '';
  };

  const content = {
    ar: {
      title: 'القرآن الكريم - عرض الصفحات',
      page: 'صفحة',
      of: 'من',
      continueReading: 'متابعة القراءة',
      overallProgress: 'التقدم العام',
      play: 'تشغيل السورة',
      pause: 'إيقاف مؤقت',
    },
    en: {
      title: 'Holy Quran - Page View',
      page: 'Page',
      of: 'of',
      continueReading: 'Continue Reading',
      overallProgress: 'Overall Progress',
      play: 'Play Surah',
      pause: 'Pause',
    },
  };

  const t = content[settings.language];

  if (loading && verses.length === 0) {
    return <IslamicFactsLoader />;
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/quran')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>
        </div>
      </div>

      {/* Progress Bar */}
      {user && overallProgress > 0 && (
        <div className="glass-effect rounded-3xl p-6 border border-border/50 backdrop-blur-xl max-w-4xl mx-auto">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t.overallProgress}</span>
              <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>
      )}

      {/* Page Navigation */}
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          {settings.language === 'ar' ? 'السابق' : 'Previous'}
        </Button>

        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">
            {t.page} {currentPage} {t.of} {TOTAL_PAGES}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlaySurah}
            className="rounded-full"
          >
            {playingSurah && isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNextPage}
          disabled={currentPage === TOTAL_PAGES}
          className="rounded-full"
        >
          {settings.language === 'ar' ? 'التالي' : 'Next'}
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto">
        <div className="glass-effect rounded-3xl p-8 md:p-12 border border-border/50 backdrop-blur-xl">
          {/* Surah Header */}
          {verses.length > 0 && (
            <div className="text-center mb-8 pb-6 border-b border-border/50">
              <h2 className="text-2xl font-bold mb-2">
                {verses[0].chapter?.name_arabic}
              </h2>
              <p className="text-muted-foreground">
                {verses[0].chapter?.name_simple} - {verses[0].chapter?.translated_name?.name}
              </p>
            </div>
          )}

          {/* Verses */}
          <div className="space-y-8">
            {verses.map((verse) => {
              const verseKey = verse.verse_key;
              const [surahNum, ayahNum] = verseKey.split(':');

              return (
                <div key={verseKey} className="space-y-4">
                  {/* Ayah Number Badge */}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-sm font-medium">{ayahNum}</span>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div
                    className={`text-3xl md:text-4xl leading-loose text-center ${
                      settings.fontType === 'quran' ? 'font-[\'Amiri_Quran\']' : 'font-arabic'
                    }`}
                    dir="rtl"
                  >
                    {verse.text_uthmani}
                  </div>

                  {/* Translation */}
                  {settings.translationEnabled && verse.translations?.[0] && (
                    <p className="text-base md:text-lg text-muted-foreground text-center leading-relaxed">
                      {verse.translations[0].text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-center gap-4 pt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          {settings.language === 'ar' ? 'السابق' : 'Previous'}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleNextPage}
          disabled={currentPage === TOTAL_PAGES}
          className="rounded-full"
        >
          {settings.language === 'ar' ? 'التالي' : 'Next'}
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default QuranPages;
