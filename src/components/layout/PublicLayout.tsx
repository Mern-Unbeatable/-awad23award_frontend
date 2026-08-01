import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Nav } from '../site/Nav';
import { Footer } from './Footer';
import { SiteEffects } from './SiteEffects';
import { SmoothScroll } from '../SmoothScroll';
import { HomeNewsletter, TechGridBg } from '../tech';

function stripLocale(pathname: string) {
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    return pathname.replace(/^\/ar/, '') || '/';
  }
  return pathname;
}

export function PublicLayout() {
  const { pathname } = useLocation();
  const currentPath = stripLocale(pathname);
  const isHome = currentPath === '/';
  const isJournalPage = currentPath.startsWith('/journal');
  const isWorkPage = currentPath.startsWith('/work') || currentPath.startsWith('/gallery');

  if (isHome) {
    return (
      <SmoothScroll>
        <div className="min-h-screen bg-canvas text-ink">
          <Outlet />
        </div>
      </SmoothScroll>
    );
  }

  if (isJournalPage || isWorkPage) {
    return (
      <SmoothScroll>
        <div className="min-h-screen bg-white text-ink relative">
          <SiteEffects />
          <Nav dark />
          <main className="w-full">
            <Outlet />
          </main>
        </div>
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-canvas text-ink">
        <SiteEffects />
        <Navbar />
        <main className="inner-page">
          <TechGridBg full />
          <Outlet />
        </main>
        <div className="site-newsletter">
          <div className="ref-wrap">
            <HomeNewsletter />
          </div>
        </div>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
