import { Home, Search, Library, Heart, PlusCircle, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Playlist } from '@/types/music';
import { cn } from '@/lib/utils';

interface SidebarProps {
  playlists: Playlist[];
  activeView: string;
  onViewChange: (view: string) => void;
  onPlaylistSelect: (playlist: Playlist) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'library', icon: Library, label: 'Your Library' },
];

export const Sidebar = ({ playlists, activeView, onViewChange, onPlaylistSelect }: SidebarProps) => {
  return (
    <aside className="w-64 bg-sidebar h-full flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
            <Music2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Harmony</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="px-3 mb-6">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 mb-1 text-muted-foreground hover:text-foreground',
              activeView === item.id && 'bg-sidebar-accent text-foreground'
            )}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Playlists Section */}
      <div className="flex-1 flex flex-col min-h-0 px-3">
        <div className="flex items-center justify-between mb-4 px-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Playlists
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>

        {/* Liked Songs */}
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 mb-2 text-muted-foreground hover:text-foreground',
            activeView === 'liked' && 'bg-sidebar-accent text-foreground'
          )}
          onClick={() => onViewChange('liked')}
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Heart className="h-4 w-4 text-white" fill="currentColor" />
          </div>
          <span>Liked Songs</span>
        </Button>

        {/* Playlist List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 pr-3">
            {playlists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 text-muted-foreground hover:text-foreground',
                  activeView === `playlist-${playlist.id}` && 'bg-sidebar-accent text-foreground'
                )}
                onClick={() => {
                  onViewChange(`playlist-${playlist.id}`);
                  onPlaylistSelect(playlist);
                }}
              >
                <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                  {playlist.coverArt ? (
                    <img
                      src={playlist.coverArt}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-3 flex items-center justify-center">
                      <Music2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <span className="truncate">{playlist.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
          <span className="text-sm font-medium">User</span>
        </div>
      </div>
    </aside>
  );
};
