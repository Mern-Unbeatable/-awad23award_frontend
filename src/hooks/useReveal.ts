import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Light scroll-in reveals — once only, no scrub (keeps Lenis smooth) */
export function useReveal<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.querySelectorAll('[data-reveal], [data-reveal-left], [data-reveal-right], [data-reveal-scale]').forEach(
        (node) => {
          (node as HTMLElement).style.opacity = '1';
          (node as HTMLElement).style.transform = 'none';
        }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll('[data-reveal]');
      if (items.length) {
        gsap.fromTo(
          items,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
              toggleActions: 'play none none none',
            },
          }
        );
      }

      el.querySelectorAll('[data-reveal-left]').forEach((node) => {
        gsap.fromTo(
          node,
          { x: -28, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: node, start: 'top 88%', once: true },
          }
        );
      });

      el.querySelectorAll('[data-reveal-right]').forEach((node) => {
        gsap.fromTo(
          node,
          { x: 28, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: node, start: 'top 88%', once: true },
          }
        );
      });

      el.querySelectorAll('[data-reveal-scale]').forEach((node) => {
        gsap.fromTo(
          node,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: { trigger: node, start: 'top 88%', once: true },
          }
        );
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
