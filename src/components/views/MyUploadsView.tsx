import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionId } from '@/hooks/useSessionId';
import { UploadSongDialog } from '@/components/upload/UploadSongDialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Trash2, Music, Loader2 } from 'lucide-react';
import { Song } from '@/types/music';
import { toast } from 'sonner';

interface MyUploadsViewProps {
  onPlaySong: (song: Song, queue: Song[]) => void;
  onAddToQueue: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

export const MyUploadsView = ({ onPlaySong, onAddToQueue, currentSong, isPlaying }: MyUploadsViewProps) => {
  const sessionId = useSessionId();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('uploaded_songs')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

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
      console.error('Error fetching songs:', error);
      toast.error('Failed to load your songs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSongs();
    }
  }, [sessionId]);

  const handleDelete = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('uploaded_songs')
        .delete()
        .eq('id', songId)
        .eq('session_id', sessionId);

      if (error) throw error;

      setSongs(songs.filter(s => s.id !== songId));
      toast.success('Song deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete song');
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Uploads</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Your personal music collection</p>
        </div>
        <UploadSongDialog onUploadComplete={fetchSongs} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 md:py-20">
          <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
        </div>
      ) : songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-4">
          <Music className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-4" />
          <h2 className="text-lg md:text-xl font-semibold mb-2">No uploads yet</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4">Upload your first song to start your collection</p>
          <UploadSongDialog onUploadComplete={fetchSongs} />
        </div>
      ) : (
        <div className="space-y-1 md:space-y-2">
          {songs.map((song, index) => {
            const isCurrentSong = currentSong?.id === song.id;
            
            return (
              <div
                key={song.id}
                className={`flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg hover:bg-accent/50 transition-colors group ${
                  isCurrentSong ? 'bg-accent' : ''
                }`}
              >
                {/* Album art with play button */}
                <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                  <img
                    src={song.albumArt}
                    alt={song.album}
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute inset-0 m-auto w-6 h-6 md:w-8 md:h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onPlaySong(song, songs)}
                  >
                    {isCurrentSong && isPlaying ? (
                      <Pause className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <Play className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                  </Button>
                </div>

                {/* Song info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm md:text-base truncate ${isCurrentSong ? 'text-primary' : ''}`}>
                    {song.title}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{song.artist}</p>
                </div>

                {/* Album - hidden on mobile */}
                <div className="hidden md:block text-sm text-muted-foreground truncate max-w-[150px]">
                  {song.album}
                </div>

                {/* Duration */}
                <div className="text-xs md:text-sm text-muted-foreground flex-shrink-0">
                  {formatDuration(song.duration)}
                </div>

                {/* Delete button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive flex-shrink-0"
                  onClick={() => handleDelete(song.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
