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

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-ink text-cream">
        <SiteEffects />
        <Navbar />
        <main className={isHome ? undefined : 'inner-page'}>
          {!isHome ? <TechGridBg full /> : null}
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
