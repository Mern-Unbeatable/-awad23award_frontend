import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useSite } from '../../context/SiteContext';
import { ArrowIcon, BrandLogo, TechButton } from '../tech';

export function Footer() {
  const { pathFor, t } = useLocale();
  const { settings } = useSite();

  const brandLabel =
    /official/i.test(settings.brandName) || !settings.brandName.trim()
      ? 'Ahmed Ibrahim'
      : settings.brandName.toUpperCase();

  return (
    <footer className="ref-footer" id="contact">
      <div className="ref-wrap container-site ref-foot-grid">
        <div className="ref-foot-brand">
          <Link to={pathFor('/')} className="ref-brand-link">
            <BrandLogo name={brandLabel} />
          </Link>
          <p>{t('Building systems. Solving problems. Creating impact.', 'أبني الأنظمة. أحل المشكلات. أصنع الأثر.')}</p>
        </div>

        <div>
          <h4>{t('Links', 'روابط')}</h4>
          <div className="ref-foot-links">
            <Link to={pathFor('/about')}>{t('About', 'من أنا')}</Link>
            <Link to={pathFor('/services')}>{t('Services', 'الخدمات')}</Link>
            <Link to={pathFor('/work')}>{t('Work', 'الأعمال')}</Link>
            <Link to={pathFor('/journal')}>{t('Insights', 'مقالات')}</Link>
            <Link to={pathFor('/contact')}>{t('Contact', 'تواصل')}</Link>
          </div>
        </div>

        <div>
          <h4>{t('Connect', 'تواصل')}</h4>
          <div className="ref-foot-links">
            {settings.socialLinkedin && (
              <a href={settings.socialLinkedin} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5A2.49 2.49 0 002.5 6c0 1.38 1.1 2.5 2.48 2.5A2.5 2.5 0 007.48 6a2.5 2.5 0 00-2.5-2.5zM2.9 9.9h4.2V21H2.9zM9.5 9.9h4v1.5h.1c.6-1 1.9-1.9 3.7-1.9 3.9 0 4.7 2.5 4.7 5.8V21h-4.2v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21H9.5z" />
                </svg>
                LinkedIn
              </a>
            )}
            {settings.socialYoutube && (
              <a href={settings.socialYoutube} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 3.6 12 3.6 12 3.6s-4.6 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.9.2 7.6.3 7.6.3s4.6 0 7.7-.3c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.8 15.1V8.7l6.2 3.2z" />
                </svg>
                YouTube
              </a>
            )}
            {settings.socialInstagram && (
              <a href={settings.socialInstagram} target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            )}
            <a href={`mailto:${settings.contactEmail}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="M3 8l9 6 9-6" />
              </svg>
              {t('Email', 'البريد الإلكتروني')}
            </a>
          </div>
        </div>

        <div className="ref-foot-cta">
          <h4>{t("Let's build something", 'لنبنِ شيئًا معًا')}</h4>
          <p>
            {t(
              "Have a project or idea in mind? I'd love to hear about it.",
              'هل لديك مشروع أو فكرة؟ يسعدني سماعها.'
            )}
          </p>
          <TechButton variant="cyan" href={`mailto:${settings.contactEmail}`}>
            {t('Get In Touch', 'تواصل الآن')}
            <ArrowIcon />
          </TechButton>
        </div>
      </div>

      <div className="ref-wrap container-site ref-foot-bottom">
        <span>
          © {new Date().getFullYear()} {settings.brandName}. {t('All rights reserved.', 'جميع الحقوق محفوظة.')}
        </span>
        <span>{t('Designed & Built with purpose 💙', 'صُمم وبُني بشغف 💙')}</span>
      </div>
    </footer>
  );
}
