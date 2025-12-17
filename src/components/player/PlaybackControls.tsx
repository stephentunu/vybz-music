import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlaybackControlsProps {
  isPlaying: boolean;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  onTogglePlay: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export const PlaybackControls = ({
  isPlaying,
  shuffle,
  repeat,
  onTogglePlay,
  onPlayNext,
  onPlayPrevious,
  onToggleShuffle,
  onToggleRepeat,
}: PlaybackControlsProps) => {
  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-9 w-9 text-muted-foreground hover:text-foreground transition-colors',
          shuffle && 'text-primary hover:text-primary'
        )}
        onClick={onToggleShuffle}
      >
        <Shuffle className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-foreground hover:text-foreground/80 transition-colors hover:scale-105"
        onClick={onPlayPrevious}
      >
        <SkipBack className="h-5 w-5" fill="currentColor" />
      </Button>

      <Button
        size="icon"
        className="h-14 w-14 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all shadow-glow"
        onClick={onTogglePlay}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" fill="currentColor" />
        ) : (
          <Play className="h-6 w-6 ml-1" fill="currentColor" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-foreground hover:text-foreground/80 transition-colors hover:scale-105"
        onClick={onPlayNext}
      >
        <SkipForward className="h-5 w-5" fill="currentColor" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-9 w-9 text-muted-foreground hover:text-foreground transition-colors',
          repeat !== 'off' && 'text-primary hover:text-primary'
        )}
        onClick={onToggleRepeat}
      >
        <RepeatIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
