import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import ConfessionCard from '@/components/confession/ConfessionCard';
import ConfessionSkeleton from '@/components/confession/ConfessionSkeleton';
import { useConfessions } from '@/hooks/useConfessions';
import { useDebounce } from '@/hooks/useDebounce';

const Search = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data: confessions, isLoading } = useConfessions(
    'latest',
    undefined,
    undefined,
    debouncedQuery || undefined
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Search Confessions
          </h1>
          <p className="text-muted-foreground">
            Find confessions by keywords or tags.
          </p>
        </div>

        {/* Search input */}
        <div className="relative animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by keyword or tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 py-6 text-lg bg-card/60 border-border/50"
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!debouncedQuery ? (
            <div className="glass-card p-12 text-center animate-fade-in">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-muted-foreground">
                Start typing to search confessions...
              </p>
            </div>
          ) : isLoading ? (
            <>
              <ConfessionSkeleton />
              <ConfessionSkeleton />
            </>
          ) : confessions && confessions.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                Found {confessions.length} confession{confessions.length !== 1 ? 's' : ''}
              </p>
              {confessions.map((confession, index) => (
                <div key={confession.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ConfessionCard confession={confession} />
                </div>
              ))}
            </>
          ) : (
            <div className="glass-card p-12 text-center animate-fade-in">
              <p className="text-4xl mb-4">😶</p>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No results found
              </h3>
              <p className="text-muted-foreground">
                Try different keywords or browse the feed.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
