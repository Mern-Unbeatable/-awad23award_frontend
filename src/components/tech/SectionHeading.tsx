import { Link } from 'react-router-dom';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  viewAllLabel,
  viewAllHref,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div
      className={`section-heading${align === 'center' ? ' section-heading--center' : ''}`}
    >
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-heading__title">{title}</h2>
        {description && <p className="section-heading__desc">{description}</p>}
      </div>
      {viewAllLabel && viewAllHref && (
        <Link to={viewAllHref} className="section-heading__link">
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}
