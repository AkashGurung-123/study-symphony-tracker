
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  LineChart, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: 'Courses', icon: BookOpen },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
    { href: '/progress', label: 'Progress', icon: LineChart },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 w-full border-b border-border/40 flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={toggleMenu}
            className="mr-4 p-2 rounded-full hover:bg-secondary transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-2xl font-semibold tracking-tight">Study Symphony</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "glass-dark fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative",
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full pt-20 md:pt-8 px-4">
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 mb-6 px-3 py-4 rounded-lg bg-black/20 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Exam Countdown</span>
                <span className="text-sm font-semibold">90 days</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main 
          className={cn(
            "flex-1 overflow-y-auto px-6 py-8 transition-all duration-300 ease-in-out",
            isMenuOpen ? "md:ml-0" : "md:ml-0"
          )}
        >
          <div className="max-w-6xl mx-auto animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
