import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { JUZ_BOUNDARIES, JUZ_NAMES_AR } from '@/lib/juz-data';
import { fetchSurahs, fetchTafsir, fetchWordByWord, getAyahAudioUrl, WordData } from '@/lib/quran-api';
import { toArabicNumerals } from '@/lib/surah-pages';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ArrowLeft, Play, Pause, Bookmark, ChevronDown,
  Share2, MessageSquare, Volume2, Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { IslamicFactsLoader } from '@/components/IslamicFactsLoader';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import AyahChatDialog from '@/components/AyahChatDialog';
import { toast } from 'sonner';
import { useAudio } from '@/contexts/AudioContext';
import DOMPurify from 'dompurify';

const QURAN_COM_BASE = 'https://api.quran.com/api/v4';

const TRANSLATION_MAP: Record<string, number> = {
  'en.sahih': 20,
  'en.pickthall': 19,
  'ar.muyassar': 161,
  'transliteration': 57,
  'en.transliteration': 57,
};

interface JuzVerse {
  verseKey: string;
  surahNumber: number;
  ayahNumber: number;
  textArabic: string;
  textTranslation: string;
}

const JuzDetail = () => {
  const { juzNumber } = useParams<{ juzNumber: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === 'ar';
  const juzNum = parseInt(juzNumber || '1');
  const boundary = JUZ_BOUNDARIES.find(b => b.juz === juzNum);

  const [verses, setVerses] = useState<JuzVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [surahNames, setSurahNames] = useState<Record<number, { ar: string; en: string }>>({});
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [tafsirData, setTafsirData] = useState<Record<string, string>>({});
  const [openTafsir, setOpenTafsir] = useState<string | null>(null);
  const [chatAyah, setChatAyah] = useState<{ text: string; number: number; surahName: string } | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [wordData, setWordData] = useState<Record<string, WordData[]>>({});
  const [openWordPopover, setOpenWordPopover] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadJuz();
    loadUser();
    loadSurahNames();
    setHasUserScrolled(false);
  }, [juzNumber, settings.translationSource, settings.translationEnabled]);

  const loadSurahNames = async () => {
    try {
      const surahs = await fetchSurahs();
      const names: Record<number, { ar: string; en: string }> = {};
      surahs.forEach(s => {
        names[s.number] = { ar: s.name, en: s.englishName };
      });
      setSurahNames(names);
    } catch (e) {
      console.error('Error loading surah names:', e);
    }
  };

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user && boundary) {
      loadBookmarks(session.user.id);
    }
  };

  const loadBookmarks = async (userId: string) => {
    if (!boundary) return;
    const { data } = await supabase
      .from('bookmarks')
      .select('surah_number, ayah_number')
      .eq('user_id', userId)
      .eq('bookmark_type', 'ayah')
      .gte('surah_number', boundary.start.surah)
      .lte('surah_number', boundary.end.surah);

    if (data) {
      setBookmarkedAyahs(new Set(data.map(b => `${b.surah_number}:${b.ayah_number}`)));
    }
  };

  const loadJuz = async () => {
    if (!juzNumber) return;
    setLoading(true);

    try {
      // Fetch Arabic text
      const arabicRes = await fetch(`${QURAN_COM_BASE}/quran/verses/uthmani?juz_number=${juzNum}`);
      if (!arabicRes.ok) throw new Error('Failed to fetch Arabic');
      const arabicData = await arabicRes.json();

      // Fetch translation if enabled
      let translationTexts: string[] = [];
      if (settings.translationEnabled) {
        const translationId = TRANSLATION_MAP[settings.translationSource] || 20;
        try {
          const transRes = await fetch(`${QURAN_COM_BASE}/quran/translations/${translationId}?juz_number=${juzNum}`);
          if (transRes.ok) {
            const transData = await transRes.json();
            translationTexts = (transData.translations || []).map((t: any) =>
              (t.text || '').replace(/<[^>]*>/g, '').replace(/\[\d+\]/g, '').trim()
            );
          }
        } catch (e) {
          console.error('Translation fetch failed:', e);
        }
      }

      // Build verses array
      const juzVerses: JuzVerse[] = (arabicData.verses || []).map((v: any, i: number) => {
        const [surah, ayah] = (v.verse_key || '').split(':').map(Number);
        return {
          verseKey: v.verse_key,
          surahNumber: surah,
          ayahNumber: ayah,
          textArabic: v.text_uthmani || '',
          textTranslation: translationTexts[i] || '',
        };
      });

      setVerses(juzVerses);
    } catch (error) {
      console.error('Error loading Juz:', error);
      toast.error(isArabic ? 'فشل تحميل الجزء' : 'Failed to load Juz');
    } finally {
      setLoading(false);
    }
  };

  // Group verses by surah
  const groupedVerses = useMemo(() => {
    const groups: { surahNumber: number; verses: JuzVerse[] }[] = [];
    let currentGroup: { surahNumber: number; verses: JuzVerse[] } | null = null;

    const filtered = searchTerm.trim()
      ? verses.filter(v => {
          const num = parseInt(searchTerm);
          if (!isNaN(num)) return v.ayahNumber === num || v.surahNumber === num;
          const term = searchTerm.toLowerCase();
          return v.textArabic.includes(searchTerm) || v.textTranslation.toLowerCase().includes(term);
        })
      : verses;

    filtered.forEach(v => {
      if (!currentGroup || currentGroup.surahNumber !== v.surahNumber) {
        currentGroup = { surahNumber: v.surahNumber, verses: [] };
        groups.push(currentGroup);
      }
      currentGroup.verses.push(v);
    });

    return groups;
  }, [verses, searchTerm]);

  const playAyah = (surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    if (playingKey === key) {
      audioRef.current?.pause();
      setPlayingKey(null);
      return;
    }

    const url = getAyahAudioUrl('ar.alafasy', surahNum, ayahNum);
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(url);
    audioRef.current.play().catch(e => {
      console.error('Audio error:', e);
      toast.error(isArabic ? 'فشل التشغيل' : 'Failed to play');
    });
    setPlayingKey(key);
    audioRef.current.onended = () => setPlayingKey(null);
    audioRef.current.onerror = () => setPlayingKey(null);
  };

  const toggleBookmark = async (surahNum: number, ayahNum: number) => {
    if (!user) {
      toast.error(isArabic ? 'يجب تسجيل الدخول' : 'Please sign in');
      return;
    }
    const key = `${surahNum}:${ayahNum}`;
    const isBookmarked = bookmarkedAyahs.has(key);

    try {
      if (isBookmarked) {
        await supabase.from('bookmarks').delete()
          .eq('user_id', user.id)
          .eq('surah_number', surahNum)
          .eq('ayah_number', ayahNum)
          .eq('bookmark_type', 'ayah');
        setBookmarkedAyahs(prev => { const s = new Set(prev); s.delete(key); return s; });
      } else {
        await supabase.from('bookmarks').insert({
          user_id: user.id, surah_number: surahNum, ayah_number: ayahNum, bookmark_type: 'ayah'
        });
        setBookmarkedAyahs(prev => new Set([...prev, key]));
      }
      toast.success(isArabic ? (isBookmarked ? 'تمت الإزالة' : 'تمت الإضافة') : (isBookmarked ? 'Removed' : 'Added'));
    } catch (e) {
      toast.error(isArabic ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const loadTafsirForAyah = async (surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    if (tafsirData[key]) return;

    try {
      const tafsir = await fetchTafsir(surahNum, ayahNum, settings.tafsirSource);
      setTafsirData(prev => ({ ...prev, [key]: tafsir }));
    } catch (e) {
      console.error('Tafsir error:', e);
    }
  };

  const loadWordByWordForAyah = async (surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    if (wordData[key]) return;
    try {
      const words = await fetchWordByWord(surahNum, ayahNum);
      setWordData(prev => ({ ...prev, [key]: words }));
    } catch (e) {
      console.error('Word-by-word error:', e);
    }
  };

  const handleWordClick = (key: string, wordIndex: number) => {
    const fullKey = `${key}-${wordIndex}`;
    setOpenWordPopover(openWordPopover === fullKey ? null : fullKey);
  };

  const playWordAudio = (word: WordData) => {
    if (word.audio) {
      const audio = new Audio(word.audio);
      audio.play();
    }
  };

  const handleShareAyah = async (surahNum: number, ayahNum: number) => {
    const url = `${window.location.origin}/quran/${surahNum}?ayah=${ayahNum}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Quran ${surahNum}:${ayahNum}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(isArabic ? 'تم نسخ الرابط' : 'Link copied');
      }
    } catch (e) { /* ignore */ }
  };

  // Track scroll progress
  useEffect(() => {
    if (!user || verses.length === 0) return;

    let scrollTimeout: any;
    const handleScroll = () => {
      if (!hasUserScrolled) setHasUserScrolled(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const ayahElements = document.querySelectorAll('[data-juz-ayah]');
        let maxVisible: { surah: number; ayah: number } | null = null;

        ayahElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
            const [s, a] = (el.getAttribute('data-juz-ayah') || '').split(':').map(Number);
            if (s && a && (!maxVisible || s > maxVisible.surah || (s === maxVisible.surah && a > maxVisible.ayah))) {
              maxVisible = { surah: s, ayah: a };
            }
          }
        });

        if (maxVisible && hasUserScrolled) {
          supabase.from('reading_progress').upsert({
            user_id: user.id,
            surah_number: maxVisible.surah,
            ayah_number: maxVisible.ayah,
            progress_type: 'scroll',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,surah_number' }).then(({ error }) => {
            if (error) console.error('Progress save error:', error);
          });
        }
      }, 3000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [user, verses, hasUserScrolled]);

  const fontClass = settings.fontType === 'normal' ? '' :
    settings.fontType === 'amiri' ? 'amiri-font' :
    settings.fontType === 'scheherazade' ? 'scheherazade-font' :
    settings.fontType === 'lateef' ? 'lateef-font' :
    settings.fontType === 'noto-naskh' ? 'noto-naskh-font' :
    'quran-font';

  if (loading) return <IslamicFactsLoader />;

  return (
    <div className="space-y-6 relative">
      {/* Back button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/quran')}
        className="fixed top-6 left-6 z-[60] rounded-full w-8 h-8 hover:bg-background/80"
        title={isArabic ? 'العودة' : 'Back'}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      {/* Header */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 border border-border/50 backdrop-blur-xl">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {isArabic ? `الجزء ${toArabicNumerals(juzNum)}` : `Juz ${juzNum}`}
            </span>
          </h1>
          {JUZ_NAMES_AR[juzNum] && (
            <p className="text-lg text-muted-foreground quran-font" dir="rtl">
              {JUZ_NAMES_AR[juzNum]}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {isArabic
              ? `${toArabicNumerals(verses.length)} آية`
              : `${verses.length} verses`}
            {boundary && (
              <span className="mx-2 text-border">|</span>
            )}
            {boundary && (
              <span>
                {isArabic
                  ? `${surahNames[boundary.start.surah]?.ar || boundary.start.surah} — ${surahNames[boundary.end.surah]?.ar || boundary.end.surah}`
                  : `${surahNames[boundary.start.surah]?.en || `Surah ${boundary.start.surah}`} — ${surahNames[boundary.end.surah]?.en || `Surah ${boundary.end.surah}`}`}
              </span>
            )}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mt-4">
          {juzNum > 1 && (
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => { window.scrollTo(0, 0); navigate(`/quran/juz/${juzNum - 1}`); }}>
              {isArabic ? `الجزء ${toArabicNumerals(juzNum - 1)}` : `Juz ${juzNum - 1}`}
            </Button>
          )}
          {juzNum < 30 && (
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => { window.scrollTo(0, 0); navigate(`/quran/juz/${juzNum + 1}`); }}>
              {isArabic ? `الجزء ${toArabicNumerals(juzNum + 1)}` : `Juz ${juzNum + 1}`}
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="glass-effect rounded-2xl p-4">
        <div className="relative flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isArabic ? 'ابحث في الآيات...' : 'Search ayahs...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-2xl border-border/50 bg-background/50"
            />
          </div>
          {searchTerm && (
            <Button onClick={() => setSearchTerm('')} variant="outline" className="rounded-2xl">
              {isArabic ? 'مسح' : 'Clear'}
            </Button>
          )}
        </div>
      </div>

      {/* Verses grouped by surah */}
      {groupedVerses.map(group => {
        const sName = surahNames[group.surahNumber];
        const surahDisplayName = sName
          ? (isArabic ? sName.ar : sName.en)
          : `${isArabic ? 'سورة' : 'Surah'} ${group.surahNumber}`;

        return (
          <div key={`${juzNum}-${group.surahNumber}`} className="space-y-4">
            {/* Surah Divider */}
            <div className="glass-effect rounded-2xl p-4 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent text-center">
              <h2 className={`text-xl font-bold text-primary ${fontClass}`}>
                {surahDisplayName}
              </h2>
              {group.verses[0]?.ayahNumber === 1 && group.surahNumber !== 1 && group.surahNumber !== 9 && (
                <p className="text-2xl quran-font mt-3 text-foreground/80" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              )}
            </div>

            {/* Ayahs */}
            {group.verses.map(verse => {
              const key = verse.verseKey;
              const isPlaying = playingKey === key;
              const isBookmarked = bookmarkedAyahs.has(key);
              const words = wordData[key];
              const showWordByWord = settings.wordByWordMode === 'under' && words;

              return (
                <div
                  key={key}
                  data-juz-ayah={key}
                  className={`glass-effect rounded-2xl p-6 space-y-4 smooth-transition ${
                    isPlaying ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                >
                  {/* Actions row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-sm font-bold">
                          {isArabic ? toArabicNumerals(verse.ayahNumber) : verse.ayahNumber}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {verse.verseKey}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => playAyah(verse.surahNumber, verse.ayahNumber)}>
                        {isPlaying ? <Pause className="h-4 w-4 text-primary" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleBookmark(verse.surahNumber, verse.ayahNumber)}>
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShareAyah(verse.surahNumber, verse.ayahNumber)}>
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      {settings.tafsirEnabled && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                          const newKey = openTafsir === key ? null : key;
                          setOpenTafsir(newKey);
                          if (newKey) loadTafsirForAyah(verse.surahNumber, verse.ayahNumber);
                        }}>
                          <ChevronDown className={`h-4 w-4 smooth-transition ${openTafsir === key ? 'rotate-180' : ''}`} />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                        setChatAyah({ text: verse.textArabic, number: verse.ayahNumber, surahName: surahDisplayName });
                      }}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Arabic Text - Word by Word mode or plain */}
                  {showWordByWord ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-3 justify-end" dir="rtl">
                      {words.map((word, wi) => (
                        <div key={wi} className="text-center space-y-1">
                          <span className={`text-2xl ${fontClass} cursor-pointer hover:text-primary smooth-transition`}
                            onClick={() => playWordAudio(word)}>
                            {word.text}
                          </span>
                          <p className="text-[10px] text-muted-foreground max-w-[80px] truncate">{word.translation}</p>
                          <p className="text-[9px] text-muted-foreground/70 italic">{word.transliteration}</p>
                        </div>
                      ))}
                    </div>
                  ) : settings.wordByWordMode === 'click' ? (
                    <div className="flex flex-wrap gap-x-2 gap-y-1 justify-end" dir="rtl"
                      onMouseEnter={() => loadWordByWordForAyah(verse.surahNumber, verse.ayahNumber)}>
                      {(wordData[key] || verse.textArabic.split(' ')).map((wordOrText, wi) => {
                        const word = typeof wordOrText === 'string' ? null : wordOrText;
                        const text = word ? word.text : wordOrText;
                        const popKey = `${key}-${wi}`;

                        return word ? (
                          <Popover key={wi} open={openWordPopover === popKey} onOpenChange={(open) => setOpenWordPopover(open ? popKey : null)}>
                            <PopoverTrigger asChild>
                              <span className={`text-2xl leading-[2.5] ${fontClass} cursor-pointer hover:text-primary smooth-transition`}
                                onClick={() => handleWordClick(key, wi)}>
                                {text}
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-3 space-y-1" align="center">
                              <p className="font-semibold text-sm">{word.translation}</p>
                              <p className="text-xs text-muted-foreground italic">{word.transliteration}</p>
                              {word.audio && (
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => playWordAudio(word)}>
                                  <Volume2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span key={wi} className={`text-2xl leading-[2.5] ${fontClass}`}>
                            {text}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className={`text-2xl md:text-3xl leading-[2.5] text-right ${fontClass}`} dir="rtl">
                      {verse.textArabic}
                    </p>
                  )}

                  {/* Translation */}
                  {settings.translationEnabled && verse.textTranslation && (
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                      {verse.textTranslation}
                    </p>
                  )}

                  {/* Tafsir */}
                  {openTafsir === key && tafsirData[key] && (
                    <div
                      className="bg-muted/30 rounded-xl p-4 text-sm leading-relaxed border border-border/30 animate-fade-in"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tafsirData[key]) }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Next/Previous Juz Navigation */}
      <div className="flex gap-3 pb-8">
        {juzNum > 1 && (
          <Button variant="outline" className="flex-1 rounded-2xl h-14" onClick={() => { window.scrollTo(0, 0); navigate(`/quran/juz/${juzNum - 1}`); }}>
            {isArabic ? `الجزء السابق: ${toArabicNumerals(juzNum - 1)}` : `Previous: Juz ${juzNum - 1}`}
          </Button>
        )}
        {juzNum < 30 && (
          <Button className="flex-1 rounded-2xl h-14" onClick={() => { window.scrollTo(0, 0); navigate(`/quran/juz/${juzNum + 1}`); }}>
            {isArabic ? `الجزء التالي: ${toArabicNumerals(juzNum + 1)}` : `Next: Juz ${juzNum + 1}`}
          </Button>
        )}
      </div>

      {/* Chat Dialog */}
      {chatAyah && (
        <AyahChatDialog
          open={!!chatAyah}
          onOpenChange={(open) => !open && setChatAyah(null)}
          ayahText={chatAyah.text}
          ayahNumber={chatAyah.number}
          surahName={chatAyah.surahName}
        />
      )}
    </div>
  );
};

export default JuzDetail;
