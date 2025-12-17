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
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Music className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">No results found</p>
        <p className="text-sm">Try searching for something else</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider border-b border-border/50">
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
            className={`group grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 py-3 rounded-lg transition-colors hover:bg-surface-2 ${
              isCurrentSong ? 'bg-player-accent/10' : ''
            }`}
          >
            <div className="w-10 flex items-center justify-center">
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
            
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={song.albumArt}
                alt={song.album}
                className="w-10 h-10 rounded object-cover bg-surface-3"
              />
              <div className="min-w-0">
                <p className={`font-medium truncate ${isCurrentSong ? 'text-player-accent' : 'text-foreground'}`}>
                  {song.title}
                </p>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground truncate">{song.album}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground">{formatDuration(song.duration)}</span>
            </div>
            
            <div className="flex items-center w-20">
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
