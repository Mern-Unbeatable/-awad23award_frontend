import { Seo } from '../components/Seo';
import { TechButton } from '../components/tech';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { useReveal } from '../hooks/useReveal';
import { pick } from '../types';

export function AboutPage() {
  const { locale, pathFor, t } = useLocale();
  const { settings, sectionByKey } = useSite();
  const about = sectionByKey('about');
  const ref = useReveal<HTMLElement>([about?.id]);

  return (
    <>
      <Seo
        title={`${t('About', 'من نحن')} | ${settings.brandName}`}
        description={about ? pick(about, locale, 'body') : settings.taglineEn}
        path={pathFor('/about')}
      />

      <section className="page-hero">
        <div className="container-site relative z-10">
          <p className="eyebrow mb-4">{t('About', 'نبذة')}</p>
          <h1 className="page-hero__title">
            {about ? pick(about, locale, 'title') : settings.brandName}
          </h1>
          <p className="page-hero__lead">
            {locale === 'ar' ? settings.taglineAr : settings.taglineEn}
          </p>
        </div>
      </section>

      <section ref={ref} className="container-site py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div data-reveal-scale className="tech-hero__portrait-wrap max-h-120">
            <img
              src={about?.imageUrl || settings.aboutImageUrl || ''}
              alt={settings.brandName}
              className="w-full h-full object-cover"
            />
          </div>
          <div data-reveal-right>
            <p className="text-cream-dim text-lg leading-relaxed mb-8">
              {about ? pick(about, locale, 'body') : ''}
            </p>
            <ul className="space-y-3 mb-8 text-cream-dim">
              <li className="flex gap-3">
                <span className="text-accent">✓</span>
                {t('8+ years in enterprise technology', '8+ سنوات في التقنية المؤسسية')}
              </li>
              <li className="flex gap-3">
                <span className="text-accent">✓</span>
                {t('CRM, automation & AI specialist', 'متخصص CRM وأتمتة وذكاء اصطناعي')}
              </li>
              <li className="flex gap-3">
                <span className="text-accent">✓</span>
                {t('KSA & global client base', 'قاعدة عملاء في السعودية وعالمياً')}
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <TechButton to={pathFor('/contact')} variant="primary">
                {t('Get in Touch', 'تواصل معنا')}
              </TechButton>
              <TechButton to={pathFor('/work')} variant="outline">
                {t('View Work', 'عرض الأعمال')}
              </TechButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
