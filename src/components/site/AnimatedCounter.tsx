import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatCommas?: boolean;
  className?: string;
  enableWave?: boolean;
  baseDelay?: number;
  isRtl?: boolean;
}

// Converts Western digits to Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩)
function toArabicNumerals(str: string): string {
  return str.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  formatCommas = false,
  className = '',
  enableWave = true,
  baseDelay = 0,
  isRtl = false,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          let startTime: number | null = null;
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Smooth ease-out cubic curve
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easedProgress * end);

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, duration]);

  const formattedNumber = formatCommas
    ? count.toLocaleString(isRtl ? 'ar-SA' : 'en-US')
    : isRtl
      ? toArabicNumerals(count.toString())
      : count.toString();

  const fullText = `${prefix}${formattedNumber}${suffix}`;

  const chars = fullText.split('');

  return (
    <span ref={ref} dir="ltr" className={`inline-block unicode-bidi-isolate ${className}`}>
      {enableWave
        ? chars.map((char, i) => (
            <span
              key={i}
              className="animate-wave-char"
              style={{ animationDelay: `${baseDelay + i * 0.12}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))
        : fullText}
    </span>
  );
}
