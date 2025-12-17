import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { PREDEFINED_TAGS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TagSelectorProps {
  selected: string[];
  onSelect: (tags: string[]) => void;
}

const TagSelector = ({ selected, onSelect }: TagSelectorProps) => {
  const [customTag, setCustomTag] = useState('');

  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onSelect(selected.filter((t) => t !== tag));
    } else if (selected.length < 5) {
      onSelect([...selected, tag]);
    }
  };

  const addCustomTag = () => {
    const tag = customTag.trim().toLowerCase();
    if (tag && !selected.includes(tag) && selected.length < 5) {
      onSelect([...selected, tag]);
      setCustomTag('');
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Add tags <span className="text-muted-foreground">(max 5)</span>
      </label>
      
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm transition-all duration-200',
              'border border-border/50 hover:border-primary/50',
              selected.includes(tag)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card/50 text-muted-foreground hover:text-foreground'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add custom tag..."
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
          className="bg-card/50 border-border/50"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addCustomTag}
          disabled={!customTag.trim() || selected.length >= 5}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                className="hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
