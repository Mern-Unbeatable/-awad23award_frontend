import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Seo } from '../../components/Seo';
import { GlassCard, ConnectButton, TechButton } from '../../components/tech';
import { useLocale } from '../../hooks/LocaleContext';
import { useSite } from '../../hooks/SiteContext';
import { publicApi } from '../../lib/api';
import { pick, type Service } from '../../types';

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
        <p className="text-cream-dim">{t('Loading…', 'جاري التحميل…')}</p>
      </div>
    );
  }

  const features = locale === 'ar' ? service.featuresAr : service.featuresEn;
  const body = pick(service, locale, 'body');

  return (
    <>
      <Seo
        title={`${pick(service, locale, 'title')} | ${settings.brandName}`}
        description={pick(service, locale, 'excerpt')}
        image={service.imageUrl || undefined}
        path={pathFor(`/services/${service.slug}`)}
      />
      <section className="relative min-h-[50vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src={service.imageUrl || ''}
            alt={pick(service, locale, 'title')}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/60" />
        </div>
        <div className="relative container-site pb-16 pt-36">
          <p className="eyebrow mb-4">{pick(service, locale, 'subtitle')}</p>
          <h1 className="page-hero__title max-w-4xl">{pick(service, locale, 'title')}</h1>
        </div>
      </section>

      <section className="container-site py-16 md:py-24 grid lg:grid-cols-[1.4fr_0.8fr] gap-14">
        <div>
          {body.includes('<') ? (
            <div className="prose-content mb-8" dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <p className="text-cream-dim text-lg leading-relaxed mb-8">{body}</p>
          )}
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex gap-3 items-start text-cream/85">
                <span className="text-accent mt-1">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <GlassCard className="p-6 h-fit">
          <p className="eyebrow mb-3">{t('Next step', 'الخطوة التالية')}</p>
          <h2 className="font-display font-bold text-xl mb-4">
            {t('Book a discovery call', 'احجز مكالمة اكتشاف')}
          </h2>
          <p className="text-cream-dim text-sm mb-6 leading-relaxed">
            {t(
              'Discuss your CRM, automation, or AI requirements — consultation on request.',
              'ناقش متطلبات CRM أو الأتمتة أو الذكاء الاصطناعي — الاستشارات عند الطلب.'
            )}
          </p>
          <ConnectButton variant="cyan" className="w-full mb-3">
            {t('Book a Call', 'احجز مكالمة')}
          </ConnectButton>
          <TechButton to={pathFor('/contact')} variant="outline" className="w-full">
            {t('Contact form', 'نموذج التواصل')}
          </TechButton>
        </GlassCard>
      </section>
    </>
  );
}
