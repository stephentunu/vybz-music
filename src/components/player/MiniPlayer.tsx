import { Play, Pause, SkipBack, SkipForward, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Song } from '@/types/music';
import { AlbumArt } from './AlbumArt';
import { Progress } from '@/components/ui/progress';

interface MiniPlayerProps {
  song: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  onTogglePlay: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
  onExpand: () => void;
}

export const MiniPlayer = ({
  song,
  isPlaying,
  progress,
  duration,
  onTogglePlay,
  onPlayNext,
  onPlayPrevious,
  onExpand,
}: MiniPlayerProps) => {
  if (!song) return null;

  const percentage = (progress / duration) * 100;

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-surface-2 rounded-2xl shadow-soft overflow-hidden animate-slide-in-right z-50">
      {/* Progress bar */}
      <Progress value={percentage} className="h-1 rounded-none" />
      
      <div className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
        {/* Album Art */}
        <AlbumArt src={song.albumArt} alt={song.album} size="md" isPlaying={isPlaying} />

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm md:text-base truncate">{song.title}</h4>
          <p className="text-xs md:text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-0.5 md:gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8"
            onClick={onPlayPrevious}
          >
            <SkipBack className="h-3 w-3 md:h-4 md:w-4" fill="currentColor" />
          </Button>

          <Button
            size="icon"
            className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-foreground text-background"
            onClick={onTogglePlay}
          >
            {isPlaying ? (
              <Pause className="h-3 w-3 md:h-4 md:w-4" fill="currentColor" />
            ) : (
              <Play className="h-3 w-3 md:h-4 md:w-4 ml-0.5" fill="currentColor" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8"
            onClick={onPlayNext}
          >
            <SkipForward className="h-3 w-3 md:h-4 md:w-4" fill="currentColor" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground"
            onClick={onExpand}
          >
            <Maximize2 className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
