import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';

const Quran = () => {
  const { settings } = useSettings();

  // Sample surahs data (will be replaced with API data later)
  const surahs = [
    { number: 1, name: 'الفاتحة', transliteration: 'Al-Fatihah', translation: 'The Opening', verses: 7, revelation: 'Meccan' },
    { number: 2, name: 'البقرة', transliteration: 'Al-Baqarah', translation: 'The Cow', verses: 286, revelation: 'Medinan' },
    { number: 3, name: 'آل عمران', transliteration: 'Ali \'Imran', translation: 'Family of Imran', verses: 200, revelation: 'Medinan' },
  ];

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
                      {settings.language === 'ar' ? surah.name : surah.transliteration}
                    </h3>
                    <Book className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>
                      {settings.language === 'ar' 
                        ? `${surah.verses} آية`
                        : `${surah.verses} verses`}
                    </span>
                    <span>•</span>
                    <span>
                      {settings.language === 'ar' 
                        ? (surah.revelation === 'Meccan' ? 'مكية' : 'مدنية')
                        : surah.revelation}
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
