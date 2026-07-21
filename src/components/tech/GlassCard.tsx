import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'article' | 'section';
}

export function GlassCard({ children, className = '', hover = true, as: Tag = 'div' }: GlassCardProps) {
  return (
    <Tag className={`glass-card${hover ? ' glass-card--hover' : ''} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
