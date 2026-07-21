import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SmoothScroll } from '../SmoothScroll';

export function PublicLayout() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-ink text-cream">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
