import { Play, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Song } from '@/types/music';
import { formatDuration } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
}

export const SongList = ({ songs, currentSong, isPlaying, onPlaySong }: SongListProps) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border/50">
        <span className="w-8">#</span>
        <span>Title</span>
        <span className="hidden md:block">Album</span>
        <span className="w-8"><Clock className="h-4 w-4" /></span>
        <span className="w-8"></span>
      </div>

      {/* Songs */}
      <div className="divide-y divide-border/30">
        {songs.map((song, index) => {
          const isCurrent = currentSong?.id === song.id;
          
          return (
            <div
              key={song.id}
              className={cn(
                'grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-3 items-center group cursor-pointer transition-colors',
                'hover:bg-surface-hover',
                isCurrent && 'bg-surface-3'
              )}
              onClick={() => onPlaySong(song)}
            >
              {/* Index / Play */}
              <div className="w-8 flex items-center justify-center">
                <span className={cn(
                  'text-sm text-muted-foreground group-hover:hidden',
                  isCurrent && 'text-primary'
                )}>
                  {isCurrent && isPlaying ? (
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-3 bg-primary animate-visualizer" style={{ animationDelay: '0ms' }} />
                      <div className="w-0.5 h-3 bg-primary animate-visualizer" style={{ animationDelay: '150ms' }} />
                      <div className="w-0.5 h-3 bg-primary animate-visualizer" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    index + 1
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hidden group-hover:flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaySong(song);
                  }}
                >
                  <Play className="h-3 w-3" fill="currentColor" />
                </Button>
              </div>

              {/* Title & Artist */}
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <img
                    src={song.albumArt}
                    alt={song.album}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className={cn(
                      'font-medium truncate',
                      isCurrent && 'text-primary'
                    )}>
                      {song.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>
              </div>

              {/* Album */}
              <span className="text-sm text-muted-foreground truncate hidden md:block">
                {song.album}
              </span>

              {/* Duration */}
              <span className="text-sm text-muted-foreground w-8">
                {formatDuration(song.duration)}
              </span>

              {/* Actions */}
              <div className="w-8 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('h-6 w-6', song.liked && 'text-primary')}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="h-3 w-3" fill={song.liked ? 'currentColor' : 'none'} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
