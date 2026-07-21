import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useSite } from '../../context/SiteContext';
import { ArrowIcon, BrandLogo, ConnectButton } from '../tech';

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

  const brandLabel =
    /official/i.test(settings.brandName) || !settings.brandName.trim()
      ? 'AHMED AWAD'
      : settings.brandName.toUpperCase();

  return (
    <header
      data-site-header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300 ${
        open ? 'is-open' : ''
      }`}
    >
      <div className="ref-wrap container-wide flex items-center justify-between h-[74px] gap-4">
        <Link to={pathFor('/')} className="ref-brand-link">
          <BrandLogo name={brandLabel} />
        </Link>

        <nav className="hidden lg:flex items-center gap-[30px]">
          <Link to={pathFor('/')} className={navClass(isHome)}>
            {t('Home', 'الرئيسية')}
          </Link>
          <Link to={pathFor('/about')} className={navClass(isAbout)}>
            {t('About', 'من أنا')}
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
              <div className="absolute top-full start-0 pt-2 min-w-[250px] z-50">
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
            {t('Insights', 'مقالات')}
          </Link>
          <Link to={pathFor('/contact')} className={navClass(isContact && !current.startsWith('/book'))}>
            {t('Contact', 'تواصل')}
          </Link>

          <button
            type="button"
            onClick={toggleLocale}
            className="ref-lang-btn"
            aria-label={t('Switch language', 'تبديل اللغة')}
          >
            {locale === 'en' ? 'العربية' : 'English'}
          </button>

          <ConnectButton variant="blue" className="!py-3 !px-[22px] !text-sm">
            {t("Let's Connect", 'تواصل معي')}
            <ArrowIcon />
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
        <div ref={menuRef} className="ref-mobile-menu open lg:hidden">
          <Link to={pathFor('/')} onClick={() => setOpen(false)} className={navClass(isHome)}>
            {t('Home', 'الرئيسية')}
          </Link>
          <Link to={pathFor('/about')} onClick={() => setOpen(false)} className={navClass(isAbout)}>
            {t('About', 'من أنا')}
          </Link>
          <Link to={pathFor('/services')} onClick={() => setOpen(false)} className={navClass(isServices)}>
            {t('Services', 'الخدمات')}
          </Link>
          {services.map((s) => (
            <Link
              key={s.id}
              to={pathFor(`/services/${s.slug}`)}
              onClick={() => setOpen(false)}
              className={`nav-mobile-link ps-6${current === `/services/${s.slug}` ? ' is-active' : ''}`}
            >
              {locale === 'ar' ? s.titleAr : s.titleEn}
            </Link>
          ))}
          <Link to={pathFor('/work')} onClick={() => setOpen(false)} className={navClass(isWork)}>
            {t('Work', 'الأعمال')}
          </Link>
          <Link to={pathFor('/journal')} onClick={() => setOpen(false)} className={navClass(isJournal)}>
            {t('Insights', 'مقالات')}
          </Link>
          <Link to={pathFor('/contact')} onClick={() => setOpen(false)} className={navClass(isContact)}>
            {t('Contact', 'تواصل')}
          </Link>
          <div className="mt-4">
            <ConnectButton variant="blue" className="w-full" fallbackTo="/book">
              {t("Let's Connect", 'تواصل معي')}
            </ConnectButton>
          </div>
          <button type="button" onClick={toggleLocale} className="ref-lang-btn mt-3 w-full">
            {locale === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      )}
    </header>
  );
}
