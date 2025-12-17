import { useState } from 'react';
import { Clock, TrendingUp, Flame, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import ConfessionCard from '@/components/confession/ConfessionCard';
import ConfessionSkeleton from '@/components/confession/ConfessionSkeleton';
import { useConfessions, SortOption } from '@/hooks/useConfessions';
import { MOODS, PREDEFINED_TAGS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const Feed = () => {
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [moodFilter, setMoodFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');

  const { data: confessions, isLoading } = useConfessions(sortBy, moodFilter || undefined, tagFilter || undefined);

  const sortOptions = [
    { value: 'latest', label: 'Latest', icon: Clock },
    { value: 'most_liked', label: 'Most Liked', icon: TrendingUp },
    { value: 'trending', label: 'Trending', icon: Flame },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Explore Confessions
          </h1>
          <p className="text-muted-foreground">
            Read anonymous stories from others.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Sort buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => setSortBy(option.value as SortOption)}
                className={cn(
                  'gap-2 whitespace-nowrap',
                  sortBy === option.value && 'bg-secondary text-primary'
                )}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </Button>
            ))}
          </div>

          {/* Dropdowns */}
          <div className="flex gap-3">
            <Select value={moodFilter} onValueChange={setMoodFilter}>
              <SelectTrigger className="w-full bg-secondary/50">
                <SelectValue placeholder="Filter by mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All moods</SelectItem>
                {MOODS.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    {mood.emoji} {mood.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-full bg-secondary/50">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {PREDEFINED_TAGS.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    #{tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear filters */}
          {(moodFilter || tagFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setMoodFilter(''); setTagFilter(''); }}
              className="text-muted-foreground"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Confessions list */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <ConfessionSkeleton />
              <ConfessionSkeleton />
              <ConfessionSkeleton />
            </>
          ) : confessions && confessions.length > 0 ? (
            confessions.map((confession, index) => (
              <div key={confession.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ConfessionCard confession={confession} />
              </div>
            ))
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-4xl mb-4">🤫</p>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No confessions yet
              </h3>
              <p className="text-muted-foreground">
                Be the first to share something anonymously.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Feed;
