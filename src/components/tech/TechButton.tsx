import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'blue' | 'cyan' | 'outline' | 'ghost';

interface TechButtonProps {
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function TechButton({
  to,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  children,
}: TechButtonProps) {
  const cls = `tech-btn tech-btn--${variant} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
