import { X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Song } from '@/types/music';
import { formatDuration } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface QueuePanelProps {
  queue: Song[];
  currentIndex: number;
  currentSong: Song | null;
  onPlaySong: (song: Song) => void;
  onClose: () => void;
}

export const QueuePanel = ({ queue, currentIndex, currentSong, onPlaySong, onClose }: QueuePanelProps) => {
  const upNext = queue.slice(currentIndex + 1);

  return (
    <div className="w-80 bg-surface-2 h-full flex flex-col border-l border-border animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Queue</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Now Playing */}
          {currentSong && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Now Playing</h4>
              <div className="flex items-center gap-3 p-2 bg-surface-3 rounded-lg">
                <img
                  src={currentSong.albumArt}
                  alt={currentSong.album}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary truncate">{currentSong.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
                </div>
              </div>
            </div>
          )}

          {/* Up Next */}
          {upNext.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Next in Queue ({upNext.length})
              </h4>
              <div className="space-y-1">
                {upNext.map((song, index) => (
                  <div
                    key={`${song.id}-${index}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-3 cursor-pointer group transition-colors"
                    onClick={() => onPlaySong(song)}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
                    <img
                      src={song.albumArt}
                      alt={song.album}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(song.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {upNext.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No more tracks in queue
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
