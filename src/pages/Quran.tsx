import React, { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Link } from 'react-router-dom';
import { Book, Loader2 } from 'lucide-react';
import { fetchSurahs, Surah } from '@/lib/quran-api';
import { toast } from 'sonner';

const Quran = () => {
  const { settings } = useSettings();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurahs();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">
          {settings.language === 'ar' ? 'القرآن الكريم' : 'The Holy Quran'}
        </h1>
        <p className="text-muted-foreground">
          {settings.language === 'ar' 
            ? 'اختر سورة للقراءة'
            : 'Select a surah to read'}
        </p>
      </div>

      <div className="space-y-3">
        {surahs.map((surah) => (
          <Link
            key={surah.number}
            to={`/quran/${surah.number}`}
            className="block"
          >
            <div className="glass-effect rounded-2xl p-5 smooth-transition hover:scale-[1.02] apple-shadow hover:shadow-xl">
              <div className="flex items-center gap-4">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Quran;
