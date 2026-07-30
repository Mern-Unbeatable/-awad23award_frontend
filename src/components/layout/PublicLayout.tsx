import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
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
  const isHome = stripLocale(pathname) === '/';

  if (isHome) {
    return (
      <SmoothScroll>
        <div className="min-h-screen bg-canvas text-ink">
          <Outlet />
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
