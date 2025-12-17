import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Playlist } from '@/types/music';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: () => void;
}

export const PlaylistCard = ({ playlist, onClick }: PlaylistCardProps) => {
  return (
    <div
      className="group p-4 bg-surface-2 rounded-xl hover:bg-surface-3 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Cover */}
      <div className="relative mb-4">
        <div className="aspect-square rounded-lg overflow-hidden shadow-card">
          {playlist.coverArt ? (
            <img
              src={playlist.coverArt}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-accent flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-foreground">
                {playlist.name[0]}
              </span>
            </div>
          )}
        </div>
        
        {/* Play button */}
        <Button
          size="icon"
          className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-glow opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
        </Button>
      </div>

      {/* Info */}
      <h3 className="font-semibold truncate mb-1">{playlist.name}</h3>
      <p className="text-sm text-muted-foreground truncate">
        {playlist.songs.length} songs
      </p>
    </div>
  );
};
