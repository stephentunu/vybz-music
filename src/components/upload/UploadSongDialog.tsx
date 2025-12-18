import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Music, Image, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from '@/hooks/useSessionId';
import { toast } from 'sonner';

const GENRES = [
  'afro', 'bongo flava', 'swahili', 'african', 'reggae', 'gospel', 'rhumba',
  'pop', 'hiphop', 'rock', 'electronic', 'jazz', 'classical', 'r&b',
  'latin', 'blues', 'country', 'indie', 'ambient', 'folk', 'metal'
];

interface UploadSongDialogProps {
  onUploadComplete?: () => void;
}

export const UploadSongDialog = ({ onUploadComplete }: UploadSongDialogProps) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setArtist('');
    setAlbum('');
    setGenre('');
    setAudioFile(null);
    setArtworkFile(null);
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.floor(audio.duration));
      });
      audio.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async () => {
    if (!audioFile || !title.trim() || !artist.trim()) {
      toast.error('Please fill in title, artist and select an audio file');
      return;
    }

    setUploading(true);

    try {
      const sessionId = getSessionId();
      const timestamp = Date.now();
      
      // Upload audio file
      const audioExt = audioFile.name.split('.').pop();
      const audioPath = `${sessionId}/${timestamp}.${audioExt}`;
      
      const { error: audioError } = await supabase.storage
        .from('songs')
        .upload(audioPath, audioFile);

      if (audioError) throw audioError;

      const { data: audioUrlData } = supabase.storage
        .from('songs')
        .getPublicUrl(audioPath);

      // Upload artwork if provided
      let artworkUrl = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop';
      
      if (artworkFile) {
        const artExt = artworkFile.name.split('.').pop();
        const artPath = `${sessionId}/${timestamp}.${artExt}`;
        
        const { error: artError } = await supabase.storage
          .from('artwork')
          .upload(artPath, artworkFile);

        if (!artError) {
          const { data: artUrlData } = supabase.storage
            .from('artwork')
            .getPublicUrl(artPath);
          artworkUrl = artUrlData.publicUrl;
        }
      }

      // Get audio duration
      const duration = await getAudioDuration(audioFile);

      // Insert song record
      const { error: dbError } = await supabase
        .from('uploaded_songs')
        .insert({
          session_id: sessionId,
          title: title.trim(),
          artist: artist.trim(),
          album: album.trim() || 'Single',
          genre: genre || null,
          duration,
          audio_url: audioUrlData.publicUrl,
          album_art_url: artworkUrl
        });

      if (dbError) throw dbError;

      toast.success('Song uploaded successfully!');
      resetForm();
      setOpen(false);
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload song. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Song
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Your Song</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Song title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">Artist *</Label>
            <Input
              id="artist"
              placeholder="Artist name"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              placeholder="Album name (optional)"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label>Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g} className="capitalize">
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Audio File *</Label>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            />
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => audioInputRef.current?.click()}
            >
              <Music className="h-4 w-4" />
              {audioFile ? audioFile.name : 'Choose audio file'}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Album Artwork</Label>
            <input
              ref={artworkInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setArtworkFile(e.target.files?.[0] || null)}
            />
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => artworkInputRef.current?.click()}
            >
              <Image className="h-4 w-4" />
              {artworkFile ? artworkFile.name : 'Choose artwork (optional)'}
            </Button>
          </div>

          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={uploading || !audioFile || !title.trim() || !artist.trim()}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Song
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
