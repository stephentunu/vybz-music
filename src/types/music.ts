export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  albumArt: string;
  genre?: string;
  year?: number;
  playCount?: number;
  liked?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  coverArt?: string;
  createdAt: Date;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  queue: Song[];
  queueIndex: number;
}

export interface EqualizerPreset {
  name: string;
  bands: number[];
}
