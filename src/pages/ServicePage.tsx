import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Seo } from '../components/Seo';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { publicApi } from '../lib/api';
import { pick, type Service } from '../types';

export function ServicePage() {
  const { slug = '' } = useParams();
  const { locale, pathFor, t } = useLocale();
  const { settings } = useSite();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    void publicApi.getService(slug).then(setService);
  }, [slug]);

  if (!service) {
    return (
      <div className="pt-40 container-site pb-24">
        <p className="text-cream/60">{t('Loading…', 'جاري التحميل…')}</p>
      </div>
    );
  }

  const features = locale === 'ar' ? service.featuresAr : service.featuresEn;

  return (
    <>
      <Seo
        title={`${pick(service, locale, 'title')} | ${settings.brandName}`}
        description={pick(service, locale, 'excerpt')}
        image={service.imageUrl || undefined}
        path={pathFor(`/services/${service.slug}`)}
      />
      <section className="relative min-h-[60vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={service.imageUrl || ''}
            alt={pick(service, locale, 'title')}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/20" />
        </div>
        <div className="relative container-site pb-16 pt-36">
          <p className="eyebrow mb-4">{pick(service, locale, 'subtitle')}</p>
          <h1 className="font-display font-extrabold text-[clamp(2.4rem,6vw,4.5rem)] leading-none max-w-4xl">
            {pick(service, locale, 'title')}
          </h1>
        </div>
      </section>

      <section className="container-site py-16 md:py-24 grid lg:grid-cols-[1.4fr_0.8fr] gap-14">
        <div>
          <p className="text-cream/75 text-lg leading-relaxed mb-8">{pick(service, locale, 'body')}</p>
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex gap-3 items-start text-cream/85">
                <span className="text-accent mt-1">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="service-cta">
          <p className="eyebrow mb-3">{t('Next step', 'الخطوة التالية')}</p>
          <h2 className="font-display font-bold text-2xl mb-4">
            {t('Book a free discovery call', 'احجز مكالمة اكتشاف مجانية')}
          </h2>
          <p className="text-cream/60 text-sm mb-6 leading-relaxed">
            {t(
              'Pick a time that works for you. We will map your brand goals and the right programme.',
              'اختر وقتاً يناسبك. سنحدد أهداف علامتك والبرنامج المناسب.'
            )}
          </p>
          <Link to={pathFor('/book')} className="btn btn-accent w-full mb-3">
            {t('Book a Call', 'احجز مكالمة')}
          </Link>
          <Link to={pathFor('/contact')} className="btn btn-light w-full">
            {t('Contact form', 'نموذج التواصل')}
          </Link>
        </aside>
      </section>
    </>
  );
}
