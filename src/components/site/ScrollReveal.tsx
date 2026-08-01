import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top < windowHeight * 0.90 && rect.bottom > 30) {
        setIsVisible(true);
      } else if (rect.top > windowHeight || rect.bottom < -40) {
        setIsVisible(false);
      }
    };

    checkVisibility();

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    const interval = setInterval(checkVisibility, 100);

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: '750ms',
        transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className={`transition-all transform-gpu ${
        isVisible
          ? 'opacity-100 scale-100 blur-0'
          : 'opacity-0 scale-[0.98] blur-[3px]'
      } ${className}`}
    >
      {children}
    </div>
  );
}
