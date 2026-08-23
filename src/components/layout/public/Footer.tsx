import { Link } from 'react-router-dom';
import { useLocale } from '../../../hooks/LocaleContext';
import { useSite } from '../../../hooks/SiteContext';
import { SocialLinks } from '../../site/SocialLinks';
import { ArrowIcon, BrandLogo, TechButton } from '../../tech';

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
          <SocialLinks variant="inline" />
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
