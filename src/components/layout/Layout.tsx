import { ReactNode } from 'react';
import Header from './Header';
import ScrollToTop from '../ui/scroll-to-top';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

const Layout = ({ children, showHeader = true }: LayoutProps) => {
  return (
    <div className="min-h-screen animated-gradient-bg">
      {showHeader && <Header />}
      <main className="container py-6 md:py-10">
        {children}
      </main>
      <ScrollToTop />
    </div>
  );
};

export default Layout;
