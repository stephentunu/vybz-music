import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Song } from '@/types/music';
import { Play, Pause, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CommunityUploadsProps {
  onPlaySong: (song: Song, queue: Song[]) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

export const CommunityUploads = ({ onPlaySong, currentSong, isPlaying }: CommunityUploadsProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityUploads = async () => {
      try {
        const { data, error } = await supabase
          .from('uploaded_songs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        const mappedSongs: Song[] = (data || []).map((song) => ({
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album || 'Single',
          duration: song.duration || 0,
          albumArt: song.album_art_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
          audioUrl: song.audio_url,
          liked: false,
          genre: song.genre || ''
        }));

        setSongs(mappedSongs);
      } catch (error) {
        console.error('Error fetching community uploads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityUploads();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('community-uploads')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'uploaded_songs'
        },
        () => {
          fetchCommunityUploads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (songs.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 md:mb-10">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-xl md:text-2xl font-bold">Community Uploads</h2>
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
          {songs.length} tracks
        </span>
      </div>
      
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-2">
            {songs.map((song) => {
              const isCurrentSong = currentSong?.id === song.id;
              
              return (
                <div
                  key={song.id}
                  className="group w-36 flex-shrink-0 p-3 bg-surface-2 rounded-xl hover:bg-surface-3 transition-all duration-300 cursor-pointer"
                  onClick={() => onPlaySong(song, songs)}
                >
                  <div className="relative mb-3">
                    <img
                      src={song.albumArt}
                      alt={song.album}
                      className="w-full aspect-square object-cover rounded-lg shadow-card"
                    />
                    <Button
                      size="icon"
                      className={`absolute bottom-1 right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-glow transition-all ${
                        isCurrentSong ? 'opacity-100' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                      }`}
                    >
                      {isCurrentSong && isPlaying ? (
                        <Pause className="h-3 w-3" fill="currentColor" />
                      ) : (
                        <Play className="h-3 w-3 ml-0.5" fill="currentColor" />
                      )}
                    </Button>
                  </div>
                  <h3 className={`font-medium text-sm truncate ${isCurrentSong ? 'text-primary' : ''}`}>
                    {song.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {songs.slice(0, 10).map((song) => {
          const isCurrentSong = currentSong?.id === song.id;
          
          return (
            <div
              key={song.id}
              className="group p-3 md:p-4 bg-surface-2 rounded-xl hover:bg-surface-3 transition-all duration-300 cursor-pointer"
              onClick={() => onPlaySong(song, songs)}
            >
              <div className="relative mb-3 md:mb-4">
                <img
                  src={song.albumArt}
                  alt={song.album}
                  className="w-full aspect-square object-cover rounded-lg shadow-card"
                />
                <Button
                  size="icon"
                  className={`absolute bottom-1 right-1 md:bottom-2 md:right-2 h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary text-primary-foreground shadow-glow transition-all ${
                    isCurrentSong ? 'opacity-100' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                  }`}
                >
                  {isCurrentSong && isPlaying ? (
                    <Pause className="h-3 w-3 md:h-4 md:w-4" fill="currentColor" />
                  ) : (
                    <Play className="h-3 w-3 md:h-4 md:w-4 ml-0.5" fill="currentColor" />
                  )}
                </Button>
              </div>
              <h3 className={`font-medium md:font-semibold text-sm md:text-base truncate ${isCurrentSong ? 'text-primary' : ''}`}>
                {song.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground truncate">{song.artist}</p>
              {song.genre && (
                <span className="inline-block mt-1 text-[10px] bg-accent/50 text-accent-foreground px-1.5 py-0.5 rounded capitalize">
                  {song.genre}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
