import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Song, Playlist } from '@/types/music';
import { PlaylistCard } from '@/components/library/PlaylistCard';
import { SongList } from '@/components/library/SongList';
import { mockSongs } from '@/data/mockData';

interface HomeViewProps {
  playlists: Playlist[];
  recentSongs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onPlaylistSelect: (playlist: Playlist) => void;
}

export const HomeView = ({
  playlists,
  recentSongs,
  currentSong,
  isPlaying,
  onPlaySong,
  onPlaylistSelect,
}: HomeViewProps) => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      {/* Greeting */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">{greeting()}</h1>

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
