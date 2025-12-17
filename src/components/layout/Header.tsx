import { Link, useLocation } from 'react-router-dom';
import { Sparkles, TrendingUp, Bookmark, Search, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/feed', label: 'Feed', icon: Sparkles },
    { path: '/trending', label: 'Trending', icon: TrendingUp },
    { path: '/saved', label: 'Saved', icon: Bookmark },
    { path: '/search', label: 'Search', icon: Search },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-display font-bold text-gradient">
            CONFESSLY X
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'gap-2 transition-all',
                  location.pathname === item.path && 'bg-secondary text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <Link to="/post">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            <PenLine className="h-4 w-4" />
            <span className="hidden sm:inline">Confess</span>
          </Button>
        </Link>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex justify-around py-2 border-t border-border/30">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'flex-col h-auto py-2 gap-1',
                location.pathname === item.path && 'text-primary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
