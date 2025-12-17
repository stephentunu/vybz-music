import { cn } from '@/lib/utils';

interface AlbumArtProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isPlaying?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-48 h-48 md:w-64 md:h-64',
  xl: 'w-72 h-72 md:w-80 md:h-80',
};

export const AlbumArt = ({ src, alt, size = 'md', isPlaying = false, className }: AlbumArtProps) => {
  return (
    <div className={cn('relative group', className)}>
      <div
        className={cn(
          'rounded-lg overflow-hidden shadow-card transition-all duration-500',
          sizeClasses[size],
          isPlaying && size === 'xl' && 'animate-spin-slow rounded-full'
        )}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Glow effect for large sizes */}
      {(size === 'lg' || size === 'xl') && (
        <div
          className={cn(
            'absolute inset-0 -z-10 blur-3xl opacity-40 transition-opacity duration-500',
            isPlaying ? 'opacity-60' : 'opacity-30'
          )}
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            transform: 'scale(1.2)',
          }}
        />
      )}
    </div>
  );
};
