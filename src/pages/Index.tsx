import { useState, useEffect } from 'react';
import { Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { QueuePanel } from '@/components/layout/QueuePanel';
import { NowPlaying } from '@/components/player/NowPlaying';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { MobilePlayer } from '@/components/player/MobilePlayer';
import { Equalizer } from '@/components/player/Equalizer';
import { HomeView } from '@/components/views/HomeView';
import { SearchView } from '@/components/views/SearchView';
import { MyUploadsView } from '@/components/views/MyUploadsView';
import { SongList } from '@/components/library/SongList';
import { usePlayer } from '@/hooks/usePlayer';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { mockPlaylists } from '@/data/mockData';
import { getPopularTracks } from '@/services/jamendoApi';
import { Playlist, Song } from '@/types/music';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeView, setActiveView] = useState('home');
  const [showQueue, setShowQueue] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [isMiniMode, setIsMiniMode] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [popularTracks, setPopularTracks] = useState<Song[]>([]);

  const player = usePlayer();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Load popular tracks on mount
  useEffect(() => {
    const loadTracks = async () => {
      try {
        const tracks = await getPopularTracks(20);
        setPopularTracks(tracks);
        player.setQueue(tracks);
      } catch (error) {
        console.error('Failed to load tracks:', error);
      }
    };
    loadTracks();
  }, []);

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setActiveView(`playlist-${playlist.id}`);
  };

  const handlePlaySong = (song: Song, queue?: Song[]) => {
    player.playSong(song, queue);
  };

  const renderMainContent = () => {
    if (activeView === 'search') {
      return (
        <SearchView
          onPlaySong={handlePlaySong}
          onAddToQueue={player.addToQueue}
          currentSongId={player.currentSong?.id}
          isPlaying={player.isPlaying}
        />
      );
    }

    if (activeView === 'my-uploads') {
      return (
        <MyUploadsView
          onPlaySong={handlePlaySong}
          onAddToQueue={player.addToQueue}
          currentSong={player.currentSong}
          isPlaying={player.isPlaying}
        />
      );
    }

    if (activeView === 'home') {
      return (
        <HomeView
          playlists={mockPlaylists}
          recentSongs={popularTracks}
          currentSong={player.currentSong}
          isPlaying={player.isPlaying}
          onPlaySong={(song) => handlePlaySong(song, popularTracks)}
          onPlaylistSelect={handlePlaylistSelect}
        />
      );
    }

    if (activeView === 'library') {
      return (
        <div className="p-4 md:p-8 animate-fade-in">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Your Library</h1>
          <div className="bg-surface-2 rounded-xl overflow-hidden">
            <SongList
              songs={popularTracks}
              currentSong={player.currentSong}
              isPlaying={player.isPlaying}
              onPlaySong={(song) => handlePlaySong(song, popularTracks)}
            />
          </div>
        </div>
      );
    }

    if (activeView === 'liked') {
      const likedSongs = popularTracks.filter((s) => s.liked);
      return (
        <div className="p-4 md:p-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="w-32 h-32 md:w-48 md:h-48 mx-auto md:mx-0 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-glow">
              <span className="text-4xl md:text-6xl">❤️</span>
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider mb-1 md:mb-2">
                Playlist
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">Liked Songs</h1>
              <p className="text-muted-foreground">{likedSongs.length} songs</p>
            </div>
          </div>
          <div className="bg-surface-2 rounded-xl overflow-hidden">
            <SongList
              songs={likedSongs}
              currentSong={player.currentSong}
              isPlaying={player.isPlaying}
              onPlaySong={(song) => handlePlaySong(song, likedSongs)}
            />
          </div>
        </div>
      );
    }

    if (selectedPlaylist) {
      return (
        <div className="p-4 md:p-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 mb-6 md:mb-8">
            <img
              src={selectedPlaylist.coverArt || popularTracks[0]?.albumArt}
              alt={selectedPlaylist.name}
              className="w-32 h-32 md:w-48 md:h-48 mx-auto md:mx-0 rounded-lg object-cover shadow-card"
            />
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider mb-1 md:mb-2">
                Playlist
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">{selectedPlaylist.name}</h1>
              <p className="text-muted-foreground">
                {selectedPlaylist.description} • {selectedPlaylist.songs.length} songs
              </p>
            </div>
          </div>
          <div className="bg-surface-2 rounded-xl overflow-hidden">
            <SongList
              songs={selectedPlaylist.songs}
              currentSong={player.currentSong}
              isPlaying={player.isPlaying}
              onPlaySong={(song) => handlePlaySong(song, selectedPlaylist.songs)}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  // Desktop mini mode
  if (isMiniMode && !isMobile) {
    return (
      <MiniPlayer
        song={player.currentSong}
        isPlaying={player.isPlaying}
        progress={player.progress}
        duration={player.duration}
        onTogglePlay={player.togglePlay}
        onPlayNext={player.playNext}
        onPlayPrevious={player.playPrevious}
        onExpand={() => setIsMiniMode(false)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - hidden on mobile, shown on tablet/desktop */}
      <Sidebar
        playlists={mockPlaylists}
        activeView={activeView}
        onViewChange={setActiveView}
        onPlaylistSelect={handlePlaylistSelect}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Content */}
        <main className={cn(
          "flex-1 overflow-auto",
          // Add padding for mobile menu button and bottom player/nav
          isMobile && "pt-16 pb-36"
        )}>
          {renderMainContent()}
        </main>

        {/* Now Playing Panel - Desktop only */}
        {!isMobile && !isTablet && (
          <div className={cn(
            'w-80 xl:w-96 bg-gradient-player flex flex-col border-l border-border transition-all duration-300',
            'hidden lg:flex'
          )}>
            <div className="flex items-center justify-end p-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => setIsMiniMode(true)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto">
              <NowPlaying
                song={player.currentSong}
                isPlaying={player.isPlaying}
                shuffle={player.shuffle}
                repeat={player.repeat}
                progress={player.progress}
                duration={player.duration}
                volume={player.volume}
                onTogglePlay={player.togglePlay}
                onPlayNext={player.playNext}
                onPlayPrevious={player.playPrevious}
                onToggleShuffle={player.toggleShuffle}
                onToggleRepeat={player.toggleRepeat}
                onSeek={player.seek}
                onVolumeChange={player.setVolume}
                onToggleQueue={() => setShowQueue(!showQueue)}
                onToggleEqualizer={() => setShowEqualizer(!showEqualizer)}
                showEqualizer={showEqualizer}
              />

              {/* Equalizer */}
              {showEqualizer && (
                <div className="px-8 pb-8">
                  <Equalizer />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Queue Panel - Desktop/Tablet */}
        {showQueue && !isMobile && (
          <QueuePanel
            queue={player.queue}
            currentIndex={player.queueIndex}
            currentSong={player.currentSong}
            onPlaySong={(song) => handlePlaySong(song)}
            onClose={() => setShowQueue(false)}
          />
        )}
      </div>

      {/* Mobile Player */}
      {isMobile && (
        <MobilePlayer
          song={player.currentSong}
          isPlaying={player.isPlaying}
          shuffle={player.shuffle}
          repeat={player.repeat}
          progress={player.progress}
          duration={player.duration}
          volume={player.volume}
          onTogglePlay={player.togglePlay}
          onPlayNext={player.playNext}
          onPlayPrevious={player.playPrevious}
          onToggleShuffle={player.toggleShuffle}
          onToggleRepeat={player.toggleRepeat}
          onSeek={player.seek}
          onVolumeChange={player.setVolume}
        />
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNav
          activeView={activeView}
          onViewChange={setActiveView}
        />
      )}
    </div>
  );
};

export default Index;
