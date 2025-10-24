import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <div className="flex-1 flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 overflow-auto p-4 sm:p-6" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
