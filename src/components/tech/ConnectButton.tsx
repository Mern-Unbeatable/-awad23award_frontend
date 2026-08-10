import type { CSSProperties, ReactNode } from 'react';
import { useLocale } from '../../hooks/LocaleContext';
import { useCalendly } from '../../hooks/useCalendly';
import { TechButton } from './TechButton';

type Variant = 'primary' | 'blue' | 'cyan' | 'outline' | 'ghost';

interface ConnectButtonProps {
  children?: ReactNode;
  variant?: Variant;
  className?: string;
  fallbackTo?: string;
  /** Load label, color, and booking action from GET /api/settings/scheduling */
  useSchedulingConfig?: boolean;
}

/** Opens Calendly popup when configured; otherwise navigates to book/contact page. */
export function ConnectButton({
  children,
  variant = 'blue',
  className = '',
  fallbackTo = '/book',
  useSchedulingConfig = false,
}: ConnectButtonProps) {
  const { pathFor } = useLocale();
  const { isConfigured, openCalendar, scheduling } = useCalendly();

  const label = useSchedulingConfig ? scheduling.buttonText || 'Book Now' : children;
  const customStyle: CSSProperties | undefined =
    useSchedulingConfig && scheduling.buttonColor
      ? { backgroundColor: scheduling.buttonColor }
      : undefined;

  if (isConfigured) {
    return (
      <TechButton
        variant={variant}
        className={className}
        style={customStyle}
        onClick={() => void openCalendar()}
      >
        {label}
      </TechButton>
    );
  }

  return (
    <TechButton
      variant={variant}
      to={pathFor(fallbackTo)}
      className={className}
      style={customStyle}
    >
      {label}
    </TechButton>
  );
}
