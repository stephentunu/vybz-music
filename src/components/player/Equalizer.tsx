import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { equalizerPresets } from '@/data/mockData';
import { cn } from '@/lib/utils';

const frequencies = ['32', '64', '125', '250', '500', '1K', '2K', '4K', '8K', '16K'];

export const Equalizer = () => {
  const [bands, setBands] = useState<number[]>(Array(10).fill(0));
  const [activePreset, setActivePreset] = useState('Flat');

  const handleBandChange = (index: number, value: number) => {
    const newBands = [...bands];
    newBands[index] = value;
    setBands(newBands);
    setActivePreset('Custom');
  };

  const applyPreset = (preset: typeof equalizerPresets[0]) => {
    setBands(preset.bands);
    setActivePreset(preset.name);
  };

  return (
    <div className="bg-surface-2 rounded-xl p-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Equalizer</h3>
      
      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {equalizerPresets.map((preset) => (
          <Button
            key={preset.name}
            variant="ghost"
            size="sm"
            className={cn(
              'text-xs px-3 py-1 h-7 rounded-full transition-all',
              activePreset === preset.name
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface-3 text-muted-foreground hover:text-foreground'
            )}
            onClick={() => applyPreset(preset)}
          >
            {preset.name}
          </Button>
        ))}
      </div>

      {/* Bands */}
      <div className="flex items-end justify-between gap-2 h-40">
        {bands.map((value, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="h-32 flex flex-col justify-center">
              <Slider
                orientation="vertical"
                value={[value + 6]}
                min={0}
                max={12}
                step={0.5}
                onValueChange={(v) => handleBandChange(index, v[0] - 6)}
                className="h-full"
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              {frequencies[index]}
            </span>
          </div>
        ))}
      </div>

      {/* dB Scale */}
      <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
        <span>+6dB</span>
        <span>0dB</span>
        <span>-6dB</span>
      </div>
    </div>
  );
};
