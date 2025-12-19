import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronUp, ChevronDown, Heart, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Song } from '@/types/music';
import { Progress } from '@/components/ui/progress';
import { AlbumArt } from './AlbumArt';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { AudioVisualizer } from './AudioVisualizer';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobilePlayerProps {
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
}

export const MobilePlayer = ({
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
}: MobilePlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!song) return null;

  const percentage = duration > 0 ? (progress / duration) * 100 : 0;

  // Mini player bar (always visible on mobile when song is playing)
  const MiniPlayerBar = (
    <div 
      className="fixed bottom-16 left-0 right-0 z-30 bg-surface-2/95 backdrop-blur-lg border-t border-border md:hidden cursor-pointer"
      onClick={() => setIsOpen(true)}
    >
      <Progress value={percentage} className="h-1 rounded-none" />
      <div className="flex items-center gap-3 p-3">
        <img 
          src={song.albumArt} 
          alt={song.album}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{song.title}</p>
          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={(e) => {
              e.stopPropagation();
              onPlayPrevious();
            }}
          >
            <SkipBack className="h-4 w-4" fill="currentColor" />
          </Button>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" fill="currentColor" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={(e) => {
              e.stopPropagation();
              onPlayNext();
            }}
          >
            <SkipForward className="h-4 w-4" fill="currentColor" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {MiniPlayerBar}
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="bottom" 
          className="h-[90vh] bg-gradient-to-b from-surface-2 to-background border-t border-border rounded-t-3xl p-0"
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>

          <div className="flex flex-col h-full px-6 pb-8">
            {/* Close hint */}
            <button 
              className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-4"
              onClick={() => setIsOpen(false)}
            >
              <ChevronDown className="h-4 w-4" />
              <span>Swipe down to close</span>
            </button>

            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center min-h-0 mb-6">
              <div className="relative w-full max-w-[280px] aspect-square">
                <img
                  src={song.albumArt}
                  alt={song.album}
                  className={cn(
                    "w-full h-full object-cover rounded-2xl shadow-2xl",
                    isPlaying && "animate-pulse-slow"
                  )}
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48">
                  <AudioVisualizer isPlaying={isPlaying} />
                </div>
              </div>
            </div>

            {/* Song Info */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-1">
                <h2 className="text-xl font-bold truncate max-w-[250px]">{song.title}</h2>
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
            </div>

            {/* Progress */}
            <div className="mb-6">
              <ProgressBar
                progress={progress}
                duration={duration}
                onSeek={onSeek}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-10 w-10',
                  shuffle ? 'text-primary' : 'text-muted-foreground'
                )}
                onClick={onToggleShuffle}
              >
                <Shuffle className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12"
                onClick={onPlayPrevious}
              >
                <SkipBack className="h-6 w-6" fill="currentColor" />
              </Button>

              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-glow"
                onClick={onTogglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7" fill="currentColor" />
                ) : (
                  <Play className="h-7 w-7 ml-1" fill="currentColor" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12"
                onClick={onPlayNext}
              >
                <SkipForward className="h-6 w-6" fill="currentColor" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-10 w-10',
                  repeat !== 'off' ? 'text-primary' : 'text-muted-foreground'
                )}
                onClick={onToggleRepeat}
              >
                {repeat === 'one' ? (
                  <Repeat1 className="h-5 w-5" />
                ) : (
                  <Repeat className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-center">
              <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
