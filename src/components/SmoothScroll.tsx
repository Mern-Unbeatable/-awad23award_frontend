import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

type LenisWindow = Window & { __lenis?: Lenis };

function scrollToTop(lenis?: Lenis | null) {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' } as ScrollToOptions);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/**
 * Smooth page scroll via Lenis.
 * Always starts at top on reload and route change.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    // Stop browser restoring mid-page scroll on reload / back-forward
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    scrollToTop(null);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      scrollToTop(null);
      return;
    }

    const existing = (window as LenisWindow).__lenis;
    if (existing) {
      existing.destroy();
      delete (window as LenisWindow).__lenis;
    }

    const html = document.documentElement;
    html.classList.add('lenis', 'lenis-smooth');

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      syncTouch: false,
      overscroll: true,
    });

    lenisRef.current = lenis;
    (window as LenisWindow).__lenis = lenis;
    scrollToTop(lenis);

    let stRaf = 0;
    const onScroll = () => {
      if (stRaf) return;
      stRaf = requestAnimationFrame(() => {
        ScrollTrigger.update();
        stRaf = 0;
      });
    };
    lenis.on('scroll', onScroll);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize, { passive: true });

    // Reload / bfcache can restore scroll after Lenis boots — force top again
    const onPageShow = () => scrollToTop(lenisRef.current);
    window.addEventListener('pageshow', onPageShow);

    const t1 = window.setTimeout(() => scrollToTop(lenisRef.current), 0);
    const t2 = window.setTimeout(() => {
      scrollToTop(lenisRef.current);
      ScrollTrigger.refresh();
    }, 50);
    const t3 = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pageshow', onPageShow);
      if (stRaf) cancelAnimationFrame(stRaf);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as LenisWindow).__lenis;
      html.classList.remove('lenis', 'lenis-smooth');
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current ?? (window as LenisWindow).__lenis;
    scrollToTop(lenis);
    const id = requestAnimationFrame(() => {
      scrollToTop(lenis);
      ScrollTrigger.refresh();
    });
    const t = window.setTimeout(() => {
      scrollToTop(lenis);
      ScrollTrigger.refresh();
    }, 80);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(t);
    };
  }, [pathname]);

  return <>{children}</>;
}
