import { useId } from 'react';

interface BrandLogoProps {
  className?: string;
  name?: string;
  markOnly?: boolean;
}

/** Dual-tone “A” mark matching the Ahmed Awad reference brand. */
export function BrandLogo({ className = '', name = 'AHMED AWAD', markOnly = false }: BrandLogoProps) {
  const gid = useId().replace(/:/g, '');

  return (
    <span className={`ref-brand ${className}`.trim()}>
      <span className="ref-brand-mark" aria-hidden>
        <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
          <defs>
            <linearGradient id={`brandARight-${gid}`} x1="18" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5ea1ff" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path
            d="M20 5 L6 35"
            stroke="#1e3a8a"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 5 L34 35"
            stroke={`url(#brandARight-${gid})`}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 23 H26.5"
            stroke="#38bdf8"
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      </span>
      {!markOnly && <span className="ref-brand-name">{name}</span>}
    </span>
  );
}
