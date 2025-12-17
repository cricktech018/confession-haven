import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen animated-gradient-bg overflow-hidden">
      {/* Hero Section */}
      <div className="container relative py-20 md:py-32">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight animate-fade-in">
            <span className="text-gradient">CONFESSLY X</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Unsaid words live here.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/post">
              <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-lg px-8 py-6">
                Post a Confession
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/feed">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-lg px-8 py-6 border-border/50 hover:bg-secondary">
                <Sparkles className="h-5 w-5" />
                Explore Feed
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 mt-24 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto stagger-children">
          <FeatureCard
            icon={Shield}
            title="Anonymous Posting"
            description="Share your thoughts freely without revealing your identity"
          />
          <FeatureCard
            icon={Heart}
            title="Mood Discovery"
            description="Explore confessions by emotions and connect through feelings"
          />
          <FeatureCard
            icon={Users}
            title="No Account Required"
            description="Jump right in — no signup, no login, just pure expression"
          />
        </div>

        {/* Floating emojis */}
        <div className="absolute top-1/4 left-1/4 text-4xl animate-float opacity-30">😔</div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-float opacity-30" style={{ animationDelay: '0.5s' }}>❤️</div>
        <div className="absolute bottom-1/3 left-1/3 text-4xl animate-float opacity-30" style={{ animationDelay: '1s' }}>😌</div>
        <div className="absolute bottom-1/4 right-1/3 text-4xl animate-float opacity-30" style={{ animationDelay: '1.5s' }}>😤</div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="glass-card p-6 hover-lift group">
    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Index;
