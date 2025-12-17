import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioVisualizer = ({ isPlaying, className }: AudioVisualizerProps) => {
  const [bars, setBars] = useState<number[]>(Array(32).fill(0));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(32).fill(8));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className={cn('flex items-end justify-center gap-[2px] h-16', className)}>
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 rounded-full bg-gradient-to-t from-primary/60 to-primary transition-all duration-100"
          style={{
            height: `${Math.max(8, height)}%`,
            opacity: isPlaying ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
};
