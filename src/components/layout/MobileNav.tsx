import { Home, Search, Library, Upload, Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'my-uploads', icon: Upload, label: 'Uploads' },
  { id: 'library', icon: Library, label: 'Library' },
];

export const MobileNav = ({ activeView, onViewChange }: MobileNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-2/95 backdrop-blur-lg border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors',
              activeView === item.id 
                ? 'text-primary' 
                : 'text-muted-foreground'
            )}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
