import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { getAyahAudioUrl } from '@/lib/quran-api';
import { useSettings } from './SettingsContext';

interface AudioContextType {
  playingSurah: number | null;
  playingAyah: number | null;
  isPlaying: boolean;
  playSurah: (surahNumber: number, totalAyahs: number) => void;
  pauseSurah: () => void;
  resumeSurah: () => void;
  stopSurah: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [playingSurah, setPlayingSurah] = useState<number | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const totalAyahsRef = useRef<number>(0);

  const playNextAyah = (surahNumber: number, ayahIndex: number, total: number) => {
    if (ayahIndex > total) {
      setPlayingSurah(null);
      setPlayingAyah(null);
      setIsPlaying(false);
      return;
    }

    const audioUrl = getAyahAudioUrl('ar.alafasy', surahNumber, ayahIndex);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(audioUrl);
    audioRef.current.play();
    setPlayingAyah(ayahIndex);

    audioRef.current.onended = () => {
      playNextAyah(surahNumber, ayahIndex + 1, total);
    };

    audioRef.current.onerror = () => {
      console.error('Error playing ayah');
      playNextAyah(surahNumber, ayahIndex + 1, total);
    };
  };

  const playSurah = (surahNumber: number, totalAyahs: number) => {
    // Pause any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setPlayingSurah(surahNumber);
    totalAyahsRef.current = totalAyahs;
    setIsPlaying(true);
    playNextAyah(surahNumber, 1, totalAyahs);
  };

  const pauseSurah = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSurah = () => {
    if (audioRef.current && playingSurah && playingAyah) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopSurah = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingSurah(null);
    setPlayingAyah(null);
    setIsPlaying(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        playingSurah,
        playingAyah,
        isPlaying,
        playSurah,
        pauseSurah,
        resumeSurah,
        stopSurah,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
