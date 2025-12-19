import { useState, useEffect } from 'react';
import { Song } from '@/types/music';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { searchTracks, getPopularTracks, getTracksByGenre } from '@/services/jamendoApi';
import { Loader2, TrendingUp, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface SearchViewProps {
  onPlaySong: (song: Song, queue: Song[]) => void;
  onAddToQueue: (song: Song) => void;
  currentSongId?: string;
  isPlaying: boolean;
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

export const SearchView = ({ onPlaySong, onAddToQueue, currentSongId, isPlaying }: SearchViewProps) => {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [popularTracks, setPopularTracks] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadPopularTracks = async () => {
      try {
        const tracks = await getPopularTracks(20);
        setPopularTracks(tracks);
      } catch (error) {
        console.error('Failed to load popular tracks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load popular tracks. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingPopular(false);
      }
    };

    loadPopularTracks();
  }, [toast]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setHasSearched(true);
    setSelectedGenre(null);
    
    try {
      const results = await searchTracks(query, 30);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: 'No results',
          description: `No songs found for "${query}"`,
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Search failed',
        description: 'Failed to search tracks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenreClick = async (genre: string) => {
    setIsSearching(true);
    setHasSearched(true);
    setSelectedGenre(genre);
    
    try {
      const results = await getTracksByGenre(genre, 30);
      setSearchResults(results);
    } catch (error) {
      console.error('Genre search failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to load genre tracks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">Search</h1>
          <p className="text-sm md:text-base text-muted-foreground">Enjoy your favorite music from Tunu's App</p>
        </div>

        <div className="mb-6 md:mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {/* Genre buttons - Horizontally scrollable on mobile */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-2 md:mb-3 flex items-center gap-2">
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
                        ? 'bg-player-accent text-player-accent-foreground' 
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
                    ? 'bg-player-accent text-player-accent-foreground' 
                    : 'border-border/50 hover:bg-surface-2'
                }`}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>

        {isSearching ? (
          <div className="flex items-center justify-center py-12 md:py-16">
            <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-player-accent" />
          </div>
        ) : hasSearched ? (
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
              {selectedGenre ? `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Tracks` : 'Search Results'}
            </h2>
            <SearchResults
              results={searchResults}
              onPlaySong={onPlaySong}
              onAddToQueue={onAddToQueue}
              currentSongId={currentSongId}
              isPlaying={isPlaying}
            />
          </div>
        ) : (
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-player-accent" />
              Popular This Week
            </h2>
            {isLoadingPopular ? (
              <div className="flex items-center justify-center py-12 md:py-16">
                <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-player-accent" />
              </div>
            ) : (
              <SearchResults
                results={popularTracks}
                onPlaySong={onPlaySong}
                onAddToQueue={onAddToQueue}
                currentSongId={currentSongId}
                isPlaying={isPlaying}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
