// Quran API utilities using multiple real sources

const ALQURAN_BASE = 'https://api.alquran.cloud/v1';
const QURAN_COM_BASE = 'https://api.quran.com/api/v4';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
  translation?: string;
  transliteration?: string;
}

export interface WordData {
  text: string;
  translation: string;
  transliteration: string;
  audio?: string;
}

const SURAHS_CACHE_KEY = 'quran_surahs_cache';
const CACHE_EXPIRY_HOURS = 24;

// Get cached surahs from localStorage
function getCachedSurahs(): Surah[] | null {
  try {
    const cached = localStorage.getItem(SURAHS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Validate cache structure
      if (!parsed || typeof parsed !== 'object' || !parsed.data || !parsed.timestamp) {
        console.warn('Invalid cache structure, clearing cache');
        localStorage.removeItem(SURAHS_CACHE_KEY);
        return null;
      }
      
      const { data, timestamp } = parsed;
      
      // Validate data is an array with expected properties
      if (!Array.isArray(data) || data.length === 0 || !data[0].number) {
        console.warn('Invalid cached data format, clearing cache');
        localStorage.removeItem(SURAHS_CACHE_KEY);
        return null;
      }
      
      const expiryTime = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
      if (Date.now() - timestamp < expiryTime) {
        return data;
      }
    }
  } catch (error) {
    console.error('Error reading cache, clearing:', error);
    // Clear corrupted cache
    try {
      localStorage.removeItem(SURAHS_CACHE_KEY);
    } catch (e) {
      // Ignore
    }
  }
  return null;
}

// Save surahs to localStorage cache
function cacheSurahs(surahs: Surah[]): void {
  try {
    localStorage.setItem(SURAHS_CACHE_KEY, JSON.stringify({
      data: surahs,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error caching surahs:', error);
  }
}

// Clear the surahs cache (useful for debugging)
export function clearSurahsCache(): void {
  try {
    localStorage.removeItem(SURAHS_CACHE_KEY);
    console.log('Surahs cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

// Fetch all surahs with retry logic and offline caching
export async function fetchSurahs(retries = 3): Promise<Surah[]> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(`${ALQURAN_BASE}/surah`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format');
      }
      
      const surahs = data.data.map((s: any) => ({
        number: s.number,
        name: s.name,
        englishName: s.englishName,
        englishNameTranslation: s.englishNameTranslation,
        numberOfAyahs: s.numberOfAyahs,
        revelationType: s.revelationType,
      }));
      
      // Cache successful response
      cacheSurahs(surahs);
      
      return surahs;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < retries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  // If all retries failed, try to return cached data
  const cachedSurahs = getCachedSurahs();
  if (cachedSurahs) {
    console.log('Using cached surahs due to network failure');
    return cachedSurahs;
  }
  
  throw lastError || new Error('Failed to fetch surahs after multiple attempts');
}

// Fetch surah with Arabic text
export async function fetchSurahArabic(surahNumber: number) {
  const response = await fetch(`${ALQURAN_BASE}/surah/${surahNumber}`);
  const data = await response.json();
  return data.data;
}

// Fetch surah translation
export async function fetchSurahTranslation(surahNumber: number, edition: string = 'en.sahih') {
  const response = await fetch(`${ALQURAN_BASE}/surah/${surahNumber}/${edition}`);
  const data = await response.json();
  return data.data;
}

// Fetch tafsir
export async function fetchTafsir(surahNumber: number, ayahNumber: number, tafsirId: string = 'en-tafisr-ibn-kathir') {
  try {
    const response = await fetch(`${QURAN_COM_BASE}/tafsirs/${tafsirId}/by_ayah/${surahNumber}:${ayahNumber}`);
    const data = await response.json();
    return data.tafsir?.text || 'Tafsir not available';
  } catch (error) {
    console.error('Error fetching tafsir:', error);
    return 'Tafsir not available';
  }
}

// Fetch word by word data
export async function fetchWordByWord(surahNumber: number, ayahNumber: number): Promise<WordData[]> {
  try {
    const response = await fetch(
      `${QURAN_COM_BASE}/verses/by_key/${surahNumber}:${ayahNumber}?words=true&translations=131&word_fields=text_uthmani,text_imlaei,translation,transliteration&translation_fields=resource_name,text`
    );
    const data = await response.json();
    
    if (data.verse && data.verse.words) {
      return data.verse.words.map((word: any) => ({
        text: word.text_uthmani || word.text_imlaei,
        translation: word.translation?.text || '',
        transliteration: word.transliteration?.text || '',
        audio: word.audio?.url || null,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching word by word:', error);
    return [];
  }
}

// Get audio URL for ayah - using everyayah.com reliable CDN
export function getAyahAudioUrl(qari: string, surahNumber: number, ayahNumber: number): string {
  // Map qari codes to everyayah.com reciter paths
  const qariMap: Record<string, string> = {
    'ar.alafasy': 'Alafasy_128kbps',
    'ar.abdulbasitmurattal': 'Abdul_Basit_Murattal_192kbps',
    'ar.husary': 'Husary_128kbps',
    'ar.minshawi': 'Minshawy_Murattal_128kbps',
  };
  
  const qariPath = qariMap[qari] || 'Alafasy_128kbps';
  const paddedSurah = surahNumber.toString().padStart(3, '0');
  const paddedAyah = ayahNumber.toString().padStart(3, '0');
  
  return `https://everyayah.com/data/${qariPath}/${paddedSurah}${paddedAyah}.mp3`;
}

// Get all ayah audio URLs for a surah (for sequential playback)
export function getSurahAyahUrls(qari: string, surahNumber: number, numberOfAyahs: number): string[] {
  const urls: string[] = [];
  for (let i = 1; i <= numberOfAyahs; i++) {
    urls.push(getAyahAudioUrl(qari, surahNumber, i));
  }
  return urls;
}


// Fetch verses by page number
export async function fetchVersesByPage(pageNumber: number) {
  try {
    const response = await fetch(`${QURAN_COM_BASE}/verses/by_page/${pageNumber}?words=false&translations=131`);
    const data = await response.json();
    return data.verses || [];
  } catch (error) {
    console.error('Error fetching verses by page:', error);
    return [];
  }
}

// Get page number for a specific ayah
export async function getPageNumber(surahNumber: number, ayahNumber: number): Promise<number | null> {
  try {
    const response = await fetch(`${QURAN_COM_BASE}/verses/by_key/${surahNumber}:${ayahNumber}?words=false`);
    const data = await response.json();
    return data.verse?.page_number || null;
  } catch (error) {
    console.error('Error fetching page number:', error);
    return null;
  }
}

// Get first ayah of a page (returns {surahNumber, ayahNumber})
export async function getFirstAyahOfPage(pageNumber: number): Promise<{surahNumber: number, ayahNumber: number} | null> {
  try {
    const verses = await fetchVersesByPage(pageNumber);
    if (verses.length > 0) {
      const firstVerse = verses[0];
      return {
        surahNumber: firstVerse.chapter_id || firstVerse.verse_key?.split(':')[0],
        ayahNumber: firstVerse.verse_number || firstVerse.verse_key?.split(':')[1]
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting first ayah of page:', error);
    return null;
  }
}
