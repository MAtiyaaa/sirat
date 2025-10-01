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

// Fetch all surahs
export async function fetchSurahs(): Promise<Surah[]> {
  const response = await fetch(`${ALQURAN_BASE}/surah`);
  const data = await response.json();
  return data.data.map((s: any) => ({
    number: s.number,
    name: s.name,
    englishName: s.englishName,
    englishNameTranslation: s.englishNameTranslation,
    numberOfAyahs: s.numberOfAyahs,
    revelationType: s.revelationType,
  }));
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

// Fetch transliteration for surah
export async function fetchTransliteration(surahNumber: number) {
  try {
    const response = await fetch(`${QURAN_COM_BASE}/quran/verses/transliteration?chapter_number=${surahNumber}`);
    const data = await response.json();
    return data.verses || [];
  } catch (error) {
    console.error('Error fetching transliteration:', error);
    return [];
  }
}
