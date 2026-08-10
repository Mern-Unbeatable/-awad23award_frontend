import { Link } from 'react-router-dom';
import { Seo } from '../../components/Seo';
import { GlassCard } from '../../components/tech';
import { useLocale } from '../../hooks/LocaleContext';
import { useSite } from '../../hooks/SiteContext';
import { useReveal } from '../../hooks/useReveal';
import { pick } from '../../types';

export function ServicesPage() {
  const { locale, pathFor, t } = useLocale();
  const { settings, services } = useSite();
  const ref = useReveal<HTMLElement>([services.length]);

  return (
    <>
      <Seo
        title={`${t('Services', 'الخدمات')} | ${settings.brandName}`}
        description={t(
          'CRM, WhatsApp automation, and AI agents for enterprise growth.',
          'CRM وأتمتة واتساب ووكلاء ذكاء اصطناعي لنمو المؤسسات.'
        )}
        path={pathFor('/services')}
      />

      <section className="page-hero">
        <div className="container-site relative z-10">
          <p className="eyebrow mb-4">{t('Services', 'الخدمات')}</p>
          <h1 className="page-hero__title">{t('What I Do', 'ما أقدمه')}</h1>
          <p className="page-hero__lead">
            {t(
              'Three core services designed to transform how your business operates, sells, and scales.',
              'ثلاث خدمات أساسية مصممة لتحويل كيفية عمل مؤسستك وبيعها وتوسعها.'
            )}
          </p>
        </div>
      </section>

      <section ref={ref} className="container-site py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Link
              key={service.id}
              to={pathFor(`/services/${service.slug}`)}
              data-reveal
              className="block h-full"
            >
              <GlassCard className="h-full p-6 flex flex-col">
                <div className="aspect-[16/10] rounded-lg overflow-hidden mb-5 -mx-1">
                  <img
                    src={service.imageUrl || ''}
                    alt={pick(service, locale, 'title')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="offer-card__icon mb-3">{String(i + 1).padStart(2, '0')}</span>
                <p className="offer-card__tag">{pick(service, locale, 'subtitle')}</p>
                <h2 className="offer-card__title text-xl mb-2">{pick(service, locale, 'title')}</h2>
                <p className="offer-card__excerpt flex-1">{pick(service, locale, 'excerpt')}</p>
                <span className="offer-card__link mt-4">{t('View service →', 'عرض الخدمة ←')}</span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
