import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useSite } from '../../context/SiteContext';
import { BrandLogo, ConnectButton } from '../tech';
import { X } from 'lucide-react';

function stripLocale(pathname: string) {
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    return pathname.replace(/^\/ar/, '') || '/';
  }
  return pathname;
}

export function Navbar() {
  const { pathFor, locale, toggleLocale, t } = useLocale();
  const { settings, services } = useSite();
  const location = useLocation();
  const current = stripLocale(location.pathname);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAbout = current.startsWith('/about');
  const isServices = current.startsWith('/services');
  const isWork = current.startsWith('/work') || current.startsWith('/gallery');
  const isJournal = current.startsWith('/journal');
  const isContact = current.startsWith('/contact') || current.startsWith('/book');

  useEffect(() => {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;

    let ticking = false;
    const apply = (y: number) => {
      header.classList.toggle('is-scrolled', y > 40);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const lenis = (window as Window & { __lenis?: { scroll: number } }).__lenis;
        apply(lenis?.scroll ?? window.scrollY);
        ticking = false;
      });
    };

    const lenis = (window as Window & {
      __lenis?: { on: (e: string, cb: () => void) => void; off: (e: string, cb: () => void) => void };
    }).__lenis;
    lenis?.on?.('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      lenis?.off?.('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [locale, location.pathname]);

  function navClass(active: boolean) {
    return `nav-link${active ? ' is-active' : ''}`;
  }

  const brandLabel = settings.brandName && !/official/i.test(settings.brandName) ? settings.brandName : 'Ahmed Ibrahim';

  return (
    <header
      data-site-header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300 ${
        open ? 'is-open' : ''
      }`}
    >
      <div className="w-full max-w-360 mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between h-18.5 gap-4">
        <Link to={pathFor('/')} className="ref-brand-link">
          <BrandLogo name={brandLabel} />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          <Link to={pathFor('/about')} className={navClass(isAbout)}>
            {t('About', 'عني')}
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link to={pathFor('/services')} className={navClass(isServices)}>
              {t('Services', 'الخدمات')}
              <span className="ms-1 text-[0.65rem] opacity-70">▾</span>
            </Link>
            {servicesOpen && (
              <div className="absolute top-full inset-s-0 pt-2 min-w-62.5 z-50">
                <div className="nav-dropdown p-2 shadow-2xl">
                  {services.map((s) => {
                    const active = current === `/services/${s.slug}`;
                    return (
                      <Link
                        key={s.id}
                        to={pathFor(`/services/${s.slug}`)}
                        className={`nav-dropdown-link${active ? ' is-active' : ''}`}
                      >
                        {locale === 'ar' ? s.titleAr : s.titleEn}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link to={pathFor('/work')} className={navClass(isWork)}>
            {t('Work', 'الأعمال')}
          </Link>
          <Link to={pathFor('/journal')} className={navClass(isJournal)}>
            {t('Blog', 'مدونة')}
          </Link>
          <Link to={pathFor('/contact')} className={navClass(isContact && !current.startsWith('/book'))}>
            {t('Contact', 'تواصل')}
          </Link>

          <button
            type="button"
            onClick={toggleLocale}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 text-xs text-white font-medium transition-all"
            aria-label={t('Switch language', 'تبديل اللغة')}
          >
            <span>🌐</span>
            <span>{locale === 'en' ? 'English' : 'العربية'}</span>
          </button>

          <ConnectButton
            variant="cyan"
            className="inline-flex! items-center! justify-center! px-5! py-2.5! rounded-lg! bg-[#35BFFB]! hover:bg-[#22aaeb]! text-[#064738]! font-bold! text-xs! md:text-sm! shadow-md shadow-[#35BFFB]/25 transition-all hover:scale-[1.02]"
          >
            {t('Book a Consultation', 'احجز استشارة')}
          </ConnectButton>
        </nav>

        <button
          type="button"
          className="ref-burger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div ref={menuRef} className="fixed inset-0 z-50 bg-[#064738] text-white flex flex-col justify-between p-6 sm:px-10 overflow-y-auto animate-in fade-in duration-200 lg:hidden">
          {/* Header inside Mobile Drawer */}
          <div className="flex items-center justify-between h-14 border-b border-white/15 pb-4">
            <Link to={pathFor('/')} onClick={() => setOpen(false)} className="ref-brand-link">
              <BrandLogo name={brandLabel} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-2 my-auto py-6">
            <Link to={pathFor('/')} onClick={() => setOpen(false)} className="text-xl font-semibold text-white hover:text-[#35BFFB] py-2 border-b border-white/10">
              {t('Home', 'الرئيسية')}
            </Link>
            <Link to={pathFor('/about')} onClick={() => setOpen(false)} className="text-xl font-semibold text-white hover:text-[#35BFFB] py-2 border-b border-white/10">
              {t('About', 'من أنا')}
            </Link>
            <Link to={pathFor('/services')} onClick={() => setOpen(false)} className="text-xl font-semibold text-white hover:text-[#35BFFB] py-2 border-b border-white/10">
              {t('Services', 'الخدمات')}
            </Link>
            {services.map((s) => (
              <Link
                key={s.id}
                to={pathFor(`/services/${s.slug}`)}
                onClick={() => setOpen(false)}
                className="text-base text-white/80 hover:text-[#35BFFB] ps-4 py-1"
              >
                {locale === 'ar' ? s.titleAr : s.titleEn}
              </Link>
            ))}
            <Link to={pathFor('/work')} onClick={() => setOpen(false)} className="text-xl font-semibold text-white hover:text-[#35BFFB] py-2 border-b border-white/10">
              {t('Work', 'الأعمال')}
            </Link>
            <Link to={pathFor('/journal')} onClick={() => setOpen(false)} className="text-xl font-semibold text-white hover:text-[#35BFFB] py-2 border-b border-white/10">
              {t('Insights', 'مقالات')}
            </Link>
            <Link to={pathFor('/contact')} onClick={() => setOpen(false)} className="text-xl font-semibold text-white hover:text-[#35BFFB] py-2 border-b border-white/10">
              {t('Contact', 'تواصل')}
            </Link>
          </nav>

          <div className="flex flex-col gap-3 pt-4 border-t border-white/15">
            <button type="button" onClick={toggleLocale} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/30 text-white font-medium text-base hover:bg-white/10 transition-colors cursor-pointer">
              {locale === 'en' ? 'Switch to العربية' : 'Switch to English'}
            </button>
            <ConnectButton variant="blue" className="w-full justify-center rounded-xl! bg-[#35BFFB]! py-3.5! text-base! font-semibold! text-[#064738]!" fallbackTo="/book">
              {t("Let's Connect", 'تواصل معي')}
            </ConnectButton>
          </div>
        </div>
      )}
    </header>
  );
}
