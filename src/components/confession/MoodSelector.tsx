import { MOODS, getMoodColor, getMoodBgColor } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  selected: string;
  onSelect: (mood: string) => void;
}

const MoodSelector = ({ selected, onSelect }: MoodSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">How are you feeling?</label>
      <div className="grid grid-cols-4 gap-3">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onSelect(mood.value)}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300',
              'border border-border/50 hover:border-primary/50 hover:-translate-y-0.5',
              selected === mood.value
                ? `${getMoodBgColor(mood.value)} border-primary shadow-lg`
                : 'bg-card/50'
            )}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className={cn('text-xs font-medium', getMoodColor(mood.value))}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
