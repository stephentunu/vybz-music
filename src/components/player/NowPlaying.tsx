import { Heart, MoreHorizontal, ListMusic, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Song } from '@/types/music';
import { AlbumArt } from './AlbumArt';
import { PlaybackControls } from './PlaybackControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { AudioVisualizer } from './AudioVisualizer';
import { cn } from '@/lib/utils';

interface NowPlayingProps {
  song: Song | null;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  progress: number;
  duration: number;
  volume: number;
  onTogglePlay: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSeek: (value: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleQueue: () => void;
  onToggleEqualizer: () => void;
  showEqualizer: boolean;
}

export const NowPlaying = ({
  song,
  isPlaying,
  shuffle,
  repeat,
  progress,
  duration,
  volume,
  onTogglePlay,
  onPlayNext,
  onPlayPrevious,
  onToggleShuffle,
  onToggleRepeat,
  onSeek,
  onVolumeChange,
  onToggleQueue,
  onToggleEqualizer,
  showEqualizer,
}: NowPlayingProps) => {
  if (!song) return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full">
      {/* Album Art with Visualizer */}
      <div className="relative mb-8">
        <AlbumArt
          src={song.albumArt}
          alt={song.album}
          size="xl"
          isPlaying={isPlaying}
        />
        
        {/* Visualizer overlay */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64">
          <AudioVisualizer isPlaying={isPlaying} />
        </div>
      </div>

      {/* Song Info */}
      <div className="text-center mb-6 max-w-md">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-2xl font-bold truncate">{song.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8 flex-shrink-0',
              song.liked ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Heart className="h-5 w-5" fill={song.liked ? 'currentColor' : 'none'} />
          </Button>
        </div>
        <p className="text-muted-foreground">{song.artist}</p>
        <p className="text-sm text-muted-foreground/70">{song.album}</p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-lg mb-6">
        <ProgressBar
          progress={progress}
          duration={duration}
          onSeek={onSeek}
        />
      </div>

      {/* Controls */}
      <div className="mb-6">
        <PlaybackControls
          isPlaying={isPlaying}
          shuffle={shuffle}
          repeat={repeat}
          onTogglePlay={onTogglePlay}
          onPlayNext={onPlayNext}
          onPlayPrevious={onPlayPrevious}
          onToggleShuffle={onToggleShuffle}
          onToggleRepeat={onToggleRepeat}
        />
      </div>

      {/* Volume and Extra Controls */}
      <div className="flex items-center justify-between w-full max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8 text-muted-foreground hover:text-foreground',
            showEqualizer && 'text-primary'
          )}
          onClick={onToggleEqualizer}
        >
          <Sliders className="h-4 w-4" />
        </Button>

        <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onToggleQueue}
        >
          <ListMusic className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
