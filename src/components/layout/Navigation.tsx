import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { tools } from '../../config/tools';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/theme-toggle';

export default function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const visibleTools = tools; // Show all tools - no authentication required

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border rounded-md shadow-lg touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Navigation Sidebar */}
      <nav
        className={cn(
          'w-64 sm:w-72 bg-card border-r min-h-screen p-4 transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static fixed top-0 left-0 z-40 overflow-y-auto',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Main navigation"
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 gap-2">
            <h1 className="text-lg sm:text-xl font-bold truncate">ToolitHub</h1>
            <ThemeToggle size="sm" />
          </div>
        </div>

        <div className="space-y-1" role="list">
          {visibleTools.map((tool) => {
            const isActive = location.pathname === tool.path;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors touch-manipulation',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                )}
                role="listitem"
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-lg" aria-hidden="true">{tool.icon}</span>
                <span>{tool.name}</span>
              </Link>
            );
          })}
        </div>


      </nav>
    </>
  );
}
