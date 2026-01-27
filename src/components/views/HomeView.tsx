import { useState } from 'react';
import { Play, Music2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Song, Playlist } from '@/types/music';
import { PlaylistCard } from '@/components/library/PlaylistCard';
import { SongList } from '@/components/library/SongList';
import { SearchResults } from '@/components/search/SearchResults';
import { CommunityUploads } from '@/components/library/CommunityUploads';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { mockSongs } from '@/data/mockData';
import { getTracksByGenre } from '@/services/jamendoApi';
import { useToast } from '@/hooks/use-toast';

interface HomeViewProps {
  playlists: Playlist[];
  recentSongs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song, queue?: Song[]) => void;
  onAddToQueue?: (song: Song) => void;
  onPlaylistSelect: (playlist: Playlist) => void;
}

const GENRES = [
  'afro', 
  'bongo flava', 
  'swahili',
  'african', 
  'reggae', 
  'gospel',
  'rhumba',
  'pop', 
  'hiphop', 
  'rock', 
  'electronic', 
  'jazz', 
  'r&b', 
  'latin', 
  'folk',
  'blues',
  'country'
];

export const HomeView = ({
  playlists,
  recentSongs,
  currentSong,
  isPlaying,
  onPlaySong,
  onAddToQueue,
  onPlaylistSelect,
}: HomeViewProps) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreTracks, setGenreTracks] = useState<Song[]>([]);
  const [isLoadingGenre, setIsLoadingGenre] = useState(false);
  const { toast } = useToast();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleGenreClick = async (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
      setGenreTracks([]);
      return;
    }
    
    setIsLoadingGenre(true);
    setSelectedGenre(genre);
    
    try {
      const results = await getTracksByGenre(genre, 30);
      setGenreTracks(results);
    } catch (error) {
      console.error('Genre search failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to load genre tracks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingGenre(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      {/* Greeting */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">{greeting()}</h1>

      {/* Genre Buttons Section */}
      <section className="mb-8 md:mb-10">
        <h3 className="text-sm md:text-base font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Music2 className="w-4 h-4" />
          Browse by genre
        </h3>
        
        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {GENRES.map(genre => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleGenreClick(genre)}
                  className={`rounded-full capitalize flex-shrink-0 ${
                    selectedGenre === genre 
                      ? 'bg-primary text-primary-foreground' 
                      : 'border-border/50 hover:bg-surface-2'
                  }`}
                >
                  {genre}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        
        {/* Desktop: Wrap */}
        <div className="hidden md:flex flex-wrap gap-2">
          {GENRES.map(genre => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleGenreClick(genre)}
              className={`rounded-full capitalize ${
                selectedGenre === genre 
                  ? 'bg-primary text-primary-foreground' 
                  : 'border-border/50 hover:bg-surface-2'
              }`}
            >
              {genre}
            </Button>
          ))}
        </div>
      </section>

      {/* Genre Results */}
      {selectedGenre && (
        <section className="mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 capitalize">
            {selectedGenre} Tracks
          </h2>
          {isLoadingGenre ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-primary" />
            </div>
          ) : (
            <SearchResults
              results={genreTracks}
              onPlaySong={(song, queue) => onPlaySong(song, queue)}
              onAddToQueue={onAddToQueue || (() => {})}
              currentSongId={currentSong?.id}
              isPlaying={isPlaying}
            />
          )}
        </section>
      )}

      {/* Community Uploads */}
      <CommunityUploads
        onPlaySong={onPlaySong}
        currentSong={currentSong}
        isPlaying={isPlaying}
      />

      {/* Quick Play Cards */}
      <section className="mb-8 md:mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
          {playlists.slice(0, 6).map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center gap-3 md:gap-4 bg-surface-2 hover:bg-surface-3 rounded-md overflow-hidden cursor-pointer group transition-colors"
              onClick={() => onPlaylistSelect(playlist)}
            >
              <img
                src={playlist.coverArt || mockSongs[0].albumArt}
                alt={playlist.name}
                className="w-12 h-12 md:w-16 md:h-16 object-cover flex-shrink-0"
              />
              <span className="font-medium md:font-semibold text-sm md:text-base flex-1 truncate pr-2">{playlist.name}</span>
              <Button
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary text-primary-foreground shadow-glow opacity-0 group-hover:opacity-100 mr-2 md:mr-4 transition-opacity flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  if (playlist.songs[0]) onPlaySong(playlist.songs[0]);
                }}
              >
                <Play className="h-3 w-3 md:h-4 md:w-4 ml-0.5" fill="currentColor" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section className="mb-8 md:mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Recently Played</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {recentSongs.slice(0, 5).map((song) => (
            <div
              key={song.id}
              className="group p-3 md:p-4 bg-surface-2 rounded-xl hover:bg-surface-3 transition-all duration-300 cursor-pointer"
              onClick={() => onPlaySong(song)}
            >
              <div className="relative mb-3 md:mb-4">
                <img
                  src={song.albumArt}
                  alt={song.album}
                  className="w-full aspect-square object-cover rounded-lg shadow-card"
                />
                <Button
                  size="icon"
                  className="absolute bottom-1 right-1 md:bottom-2 md:right-2 h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary text-primary-foreground shadow-glow opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                >
                  <Play className="h-3 w-3 md:h-4 md:w-4 ml-0.5" fill="currentColor" />
                </Button>
              </div>
              <h3 className="font-medium md:font-semibold text-sm md:text-base truncate">{song.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Made For You */}
      <section className="mb-8 md:mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Made For You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onClick={() => onPlaylistSelect(playlist)}
            />
          ))}
        </div>
      </section>

      {/* All Songs */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">All Songs</h2>
        <div className="bg-surface-2 rounded-xl overflow-hidden">
          <SongList
            songs={recentSongs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlaySong={onPlaySong}
          />
        </div>
      </section>
    </div>
  );
};
