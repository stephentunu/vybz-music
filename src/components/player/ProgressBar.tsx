import { formatDuration } from '@/data/mockData';
import { Slider } from '@/components/ui/slider';

interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (value: number) => void;
}

export const ProgressBar = ({ progress, duration, onSeek }: ProgressBarProps) => {
  const percentage = (progress / duration) * 100;

  return (
    <div className="w-full flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-10 text-right font-medium">
        {formatDuration(progress)}
      </span>
      
      <div className="flex-1 relative group">
        <Slider
          value={[percentage]}
          max={100}
          step={0.1}
          onValueChange={(value) => onSeek((value[0] / 100) * duration)}
          className="cursor-pointer"
        />
      </div>
      
      <span className="text-xs text-muted-foreground w-10 font-medium">
        {formatDuration(duration)}
      </span>
    </div>
  );
};
