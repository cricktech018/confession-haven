import { TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ConfessionCard from '@/components/confession/ConfessionCard';
import ConfessionSkeleton from '@/components/confession/ConfessionSkeleton';
import { useConfessions, useMoodStats } from '@/hooks/useConfessions';
import { MOODS, getMoodColor, getMoodBgColor } from '@/lib/constants';
import { cn } from '@/lib/utils';

const Trending = () => {
  const { data: confessions, isLoading: confessionsLoading } = useConfessions('trending');
  const { data: stats, isLoading: statsLoading } = useMoodStats();

  const getMoodPercentage = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const todayTotal = stats ? Object.values(stats.todayStats).reduce((a, b) => a + b, 0) : 0;
  const weekTotal = stats ? Object.values(stats.weekStats).reduce((a, b) => a + b, 0) : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Trending & Moods
          </h1>
          <p className="text-muted-foreground">
            See what emotions are flowing through the community.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Today's Moods */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Today's Emotions
            </h2>
            {statsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-secondary/50 rounded animate-pulse" />
                ))}
              </div>
            ) : todayTotal > 0 ? (
              <div className="space-y-3">
                {MOODS.map((mood) => {
                  const count = stats?.todayStats[mood.value] || 0;
                  const percentage = getMoodPercentage(count, todayTotal);
                  return (
                    <div key={mood.value} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={cn(getMoodColor(mood.value))}>
                          {mood.emoji} {mood.label}
                        </span>
                        <span className="text-muted-foreground">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', getMoodBgColor(mood.value))}
                          style={{ width: `${percentage}%`, backgroundColor: `hsl(var(--${mood.color}))` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No confessions today yet.
              </p>
            )}
          </div>

          {/* Weekly Moods */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              This Week's Emotions
            </h2>
            {statsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-secondary/50 rounded animate-pulse" />
                ))}
              </div>
            ) : weekTotal > 0 ? (
              <div className="space-y-3">
                {MOODS.map((mood) => {
                  const count = stats?.weekStats[mood.value] || 0;
                  const percentage = getMoodPercentage(count, weekTotal);
                  return (
                    <div key={mood.value} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={cn(getMoodColor(mood.value))}>
                          {mood.emoji} {mood.label}
                        </span>
                        <span className="text-muted-foreground">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', getMoodBgColor(mood.value))}
                          style={{ width: `${percentage}%`, backgroundColor: `hsl(var(--${mood.color}))` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No confessions this week yet.
              </p>
            )}
          </div>
        </div>

        {/* Trending Confessions */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">
            🔥 Trending Confessions
          </h2>
          {confessionsLoading ? (
            <>
              <ConfessionSkeleton />
              <ConfessionSkeleton />
            </>
          ) : confessions && confessions.length > 0 ? (
            confessions.slice(0, 10).map((confession, index) => (
              <div key={confession.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ConfessionCard confession={confession} />
              </div>
            ))
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-4xl mb-4">📊</p>
              <p className="text-muted-foreground">No trending confessions yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Trending;
