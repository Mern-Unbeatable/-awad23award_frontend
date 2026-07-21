import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useSite } from '../../context/SiteContext';

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

  const isHome = current === '/';
  const isServices = current.startsWith('/services');
  const isJournal = current.startsWith('/journal');
  const isGallery = current.startsWith('/gallery');
  const isBook = current.startsWith('/book');
  const isContact = current.startsWith('/contact');

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

  return (
    <header
      data-site-header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300 ${
        open ? 'is-open' : ''
      }`}
    >
      <div className="container-wide flex items-center justify-between py-4 md:py-5">
        <Link
          to={pathFor('/')}
          className="font-display text-lg md:text-xl font-extrabold tracking-wide cursor-pointer hover:opacity-90 transition-opacity"
        >
          {settings.logoUrl && settings.logoUrl.startsWith('http') ? (
            <img src={settings.logoUrl} alt={settings.brandName} className="h-8 w-auto" />
          ) : (
            <span>
              {settings.brandName.split(' ')[0]}
              <span className="text-accent"> {settings.brandName.split(' ').slice(1).join(' ')}</span>
            </span>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link to={pathFor('/')} className={navClass(isHome)}>
            {t('Home', 'الرئيسية')}
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button type="button" className={navClass(isServices)}>
              {t('Services', 'الخدمات')}
              <span className="ms-1 text-[0.65rem] opacity-70">▾</span>
            </button>
            {servicesOpen && (
              <div className="absolute top-full start-0 pt-2 min-w-[250px] z-50">
                <div className="bg-ink-soft border border-cream/15 p-2 shadow-2xl">
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

          <Link to={pathFor('/journal')} className={navClass(isJournal)}>
            {t('Journal', 'المجلة')}
          </Link>
          <Link to={pathFor('/gallery')} className={navClass(isGallery)}>
            {t('Gallery', 'المعرض')}
          </Link>
          <Link to={pathFor('/book')} className={navClass(isBook)}>
            {t('Book a Call', 'احجز مكالمة')}
          </Link>
          <Link to={pathFor('/contact')} className={navClass(isContact)}>
            {t('Contact', 'تواصل')}
          </Link>

          <button
            type="button"
            onClick={toggleLocale}
            className="nav-link nav-lang ms-2"
            aria-label={t('Switch language', 'تبديل اللغة')}
          >
            {locale === 'en' ? 'العربية' : 'EN'}
          </button>

          <Link to={pathFor('/book')} className="btn btn-accent !py-2.5 !px-4 !text-[0.7rem] ms-2">
            {t('Book Call', 'احجز مكالمة')}
          </Link>
        </nav>

        <button
          type="button"
          className="lg:hidden text-cream font-display tracking-widest text-xs uppercase cursor-pointer hover:text-accent transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? t('Close', 'إغلاق') : t('Menu', 'القائمة')}
        </button>
      </div>

      {open && (
        <div
          ref={menuRef}
          className="lg:hidden border-t border-cream/10 bg-ink px-5 pb-8 pt-4 flex flex-col gap-1"
        >
          <Link to={pathFor('/')} onClick={() => setOpen(false)} className={`nav-mobile-link${isHome ? ' is-active' : ''}`}>
            {t('Home', 'الرئيسية')}
          </Link>
          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-cream/40 mt-3 mb-1 px-1">
            {t('Services', 'الخدمات')}
          </p>
          {services.map((s) => {
            const active = current === `/services/${s.slug}`;
            return (
              <Link
                key={s.id}
                to={pathFor(`/services/${s.slug}`)}
                onClick={() => setOpen(false)}
                className={`nav-mobile-link${active ? ' is-active' : ''}`}
              >
                {locale === 'ar' ? s.titleAr : s.titleEn}
              </Link>
            );
          })}
          <Link
            to={pathFor('/journal')}
            onClick={() => setOpen(false)}
            className={`nav-mobile-link${isJournal ? ' is-active' : ''}`}
          >
            {t('Journal', 'المجلة')}
          </Link>
          <Link
            to={pathFor('/gallery')}
            onClick={() => setOpen(false)}
            className={`nav-mobile-link${isGallery ? ' is-active' : ''}`}
          >
            {t('Gallery', 'المعرض')}
          </Link>
          <Link
            to={pathFor('/book')}
            onClick={() => setOpen(false)}
            className={`nav-mobile-link${isBook ? ' is-active' : ''}`}
          >
            {t('Book a Call', 'احجز مكالمة')}
          </Link>
          <Link
            to={pathFor('/contact')}
            onClick={() => setOpen(false)}
            className={`nav-mobile-link${isContact ? ' is-active' : ''}`}
          >
            {t('Contact', 'تواصل')}
          </Link>
          <button
            type="button"
            onClick={toggleLocale}
            className="nav-mobile-link text-accent text-start mt-2"
          >
            {locale === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      )}
    </header>
  );
}
