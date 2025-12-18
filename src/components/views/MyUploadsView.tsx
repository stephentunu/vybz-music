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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Uploads</h1>
          <p className="text-muted-foreground mt-1">Your personal music collection</p>
        </div>
        <UploadSongDialog onUploadComplete={fetchSongs} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Music className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No uploads yet</h2>
          <p className="text-muted-foreground mb-4">Upload your first song to start your collection</p>
          <UploadSongDialog onUploadComplete={fetchSongs} />
        </div>
      ) : (
        <div className="space-y-2">
          {songs.map((song, index) => {
            const isCurrentSong = currentSong?.id === song.id;
            
            return (
              <div
                key={song.id}
                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group ${
                  isCurrentSong ? 'bg-accent' : ''
                }`}
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <img
                    src={song.albumArt}
                    alt={song.album}
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute inset-0 m-auto w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onPlaySong(song, songs)}
                  >
                    {isCurrentSong && isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isCurrentSong ? 'text-primary' : ''}`}>
                    {song.title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                </div>

                <div className="hidden md:block text-sm text-muted-foreground">
                  {song.album}
                </div>

                <div className="text-sm text-muted-foreground">
                  {formatDuration(song.duration)}
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
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
