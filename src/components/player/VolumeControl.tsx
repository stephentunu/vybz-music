import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  const [previousVolume, setPreviousVolume] = useState(75);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 33 ? Volume : volume < 66 ? Volume1 : Volume2;

  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      onVolumeChange(0);
    } else {
      onVolumeChange(previousVolume);
    }
  };

  return (
    <div className="flex items-center gap-2 group">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
        onClick={toggleMute}
      >
        <VolumeIcon className="h-4 w-4" />
      </Button>
      
      <div className="w-24 opacity-70 group-hover:opacity-100 transition-opacity">
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={(value) => onVolumeChange(value[0])}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};
