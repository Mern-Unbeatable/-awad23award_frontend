import type { ReactNode } from 'react';
import { useLocale } from '../../context/LocaleContext';
import { useCalendly } from '../../hooks/useCalendly';
import { TechButton } from './TechButton';

type Variant = 'primary' | 'blue' | 'cyan' | 'outline' | 'ghost';

interface ConnectButtonProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  fallbackTo?: string;
}

/** Opens Calendly popup when configured; otherwise navigates to book/contact page. */
export function ConnectButton({
  children,
  variant = 'blue',
  className = '',
  fallbackTo = '/book',
}: ConnectButtonProps) {
  const { pathFor } = useLocale();
  const { isConfigured, openCalendar } = useCalendly();

  if (isConfigured) {
    return (
      <TechButton variant={variant} className={className} onClick={() => void openCalendar()}>
        {children}
      </TechButton>
    );
  }

  return (
    <TechButton variant={variant} to={pathFor(fallbackTo)} className={className}>
      {children}
    </TechButton>
  );
}
