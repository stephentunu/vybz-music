import { useState, useCallback, useRef, useEffect } from 'react';
import { Song, PlayerState } from '@/types/music';
import { mockSongs } from '@/data/mockData';

const initialState: PlayerState = {
  currentSong: mockSongs[0],
  isPlaying: false,
  volume: 75,
  progress: 0,
  duration: mockSongs[0].duration,
  shuffle: false,
  repeat: 'off',
  queue: mockSongs,
  queueIndex: 0,
};

export const usePlayer = () => {
  const [state, setState] = useState<PlayerState>(initialState);
  const progressInterval = useRef<number | null>(null);

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(100, volume)) }));
  }, []);

  const seek = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress: Math.max(0, Math.min(prev.duration, progress)) }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => ({
      ...prev,
      repeat: prev.repeat === 'off' ? 'all' : prev.repeat === 'all' ? 'one' : 'off',
    }));
  }, []);

  const playNext = useCallback(() => {
    setState(prev => {
      let nextIndex = prev.queueIndex + 1;
      
      if (prev.shuffle) {
        nextIndex = Math.floor(Math.random() * prev.queue.length);
      } else if (nextIndex >= prev.queue.length) {
        nextIndex = prev.repeat === 'all' ? 0 : prev.queueIndex;
      }

      const nextSong = prev.queue[nextIndex];
      return {
        ...prev,
        currentSong: nextSong,
        queueIndex: nextIndex,
        progress: 0,
        duration: nextSong.duration,
        isPlaying: true,
      };
    });
  }, []);

  const playPrevious = useCallback(() => {
    setState(prev => {
      if (prev.progress > 3) {
        return { ...prev, progress: 0 };
      }

      let prevIndex = prev.queueIndex - 1;
      if (prevIndex < 0) {
        prevIndex = prev.repeat === 'all' ? prev.queue.length - 1 : 0;
      }

      const prevSong = prev.queue[prevIndex];
      return {
        ...prev,
        currentSong: prevSong,
        queueIndex: prevIndex,
        progress: 0,
        duration: prevSong.duration,
        isPlaying: true,
      };
    });
  }, []);

  const playSong = useCallback((song: Song) => {
    setState(prev => {
      const index = prev.queue.findIndex(s => s.id === song.id);
      return {
        ...prev,
        currentSong: song,
        queueIndex: index >= 0 ? index : 0,
        progress: 0,
        duration: song.duration,
        isPlaying: true,
      };
    });
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, song],
    }));
  }, []);

  // Simulate progress
  useEffect(() => {
    if (state.isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setState(prev => {
          if (prev.progress >= prev.duration) {
            if (prev.repeat === 'one') {
              return { ...prev, progress: 0 };
            }
            // Auto play next
            let nextIndex = prev.queueIndex + 1;
            if (nextIndex >= prev.queue.length) {
              if (prev.repeat === 'all') {
                nextIndex = 0;
              } else {
                return { ...prev, isPlaying: false };
              }
            }
            const nextSong = prev.queue[nextIndex];
            return {
              ...prev,
              currentSong: nextSong,
              queueIndex: nextIndex,
              progress: 0,
              duration: nextSong.duration,
            };
          }
          return { ...prev, progress: prev.progress + 0.1 };
        });
      }, 100);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [state.isPlaying]);

  return {
    ...state,
    play,
    pause,
    togglePlay,
    setVolume,
    seek,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious,
    playSong,
    addToQueue,
  };
};
