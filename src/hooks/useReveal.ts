import { useEffect, useRef } from 'react';

const REVEAL_SELECTOR = '[data-reveal], [data-reveal-scale], [data-reveal-right]';

export function useReveal<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const elements = root.querySelectorAll(REVEAL_SELECTOR);

    elements.forEach((el) => {
      el.classList.add('transition-all', 'duration-700', 'ease-out');
      if (el.hasAttribute('data-reveal')) {
        el.classList.add('opacity-0', 'translate-y-6');
      } else if (el.hasAttribute('data-reveal-scale')) {
        el.classList.add('opacity-0', 'scale-[0.98]');
      } else if (el.hasAttribute('data-reveal-right')) {
        el.classList.add('opacity-0', 'translate-x-6');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.remove('opacity-0', 'translate-y-6', 'translate-x-6', 'scale-[0.98]');
          el.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100');
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, deps);

  return ref;
}
