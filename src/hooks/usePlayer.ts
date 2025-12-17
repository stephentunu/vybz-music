import { useState, useCallback, useRef, useEffect } from 'react';
import { Song, PlayerState } from '@/types/music';

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 75,
  progress: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',
  queue: [],
  queueIndex: 0,
};

export const usePlayer = () => {
  const [state, setState] = useState<PlayerState>(initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume / 100;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        progress: audio.currentTime,
        duration: audio.duration || prev.duration,
      }));
    };

    const handleEnded = () => {
      setState(prev => {
        if (prev.repeat === 'one') {
          audio.currentTime = 0;
          audio.play();
          return prev;
        }

        let nextIndex = prev.queueIndex + 1;
        if (nextIndex >= prev.queue.length) {
          if (prev.repeat === 'all') {
            nextIndex = 0;
          } else {
            return { ...prev, isPlaying: false, progress: 0 };
          }
        }

        const nextSong = prev.queue[nextIndex];
        if (nextSong?.audioUrl) {
          audio.src = nextSong.audioUrl;
          audio.play();
        }

        return {
          ...prev,
          currentSong: nextSong,
          queueIndex: nextIndex,
          progress: 0,
          duration: nextSong?.duration || 0,
          isPlaying: true,
        };
      });
    };

    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration,
      }));
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Update volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume / 100;
    }
  }, [state.volume]);

  const play = useCallback(() => {
    if (audioRef.current && state.currentSong?.audioUrl) {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [state.currentSong]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(100, volume)) }));
  }, []);

  const seek = useCallback((progress: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = progress;
      setState(prev => ({ ...prev, progress }));
    }
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
      if (nextSong?.audioUrl && audioRef.current) {
        audioRef.current.src = nextSong.audioUrl;
        audioRef.current.play();
      }

      return {
        ...prev,
        currentSong: nextSong,
        queueIndex: nextIndex,
        progress: 0,
        duration: nextSong?.duration || 0,
        isPlaying: true,
      };
    });
  }, []);

  const playPrevious = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    setState(prev => {
      let prevIndex = prev.queueIndex - 1;
      if (prevIndex < 0) {
        prevIndex = prev.repeat === 'all' ? prev.queue.length - 1 : 0;
      }

      const prevSong = prev.queue[prevIndex];
      if (prevSong?.audioUrl && audioRef.current) {
        audioRef.current.src = prevSong.audioUrl;
        audioRef.current.play();
      }

      return {
        ...prev,
        currentSong: prevSong,
        queueIndex: prevIndex,
        progress: 0,
        duration: prevSong?.duration || 0,
        isPlaying: true,
      };
    });
  }, []);

  const playSong = useCallback((song: Song, queue?: Song[]) => {
    if (audioRef.current && song.audioUrl) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.play();
    }

    setState(prev => {
      const newQueue = queue || prev.queue;
      const index = newQueue.findIndex(s => s.id === song.id);
      
      return {
        ...prev,
        currentSong: song,
        queue: newQueue,
        queueIndex: index >= 0 ? index : 0,
        progress: 0,
        duration: song.duration,
        isPlaying: true,
      };
    });
  }, []);

  const setQueue = useCallback((songs: Song[]) => {
    setState(prev => ({
      ...prev,
      queue: songs,
    }));
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, song],
    }));
  }, []);

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
    setQueue,
    addToQueue,
  };
};
