import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  fetchSurahArabic, 
  fetchSurahTranslation, 
  fetchTafsir, 
  fetchWordByWord,
  getAyahAudioUrl,
  WordData 
} from '@/lib/quran-api';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp,
  Volume2,
  MessageSquare,
  Bookmark
} from 'lucide-react';
import { IslamicFactsLoader } from '@/components/IslamicFactsLoader';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AyahChatDialog from '@/components/AyahChatDialog';
import { toast } from 'sonner';
import { useAudio } from '@/contexts/AudioContext';

const SurahDetail = () => {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { playingSurah, playingAyah: globalPlayingAyah, isPlaying, playSurah: playGlobalSurah, pauseSurah, resumeSurah, stopSurah } = useAudio();
  
  // State management
  const [surahData, setSurahData] = useState<any>(null);
  const [translation, setTranslation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [openWordPopover, setOpenWordPopover] = useState<string | null>(null);
  const [wordData, setWordData] = useState<Record<number, WordData[]>>({});
  const [tafsirData, setTafsirData] = useState<Record<number, string>>({});
  const [openTafsir, setOpenTafsir] = useState<number | null>(null);
  const [lastVisibleAyah, setLastVisibleAyah] = useState<number>(1);
  const [chatAyah, setChatAyah] = useState<{ text: string; number: number } | null>(null);
  const [hasRestoredScroll, setHasRestoredScroll] = useState(false);
  const [isSurahBookmarked, setIsSurahBookmarked] = useState(false);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [showBackButton, setShowBackButton] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadSurah();
    setHasRestoredScroll(false);
    loadUser();
    loadBookmarks();
    saveLastViewed();
  }, [surahNumber]);

  // Restore scroll position after data loads
  useEffect(() => {
    if (!surahData || hasRestoredScroll) return;

    const restoreScroll = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !surahNumber) return;

      let ayahNumber: number | null = null;

      // Determine which tracking mode to use
      const trackingMode = settings.readingTrackingMode;

      if (trackingMode === 'auto') {
        // Get the most recent ayah from all tracking methods
        const promises = [
          // Scroll position
          supabase
            .from('reading_progress')
            .select('ayah_number, updated_at')
            .eq('user_id', session.user.id)
            .eq('surah_number', parseInt(surahNumber))
            .maybeSingle(),
          // Bookmarks
          supabase
            .from('bookmarks')
            .select('ayah_number, created_at')
            .eq('user_id', session.user.id)
            .eq('surah_number', parseInt(surahNumber))
            .eq('bookmark_type', 'ayah')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          // Reciting
          supabase
            .from('ayah_interactions')
            .select('ayah_number, updated_at')
            .eq('user_id', session.user.id)
            .eq('surah_number', parseInt(surahNumber))
            .eq('interaction_type', 'recite')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          // Click
          supabase
            .from('ayah_interactions')
            .select('ayah_number, updated_at')
            .eq('user_id', session.user.id)
            .eq('surah_number', parseInt(surahNumber))
            .eq('interaction_type', 'click')
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ];

        const results = await Promise.all(promises);
        
        // Find the most recent entry
        let mostRecent: { ayah: number; time: string } | null = null;
        
        results.forEach((result, index) => {
          if (result.data) {
            const timeField = index === 0 || index === 2 || index === 3 ? 'updated_at' : 'created_at';
            const time = result.data[timeField] as string;
            const ayah = result.data.ayah_number;
            
            if (!mostRecent || new Date(time) > new Date(mostRecent.time)) {
              mostRecent = { ayah, time };
            }
          }
        });
        
        ayahNumber = mostRecent?.ayah || null;
      } else if (trackingMode === 'scroll') {
        // Get from reading progress (scroll position)
        const { data } = await supabase
          .from('reading_progress')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', parseInt(surahNumber))
          .maybeSingle();
        ayahNumber = data?.ayah_number || null;
      } else if (trackingMode === 'bookmark') {
        // Get last bookmarked ayah
        const { data } = await supabase
          .from('bookmarks')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', parseInt(surahNumber))
          .eq('bookmark_type', 'ayah')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        ayahNumber = data?.ayah_number || null;
      } else if (trackingMode === 'reciting') {
        // Get last recited ayah
        const { data } = await supabase
          .from('ayah_interactions')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', parseInt(surahNumber))
          .eq('interaction_type', 'recite')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        ayahNumber = data?.ayah_number || null;
      } else if (trackingMode === 'click') {
        // Get last clicked/interacted ayah
        const { data } = await supabase
          .from('ayah_interactions')
          .select('ayah_number')
          .eq('user_id', session.user.id)
          .eq('surah_number', parseInt(surahNumber))
          .eq('interaction_type', 'click')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        ayahNumber = data?.ayah_number || null;
      }

      if (ayahNumber) {
        setTimeout(() => {
          const element = document.querySelector(`[data-ayah="${ayahNumber}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHasRestoredScroll(true);
          }
        }, 500);
      } else {
        setHasRestoredScroll(true);
      }
    };

    restoreScroll();
  }, [surahData, surahNumber, hasRestoredScroll, settings.readingTrackingMode]);

  // Track scroll progress and save to database
  useEffect(() => {
    if (!surahData) return;

    const handleScroll = () => {
      const ayahElements = document.querySelectorAll('[data-ayah]');
      let maxVisible = 1;

      ayahElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const ayahNum = parseInt(el.getAttribute('data-ayah') || '1');
          if (ayahNum > maxVisible) maxVisible = ayahNum;
        }
      });

      setLastVisibleAyah(maxVisible);
      
      // Show/hide back button based on scroll position
      setShowBackButton(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [surahData]);

  // Save progress to database
  useEffect(() => {
    const saveProgress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !surahNumber) return;

      try {
        const { error } = await supabase
          .from('reading_progress')
          .upsert({
            user_id: session.user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: lastVisibleAyah,
            progress_type: 'scroll',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number',
            ignoreDuplicates: false,
          });
        
        if (error) {
          console.error('Error saving scroll progress:', error);
        }
      } catch (error) {
        console.error('Error saving scroll progress:', error);
      }
    };

    const timeoutId = setTimeout(saveProgress, 2000); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [lastVisibleAyah, surahNumber]);

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const loadBookmarks = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user || !surahNumber) return;

    // Load surah bookmark
    const { data: surahBookmark } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('surah_number', parseInt(surahNumber))
      .eq('bookmark_type', 'surah')
      .maybeSingle();

    setIsSurahBookmarked(!!surahBookmark);

    // Load ayah bookmarks
    const { data: ayahBookmarks } = await supabase
      .from('bookmarks')
      .select('ayah_number')
      .eq('user_id', session.user.id)
      .eq('surah_number', parseInt(surahNumber))
      .eq('bookmark_type', 'ayah');

    if (ayahBookmarks) {
      setBookmarkedAyahs(new Set(ayahBookmarks.map(b => b.ayah_number).filter(Boolean) as number[]));
    }
  };

  const saveLastViewed = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user || !surahNumber) return;

    try {
      const { error } = await supabase
        .from('last_viewed_surah')
        .upsert({
          user_id: session.user.id,
          surah_number: parseInt(surahNumber),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) {
        console.error('Error saving last viewed:', error);
      }
    } catch (error) {
      console.error('Error saving last viewed:', error);
    }
  };

  const toggleSurahBookmark = async () => {
    if (!user || !surahNumber) {
      toast.error(settings.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    try {
      if (isSurahBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('surah_number', parseInt(surahNumber))
          .eq('bookmark_type', 'surah');
        
        setIsSurahBookmarked(false);
        toast.success(settings.language === 'ar' ? 'تم إزالة الإشارة المرجعية' : 'Bookmark removed');
      } else {
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            bookmark_type: 'surah'
          });
        
        setIsSurahBookmarked(true);
        toast.success(settings.language === 'ar' ? 'تمت الإضافة للإشارات المرجعية' : 'Added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error(settings.language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const toggleAyahBookmark = async (ayahNumber: number) => {
    if (!user || !surahNumber) {
      toast.error(settings.language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      return;
    }

    try {
      const isBookmarked = bookmarkedAyahs.has(ayahNumber);
      
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('surah_number', parseInt(surahNumber))
          .eq('ayah_number', ayahNumber)
          .eq('bookmark_type', 'ayah');
        
        setBookmarkedAyahs(prev => {
          const newSet = new Set(prev);
          newSet.delete(ayahNumber);
          return newSet;
        });
        toast.success(settings.language === 'ar' ? 'تم إزالة الإشارة المرجعية' : 'Bookmark removed');
      } else {
        // Add bookmark
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayahNumber,
            bookmark_type: 'ayah'
          });
        
        // Track bookmark interaction
        await supabase
          .from('ayah_interactions')
          .upsert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayahNumber,
            interaction_type: 'bookmark',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number,ayah_number,interaction_type',
            ignoreDuplicates: false,
          });
        
        setBookmarkedAyahs(prev => new Set([...prev, ayahNumber]));
        toast.success(settings.language === 'ar' ? 'تمت الإضافة للإشارات المرجعية' : 'Added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error(settings.language === 'ar' ? 'حدث خطأ' : 'An error occurred');
    }
  };

  const handleAyahChat = async (ayah: any) => {
    // Update last visible ayah
    setLastVisibleAyah(ayah.numberInSurah);
    
    // Track click interaction
    if (user && surahNumber) {
      try {
        const { error } = await supabase
          .from('ayah_interactions')
          .upsert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayah.numberInSurah,
            interaction_type: 'click',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number,ayah_number,interaction_type',
            ignoreDuplicates: false,
          });
        
        if (error) {
          console.error('Error saving interaction:', error);
        }
      } catch (error) {
        console.error('Error saving interaction:', error);
      }
    }
    setChatAyah({ text: ayah.text, number: ayah.numberInSurah });
  };

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
      
      // Auto-load word-by-word for all ayahs
      if (arabic?.ayahs) {
        const wordPromises = arabic.ayahs.map((ayah: any) => 
          fetchWordByWord(parseInt(surahNumber), ayah.numberInSurah)
            .then(words => ({ ayahNumber: ayah.numberInSurah, words }))
            .catch(error => {
              console.error(`Error loading word by word for ayah ${ayah.numberInSurah}:`, error);
              return null;
            })
        );
        
        const wordResults = await Promise.all(wordPromises);
        const newWordData: Record<number, any[]> = {};
        wordResults.forEach(result => {
          if (result) {
            newWordData[result.ayahNumber] = result.words;
          }
        });
        setWordData(newWordData);
      }
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

    // Update last visible ayah
    setLastVisibleAyah(ayahNumber);

    // Track click interaction
    if (user && surahNumber) {
      try {
        const { error } = await supabase
          .from('ayah_interactions')
          .upsert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayahNumber,
            interaction_type: 'click',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number,ayah_number,interaction_type',
            ignoreDuplicates: false,
          });
        
        if (error) {
          console.error('Error saving interaction:', error);
        }
      } catch (error) {
        console.error('Error saving interaction:', error);
      }
    }
    
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

  const playAyah = async (ayahNumber: number) => {
    if (playingAyah === ayahNumber) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }

    // Update last visible ayah
    setLastVisibleAyah(ayahNumber);

    // Track reciting interaction
    if (user && surahNumber) {
      try {
        const { error } = await supabase
          .from('ayah_interactions')
          .upsert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayahNumber,
            interaction_type: 'recite',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number,ayah_number,interaction_type',
            ignoreDuplicates: false,
          });
        
        if (error) {
          console.error('Error saving interaction:', error);
        }
      } catch (error) {
        console.error('Error saving interaction:', error);
      }
    }

    const audioUrl = getAyahAudioUrl(settings.qari, parseInt(surahNumber!), ayahNumber);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(audioUrl);
    audioRef.current.play()
      .catch(error => {
        console.error('Error playing ayah audio:', error);
        toast.error('Failed to play audio');
      });
    setPlayingAyah(ayahNumber);
    
    audioRef.current.onended = () => {
      setPlayingAyah(null);
    };
    
    audioRef.current.onerror = () => {
      toast.error('Error loading audio');
      setPlayingAyah(null);
    };
  };

  const playSurah = () => {
    const currentSurahNumber = parseInt(surahNumber!);
    
    // If this surah is already playing globally
    if (playingSurah === currentSurahNumber) {
      if (isPlaying) {
        pauseSurah();
      } else {
        resumeSurah();
      }
      return;
    }

    // If another surah is playing, stop it first
    if (playingSurah && playingSurah !== currentSurahNumber) {
      stopSurah();
    }

    if (!surahData) return;
    
    // Start playing this surah through global context
    playGlobalSurah(currentSurahNumber, surahData.numberOfAyahs);
  };

  const handleWordClick = async (ayahNumber: number, wordIndex: number) => {
    const key = `${ayahNumber}-${wordIndex}`;
    setOpenWordPopover(openWordPopover === key ? null : key);
    
    // Update last visible ayah to the one being clicked
    setLastVisibleAyah(ayahNumber);

    // Track click interaction
    if (user && surahNumber) {
      try {
        const { error } = await supabase
          .from('ayah_interactions')
          .upsert({
            user_id: user.id,
            surah_number: parseInt(surahNumber),
            ayah_number: ayahNumber,
            interaction_type: 'click',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,surah_number,ayah_number,interaction_type',
            ignoreDuplicates: false,
          });
        
        if (error) {
          console.error('Error saving interaction:', error);
        }
      } catch (error) {
        console.error('Error saving interaction:', error);
      }
    }
  };

  const playWordAudio = (word: WordData) => {
    if (word.audio) {
      const audio = new Audio(word.audio);
      audio.play();
    }
  };

  if (loading) {
    return <IslamicFactsLoader />;
  }

  if (!surahData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Surah not found</p>
      </div>
    );
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Floating Back Button */}
      {showBackButton && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 shadow-lg hover:shadow-xl smooth-transition"
          title={settings.language === 'ar' ? 'العودة للأعلى' : 'Back to top'}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}

      {/* Header */}
      <div className="glass-effect rounded-3xl p-6 md:p-8 border border-border/50 backdrop-blur-xl">
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
            <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${settings.fontType === 'quran' ? 'quran-font' : ''}`}>
              <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                {settings.language === 'ar' ? surahData.name : surahData.englishName}
              </span>
            </h1>
            <p className="text-base text-muted-foreground mt-2">
              {surahData.numberOfAyahs} {settings.language === 'ar' ? 'آية' : 'verses'} • {surahData.revelationType}
            </p>
          </div>

          <Button
            onClick={playSurah}
            className="rounded-full px-6 py-6 shadow-lg hover:shadow-xl smooth-transition"
            size="lg"
          >
            {playingSurah === parseInt(surahNumber!) && isPlaying ? (
              <Pause className="h-5 w-5 mr-2" />
            ) : (
              <Play className="h-5 w-5 mr-2" />
            )}
            <span className="font-semibold">
              {playingSurah === parseInt(surahNumber!) && isPlaying
                ? (settings.language === 'ar' ? 'إيقاف مؤقت' : 'Pause')
                : (settings.language === 'ar' ? 'تشغيل السورة' : 'Play Surah')}
            </span>
          </Button>

          <Button
            onClick={toggleSurahBookmark}
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            title={settings.language === 'ar' ? 'إضافة إشارة مرجعية' : 'Bookmark surah'}
          >
            <Bookmark className={`h-5 w-5 ${isSurahBookmarked ? 'fill-primary text-primary' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Bismillah */}
      {surahData.number !== 1 && surahData.number !== 9 && (
        <div className="text-center py-12 glass-effect rounded-3xl border border-border/50 backdrop-blur-xl apple-shadow">
          <p className="text-3xl md:text-4xl quran-font bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Ayahs */}
      <div className="space-y-6">
        {surahData.ayahs.map((ayah: any, index: number) => (
          <div
            key={ayah.number}
            data-ayah={ayah.numberInSurah}
            className={`glass-effect rounded-2xl p-6 space-y-4 smooth-transition ${
              playingSurah === parseInt(surahNumber!) && globalPlayingAyah === ayah.numberInSurah ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAyahChat(ayah)}
                  className="rounded-full"
                  title={settings.language === 'ar' ? 'اسأل عن هذه الآية' : 'Ask about this ayah'}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleAyahBookmark(ayah.numberInSurah)}
                  className="rounded-full"
                  title={settings.language === 'ar' ? 'إضافة إشارة مرجعية' : 'Bookmark ayah'}
                >
                  <Bookmark className={`h-4 w-4 ${bookmarkedAyahs.has(ayah.numberInSurah) ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Arabic Text with word-by-word */}
            <div
              className={`text-2xl leading-loose text-right ${settings.fontType === 'quran' ? 'quran-font' : ''}`}
              dir="rtl"
            >
              {wordData[ayah.numberInSurah] ? (
                <div className="flex flex-wrap gap-2 justify-end text-right" dir="rtl">
                  {wordData[ayah.numberInSurah].map((word, wordIndex) => {
                    const popoverKey = `${ayah.numberInSurah}-${wordIndex}`;
                    return (
                      <Popover 
                        key={wordIndex}
                        open={openWordPopover === popoverKey}
                        onOpenChange={(open) => {
                          if (!open) setOpenWordPopover(null);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <button
                            onClick={() => handleWordClick(ayah.numberInSurah, wordIndex)}
                            className="cursor-pointer hover:text-primary smooth-transition inline-block bg-transparent border-0 p-0 m-0 font-inherit"
                            style={{ font: 'inherit' }}
                          >
                            {word.text}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-[280px] p-4 glass-effect backdrop-blur-xl border-border/50"
                          side="top"
                          align="center"
                          sideOffset={8}
                        >
                          <div className="space-y-3 text-left" dir="ltr">
                            <div>
                              <p className="font-semibold text-foreground text-base mb-1">{word.translation}</p>
                              <p className="text-muted-foreground italic text-sm">{word.transliteration}</p>
                            </div>
                            {word.audio && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playWordAudio(word);
                                }}
                                className="w-full"
                              >
                                <Volume2 className="h-3 w-3 mr-2" />
                                {settings.language === 'ar' ? 'تشغيل' : 'Play'}
                              </Button>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>
              ) : (
                <span>{ayah.text}</span>
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
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      {settings.language === 'ar' ? 'جاري التحميل...' : 'Loading tafsir...'}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>

      <AyahChatDialog
        open={!!chatAyah}
        onOpenChange={(open) => !open && setChatAyah(null)}
        ayahText={chatAyah?.text || ''}
        ayahNumber={chatAyah?.number || 0}
        surahName={surahData?.englishName || ''}
      />
    </div>
  );
};

export default SurahDetail;
