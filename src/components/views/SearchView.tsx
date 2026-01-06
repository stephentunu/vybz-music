import { useState, useEffect } from 'react';
import { Song } from '@/types/music';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResults } from '@/components/search/SearchResults';
import { searchTracks, getPopularTracks } from '@/services/jamendoApi';
import { Loader2, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchViewProps {
  onPlaySong: (song: Song, queue: Song[]) => void;
  onAddToQueue: (song: Song) => void;
  currentSongId?: string;
  isPlaying: boolean;
}

export const SearchView = ({ onPlaySong, onAddToQueue, currentSongId, isPlaying }: SearchViewProps) => {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [popularTracks, setPopularTracks] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
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

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">Search</h1>
          <p className="text-sm md:text-base text-muted-foreground">Find your favorite music from Tunu's App</p>
        </div>

        <div className="mb-6 md:mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {isSearching ? (
          <div className="flex items-center justify-center py-12 md:py-16">
            <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-primary" />
          </div>
        ) : hasSearched ? (
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
              Search Results
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
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Popular This Week
            </h2>
            {isLoadingPopular ? (
              <div className="flex items-center justify-center py-12 md:py-16">
                <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-primary" />
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
