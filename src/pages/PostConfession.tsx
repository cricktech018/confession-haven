import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import MoodSelector from '@/components/confession/MoodSelector';
import TagSelector from '@/components/confession/TagSelector';
import { useCreateConfession } from '@/hooks/useConfessions';
import { MAX_CONFESSION_LENGTH } from '@/lib/constants';

const PostConfession = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');

  const createMutation = useCreateConfession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !mood) return;

    createMutation.mutate(
      {
        text: text.trim(),
        mood,
        tags,
        nickname: nickname.trim() || 'Anonymous',
      },
      {
        onSuccess: () => {
          navigate('/feed');
        },
      }
    );
  };

  const isValid = text.trim().length > 0 && mood;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
            Share Your Confession
          </h1>
          <p className="text-muted-foreground">
            Let it out. No judgments, no names — just your truth.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6 animate-slide-up">
          {/* Confession text */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Your confession
            </label>
            <Textarea
              placeholder="What's on your mind..."
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CONFESSION_LENGTH))}
              className="min-h-[150px] bg-secondary/30 border-border/50 resize-none text-lg"
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              {text.length}/{MAX_CONFESSION_LENGTH}
            </div>
          </div>

          {/* Mood selector */}
          <MoodSelector selected={mood} onSelect={setMood} />

          {/* Tags */}
          <TagSelector selected={tags} onSelect={setTags} />

          {/* Nickname */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Anonymous nickname <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              placeholder="Anonymous"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, 30))}
              className="bg-secondary/30 border-border/50"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={!isValid || createMutation.isPending}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
          >
            <Send className="h-5 w-5" />
            {createMutation.isPending ? 'Sharing...' : 'Share Anonymously'}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default PostConfession;
