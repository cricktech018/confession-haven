import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Flag, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { getMoodByValue, getMoodColor, getMoodBgColor } from '@/lib/constants';
import { isConfessionLiked, addLikedConfession, removeLikedConfession, isConfessionSaved, addSavedConfession, removeSavedConfession } from '@/lib/storage';
import { useLikeConfession, useReportConfession, Confession } from '@/hooks/useConfessions';
import CommentSection from './CommentSection';
import { cn } from '@/lib/utils';

interface ConfessionCardProps {
  confession: Confession;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
}

const ConfessionCard = ({ confession, showDelete, onDelete }: ConfessionCardProps) => {
  const [isLiked, setIsLiked] = useState(() => isConfessionLiked(confession.id));
  const [isSaved, setIsSaved] = useState(() => isConfessionSaved(confession.id));
  const [showComments, setShowComments] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(confession.like_count);

  const likeMutation = useLikeConfession();
  const reportMutation = useReportConfession();

  const mood = getMoodByValue(confession.mood);

  const handleLike = () => {
    if (isLiked) {
      removeLikedConfession(confession.id);
      setLocalLikeCount((c) => Math.max(0, c - 1));
      likeMutation.mutate({ id: confession.id, increment: false });
    } else {
      addLikedConfession(confession.id);
      setLocalLikeCount((c) => c + 1);
      likeMutation.mutate({ id: confession.id, increment: true });
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    if (isSaved) {
      removeSavedConfession(confession.id);
    } else {
      addSavedConfession(confession.id);
    }
    setIsSaved(!isSaved);
  };

  const handleReport = () => {
    reportMutation.mutate(confession.id);
  };

  return (
    <div className="glass-card p-5 hover-lift animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-xl', getMoodBgColor(confession.mood))}>
            <span className="text-xl">{mood.emoji}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">
              {confession.nickname || 'Anonymous'}
            </span>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <span className={cn('text-xs font-medium px-2 py-1 rounded-full', getMoodBgColor(confession.mood), getMoodColor(confession.mood))}>
          {mood.label}
        </span>
      </div>

      {/* Content */}
      <p className="text-foreground leading-relaxed mb-4">{confession.text}</p>

      {/* Tags */}
      {confession.tags && confession.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {confession.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border/30">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn('gap-2', isLiked && 'text-mood-love')}
          >
            <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
            <span>{localLikeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className={cn(isSaved && 'text-primary')}
          >
            <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReport}
            className="text-muted-foreground hover:text-destructive"
          >
            <Flag className="h-4 w-4" />
          </Button>
          {showDelete && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(confession.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Comments */}
      {showComments && <CommentSection confessionId={confession.id} />}
    </div>
  );
};

export default ConfessionCard;
