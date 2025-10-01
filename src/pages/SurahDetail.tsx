import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  fetchSurahArabic, 
  fetchSurahTranslation, 
  fetchTafsir, 
  fetchWordByWord,
  getAyahAudioUrl,
  getSurahAudioUrl,
  WordData 
} from '@/lib/quran-api';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  ChevronDown, 
  Volume2,
  Loader2 
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from 'sonner';

const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  
  const [surahData, setSurahData] = useState<any>(null);
  const [translation, setTranslation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [playingSurah, setPlayingSurah] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{ ayahIndex: number; word: WordData } | null>(null);
  const [wordData, setWordData] = useState<Record<number, WordData[]>>({});
  const [tafsirData, setTafsirData] = useState<Record<number, string>>({});
  const [openTafsir, setOpenTafsir] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const surahAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadSurah();
  }, [surahNumber]);

  const loadSurah = async () => {
    if (!surahNumber) return;
    
    setLoading(true);
    try {
      const [arabic, trans] = await Promise.all([
        fetchSurahArabic(parseInt(surahNumber)),
        fetchSurahTranslation(parseInt(surahNumber), 'en.sahih'),
      ]);
      
      setSurahData(arabic);
      setTranslation(trans);
    } catch (error) {
      console.error('Error loading surah:', error);
      toast.error('Failed to load surah');
    } finally {
      setLoading(false);
    }
  };

  const loadWordByWord = async (ayahNumber: number) => {
    if (wordData[ayahNumber]) return;
    
    try {
      const words = await fetchWordByWord(parseInt(surahNumber!), ayahNumber);
      setWordData(prev => ({ ...prev, [ayahNumber]: words }));
    } catch (error) {
      console.error('Error loading word by word:', error);
    }
  };

  const loadTafsir = async (ayahNumber: number) => {
    if (tafsirData[ayahNumber]) return;
    
    try {
      const tafsir = await fetchTafsir(
        parseInt(surahNumber!), 
        ayahNumber,
        settings.tafsirSource
      );
      setTafsirData(prev => ({ ...prev, [ayahNumber]: tafsir }));
    } catch (error) {
      console.error('Error loading tafsir:', error);
    }
  };

  const playAyah = (ayahNumber: number) => {
    if (playingAyah === ayahNumber) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }

    const audioUrl = getAyahAudioUrl(settings.qari, parseInt(surahNumber!), ayahNumber);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(audioUrl);
    audioRef.current.play();
    setPlayingAyah(ayahNumber);
    
    audioRef.current.onended = () => {
      setPlayingAyah(null);
    };
  };

  const playSurah = () => {
    if (playingSurah) {
      surahAudioRef.current?.pause();
      setPlayingSurah(false);
      return;
    }

    const audioUrl = getSurahAudioUrl(settings.qari, parseInt(surahNumber!));
    
    if (surahAudioRef.current) {
      surahAudioRef.current.pause();
    }
    
    surahAudioRef.current = new Audio(audioUrl);
    surahAudioRef.current.play();
    setPlayingSurah(true);
    
    surahAudioRef.current.onended = () => {
      setPlayingSurah(false);
    };
  };

  const handleWordClick = async (ayahIndex: number, word: WordData) => {
    await loadWordByWord(ayahIndex + 1);
    setSelectedWord({ ayahIndex, word });
  };

  const playWordAudio = (word: WordData) => {
    if (word.audio) {
      const audio = new Audio(word.audio);
      audio.play();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!surahData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Surah not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/quran')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1">
          <h1 className={`text-3xl font-bold ${settings.fontType === 'quran' ? 'quran-font' : ''}`}>
            {settings.language === 'ar' ? surahData.name : surahData.englishName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {surahData.numberOfAyahs} {settings.language === 'ar' ? 'آية' : 'verses'} • {surahData.revelationType}
          </p>
        </div>

        <Button
          onClick={playSurah}
          className="rounded-full"
        >
          {playingSurah ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {settings.language === 'ar' ? 'تشغيل السورة' : 'Play Surah'}
        </Button>
      </div>

      {/* Bismillah */}
      {surahData.number !== 1 && surahData.number !== 9 && (
        <div className="text-center py-8 glass-effect rounded-2xl">
          <p className="text-2xl quran-font">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>
      )}

      {/* Ayahs */}
      <div className="space-y-6">
        {surahData.ayahs.map((ayah: any, index: number) => (
          <div
            key={ayah.number}
            className="glass-effect rounded-2xl p-6 space-y-4"
          >
            {/* Ayah Number & Play */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">{ayah.numberInSurah}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => playAyah(ayah.numberInSurah)}
                  className="rounded-full"
                >
                  {playingAyah === ayah.numberInSurah ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Arabic Text with word-by-word */}
            <div
              className={`text-2xl leading-loose text-right ${settings.fontType === 'quran' ? 'quran-font' : ''}`}
              dir="rtl"
            >
              {wordData[ayah.numberInSurah] ? (
                <div className="flex flex-wrap gap-2 justify-end">
                  {wordData[ayah.numberInSurah].map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      onClick={() => handleWordClick(index, word)}
                      className="cursor-pointer hover:text-primary smooth-transition relative group"
                    >
                      {word.text}
                      {selectedWord?.ayahIndex === index && selectedWord.word === word && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass-effect rounded-xl p-4 min-w-[200px] z-10 shadow-xl">
                          <div className="text-sm space-y-2 text-left" dir="ltr">
                            <p className="font-semibold text-foreground">{word.translation}</p>
                            <p className="text-muted-foreground italic">{word.transliteration}</p>
                            {word.audio && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playWordAudio(word);
                                }}
                                className="w-full"
                              >
                                <Volume2 className="h-3 w-3 mr-2" />
                                Play
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <span
                  onClick={() => loadWordByWord(ayah.numberInSurah)}
                  className="cursor-pointer"
                >
                  {ayah.text}
                </span>
              )}
            </div>

            {/* Translation */}
            {settings.translationEnabled && translation && (
              <p className="text-muted-foreground">
                {translation.ayahs[index]?.text}
              </p>
            )}

            {/* Tafsir Dropdown */}
            <Collapsible
              open={openTafsir === ayah.numberInSurah}
              onOpenChange={(open) => {
                if (open) {
                  setOpenTafsir(ayah.numberInSurah);
                  loadTafsir(ayah.numberInSurah);
                } else {
                  setOpenTafsir(null);
                }
              }}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                >
                  <span>{settings.language === 'ar' ? 'التفسير' : 'Tafsir'}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openTafsir === ayah.numberInSurah ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="glass-effect rounded-xl p-4 text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                  {tafsirData[ayah.numberInSurah] ? (
                    <div dangerouslySetInnerHTML={{ __html: tafsirData[ayah.numberInSurah] }} />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading tafsir...
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurahDetail;
