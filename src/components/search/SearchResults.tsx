import { Song } from '@/types/music';
import { Play, Plus, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/data/mockData';

interface SearchResultsProps {
  results: Song[];
  onPlaySong: (song: Song, queue: Song[]) => void;
  onAddToQueue: (song: Song) => void;
  currentSongId?: string;
  isPlaying: boolean;
}

export const SearchResults = ({ 
  results, 
  onPlaySong, 
  onAddToQueue,
  currentSongId,
  isPlaying 
}: SearchResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-16 text-muted-foreground">
        <Music className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-50" />
        <p className="text-base md:text-lg">No results found</p>
        <p className="text-xs md:text-sm">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Header - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider border-b border-border/50">
        <span className="w-10">#</span>
        <span>Title</span>
        <span>Album</span>
        <span>Duration</span>
        <span className="w-20"></span>
      </div>
      
      {results.map((song, index) => {
        const isCurrentSong = song.id === currentSongId;
        
        return (
          <div
            key={song.id}
            className={`group flex md:grid md:grid-cols-[auto_1fr_1fr_auto_auto] items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors hover:bg-surface-2 ${
              isCurrentSong ? 'bg-player-accent/10' : ''
            }`}
          >
            {/* Index/Play indicator - Hidden on mobile */}
            <div className="hidden md:flex w-10 items-center justify-center">
              {isCurrentSong && isPlaying ? (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-4 bg-player-accent rounded-full animate-pulse" />
                  <span className="w-1 h-3 bg-player-accent rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-5 bg-player-accent rounded-full animate-pulse delay-150" />
                </div>
              ) : (
                <span className="text-muted-foreground group-hover:hidden">{index + 1}</span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="hidden group-hover:flex h-8 w-8 text-foreground"
                onClick={() => onPlaySong(song, results)}
              >
                <Play className="w-4 h-4 fill-current" />
              </Button>
            </div>
            
            {/* Album art and title */}
            <div 
              className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
              onClick={() => onPlaySong(song, results)}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={song.albumArt}
                  alt={song.album}
                  className="w-10 h-10 md:w-10 md:h-10 rounded object-cover bg-surface-3"
                />
                {/* Mobile play indicator */}
                <div className="md:hidden absolute inset-0 flex items-center justify-center bg-black/40 rounded opacity-0 group-active:opacity-100">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className={`font-medium text-sm md:text-base truncate ${isCurrentSong ? 'text-player-accent' : 'text-foreground'}`}>
                  {song.title}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>
            </div>
            
            {/* Album - Hidden on mobile */}
            <div className="hidden md:flex items-center">
              <span className="text-sm text-muted-foreground truncate">{song.album}</span>
            </div>
            
            {/* Duration */}
            <div className="flex items-center flex-shrink-0">
              <span className="text-xs md:text-sm text-muted-foreground">{formatDuration(song.duration)}</span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center w-8 md:w-20 justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                onClick={() => onAddToQueue(song)}
                title="Add to queue"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
