import { useLocale } from '../../context/LocaleContext';

export function StatCard() {
  const { t } = useLocale();

  return (
    <div className="ref-stats-card" data-hero-stats>
      <div className="ref-stat">
        <div className="ref-stat-icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="8" cy="9" r="3" />
            <circle cx="16" cy="9" r="3" />
            <path d="M3 19c.7-2.6 2.7-4 5-4s4.3 1.4 5 4M13 15.4c1.9.3 3.4 1.5 4 3.6" />
          </svg>
        </div>
        <div>
          <div className="ref-stat-num">8+</div>
          <div className="ref-stat-lbl">{t('Years of Experience', 'سنوات من الخبرة')}</div>
        </div>
      </div>
      <div className="ref-stat">
        <div className="ref-stat-icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="8" height="8" rx="2" />
            <rect x="13" y="3" width="8" height="8" rx="2" />
            <rect x="3" y="13" width="8" height="8" rx="2" />
            <rect x="13" y="13" width="8" height="8" rx="2" />
          </svg>
        </div>
        <div>
          <div className="ref-stat-num">20+</div>
          <div className="ref-stat-lbl">{t('Projects Delivered', 'مشروعًا تم تسليمه')}</div>
        </div>
      </div>
      <div className="ref-stat">
        <div className="ref-stat-icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" />
          </svg>
        </div>
        <div>
          <div className="ref-stat-num">{t('KSA Focused', 'تركيز على السعودية')}</div>
          <div className="ref-stat-lbl">{t('Global Mindset', 'عقلية عالمية')}</div>
        </div>
      </div>
    </div>
  );
}
