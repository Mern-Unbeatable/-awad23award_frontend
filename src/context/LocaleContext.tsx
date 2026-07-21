import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Locale } from '../types';

interface LocaleContextValue {
  locale: Locale;
  isRtl: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  pathFor: (path: string, localeOverride?: Locale) => string;
  t: (en: string, ar: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function stripLocale(pathname: string) {
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    const rest = pathname.replace(/^\/ar/, '') || '/';
    return rest;
  }
  return pathname;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const locale: Locale = location.pathname === '/ar' || location.pathname.startsWith('/ar/')
    ? 'ar'
    : 'en';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('awad_locale', locale);
  }, [locale]);

  const pathFor = useCallback(
    (path: string, localeOverride?: Locale) => {
      let clean = path.startsWith('/') ? path : `/${path}`;
      // Avoid /ar/ar/... if callers pass a localized path
      if (clean === '/ar' || clean.startsWith('/ar/')) {
        clean = clean.replace(/^\/ar/, '') || '/';
      }
      const loc = localeOverride ?? locale;
      if (loc === 'ar') {
        if (clean === '/') return '/ar';
        return `/ar${clean}`;
      }
      return clean;
    },
    [locale]
  );

  const setLocale = useCallback(
    (next: Locale) => {
      const base = stripLocale(location.pathname);
      navigate(pathFor(base, next) + location.search);
    },
    [location.pathname, location.search, navigate, pathFor]
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  }, [locale, setLocale]);

  const t = useCallback((en: string, ar: string) => (locale === 'ar' ? ar : en), [locale]);

  const value = useMemo(
    () => ({
      locale,
      isRtl: locale === 'ar',
      setLocale,
      toggleLocale,
      pathFor,
      t,
    }),
    [locale, setLocale, toggleLocale, pathFor, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
