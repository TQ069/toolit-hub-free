import { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { tools } from './config/tools';
import { useThemeStore } from './store/themeStore';
import LoadingSpinner from './components/ui/LoadingSpinner';
import InstallPWA from './components/InstallPWA';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { performanceMonitor, logPerformanceMetrics } from './utils/performance';

function App() {
  const theme = useThemeStore((state) => state.theme);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    // Initialize performance monitoring
    if (import.meta.env.DEV) {
      performanceMonitor.observeWebVitals();
      
      // Log performance metrics after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          logPerformanceMetrics();
        }, 1000);
      });
    }
  }, []);

  useEffect(() => {
    // Apply theme class to document root
    const root = document.documentElement;
    root.setAttribute('lang', 'en');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>
      
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 text-sm z-50">
          You are currently offline. Some features may be unavailable.
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {tools.map((tool) => (
            <Route
              key={tool.id}
              path={tool.path}
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <tool.component />
                </Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
      
      {/* PWA Install Prompt */}
      <InstallPWA />
    </BrowserRouter>
  );
}

export default App;
