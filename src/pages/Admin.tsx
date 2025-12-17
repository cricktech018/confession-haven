import { useState } from 'react';
import { Shield, Trash2, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import ConfessionCard from '@/components/confession/ConfessionCard';
import ConfessionSkeleton from '@/components/confession/ConfessionSkeleton';
import { useConfessions, useDeleteConfession } from '@/hooks/useConfessions';
import { cn } from '@/lib/utils';

const ADMIN_PASSWORD = 'confessly2024';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { data: confessions, isLoading } = useConfessions('latest');
  const deleteMutation = useDeleteConfession();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this confession?')) {
      deleteMutation.mutate(id);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20">
          <div className="glass-card p-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Admin Access
            </h1>
            <p className="text-muted-foreground mb-6">
              Enter the admin password to continue.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Enter
              </Button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  // Sort by report count (highest first)
  const sortedConfessions = confessions
    ? [...confessions].sort((a, b) => b.report_count - a.report_count)
    : [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-destructive" />
              Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Manage confessions and moderate content.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Confessions"
            value={confessions?.length || 0}
          />
          <StatCard
            label="Reported"
            value={confessions?.filter(c => c.report_count > 0).length || 0}
            variant="warning"
          />
          <StatCard
            label="Highly Reported"
            value={confessions?.filter(c => c.report_count >= 3).length || 0}
            variant="danger"
          />
          <StatCard
            label="Total Likes"
            value={confessions?.reduce((sum, c) => sum + c.like_count, 0) || 0}
          />
        </div>

        {/* Confessions list */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-foreground">
            All Confessions (sorted by reports)
          </h2>
          {isLoading ? (
            <>
              <ConfessionSkeleton />
              <ConfessionSkeleton />
            </>
          ) : sortedConfessions.length > 0 ? (
            sortedConfessions.map((confession) => (
              <div key={confession.id} className="relative">
                {confession.report_count > 0 && (
                  <div className={cn(
                    'absolute -top-2 -right-2 z-10 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                    confession.report_count >= 3 ? 'bg-destructive text-destructive-foreground' : 'bg-mood-anxious text-primary-foreground'
                  )}>
                    <AlertTriangle className="h-3 w-3" />
                    {confession.report_count} reports
                  </div>
                )}
                <ConfessionCard
                  confession={confession}
                  showDelete
                  onDelete={handleDelete}
                />
              </div>
            ))
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground">No confessions to manage.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  variant?: 'default' | 'warning' | 'danger';
}

const StatCard = ({ label, value, variant = 'default' }: StatCardProps) => (
  <div className="glass-card p-4 animate-fade-in">
    <p className="text-2xl font-display font-bold text-foreground">{value}</p>
    <p className={cn(
      'text-sm',
      variant === 'warning' && 'text-mood-anxious',
      variant === 'danger' && 'text-destructive',
      variant === 'default' && 'text-muted-foreground'
    )}>
      {label}
    </p>
  </div>
);

export default Admin;
