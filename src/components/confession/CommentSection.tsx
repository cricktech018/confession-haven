import { useState } from 'react';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useComments, useCreateComment } from '@/hooks/useComments';
import { MAX_COMMENT_LENGTH } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentSectionProps {
  confessionId: string;
}

const CommentSection = ({ confessionId }: CommentSectionProps) => {
  const [text, setText] = useState('');
  const { data: comments, isLoading } = useComments(confessionId);
  const createMutation = useCreateComment();

  const handleSubmit = () => {
    if (text.trim()) {
      createMutation.mutate({ confession_id: confessionId, text: text.trim() });
      setText('');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-border/30 space-y-4">
      {/* Comment input */}
      <div className="flex gap-2">
        <Textarea
          placeholder="Add an anonymous comment..."
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
          className="bg-secondary/50 border-border/30 min-h-[60px] resize-none"
        />
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || createMutation.isPending}
          className="self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground text-right">
        {text.length}/{MAX_COMMENT_LENGTH}
      </div>

      {/* Comments list */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-3 rounded-lg bg-secondary/30 animate-fade-in"
            >
              <p className="text-sm text-foreground">{comment.text}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to respond anonymously.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
