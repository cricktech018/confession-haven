import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ConfessionCard from '@/components/confession/ConfessionCard';
import ConfessionSkeleton from '@/components/confession/ConfessionSkeleton';
import { getSavedConfessions, removeSavedConfession } from '@/lib/storage';
import { supabase } from '@/integrations/supabase/client';
import { Confession } from '@/hooks/useConfessions';

const Saved = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      const savedIds = getSavedConfessions();
      
      if (savedIds.length === 0) {
        setConfessions([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .in('id', savedIds);

      if (!error && data) {
        // Filter out any confessions that no longer exist
        const existingIds = data.map(c => c.id);
        savedIds.forEach(id => {
          if (!existingIds.includes(id)) {
            removeSavedConfession(id);
          }
        });
        setConfessions(data as Confession[]);
      }
      setIsLoading(false);
    };

    fetchSaved();
  }, []);

  const handleRemove = (id: string) => {
    removeSavedConfession(id);
    setConfessions(prev => prev.filter(c => c.id !== id));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-primary fill-primary" />
            Saved Confessions
          </h1>
          <p className="text-muted-foreground">
            Your bookmarked confessions, stored locally on this device.
          </p>
        </div>

        {/* Saved list */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              <ConfessionSkeleton />
              <ConfessionSkeleton />
            </>
          ) : confessions.length > 0 ? (
            confessions.map((confession, index) => (
              <div key={confession.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ConfessionCard
                  confession={confession}
                  showDelete
                  onDelete={handleRemove}
                />
              </div>
            ))
          ) : (
            <div className="glass-card p-12 text-center animate-fade-in">
              <p className="text-4xl mb-4">🔖</p>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No saved confessions
              </h3>
              <p className="text-muted-foreground">
                Tap the bookmark icon on any confession to save it here.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Saved;
