import { Link, Navigate, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { ConnectButton, GlassCard, TechButton } from '../components/tech';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { pick } from '../types';

export function CaseStudyPage() {
  const { slug = '' } = useParams();
  const { locale, pathFor, t } = useLocale();
  const { settings, gallery, loading } = useSite();
  const item = gallery.find((g) => g.slug === slug);

  if (!loading && !item) {
    return <Navigate to={pathFor('/work')} replace />;
  }

  if (!item) {
    return (
      <div className="pt-40 container-site pb-24">
        <p className="text-cream-dim">{t('Loading…', 'جاري التحميل…')}</p>
      </div>
    );
  }

  const title = pick(item, locale, 'title');
  const excerpt = pick(item, locale, 'excerpt');
  const body = pick(item, locale, 'body');

  return (
    <>
      <Seo
        title={`${title} | ${settings.brandName}`}
        description={excerpt}
        image={item.media.url}
        path={pathFor(`/work/${item.slug}`)}
      />

      <section className="relative min-h-[50vh] flex items-end">
        <div className="absolute inset-0">
          <img src={item.media.url} alt={title} className="h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/55" />
        </div>
        <div className="relative container-site pb-16 pt-36">
          <Link to={pathFor('/work')} className="journal-back">
            ← {t('Back to work', 'العودة للأعمال')}
          </Link>
          <p className="eyebrow mt-8 mb-4">{t('Case Study', 'دراسة حالة')}</p>
          <h1 className="page-hero__title max-w-4xl">{title}</h1>
          {excerpt ? <p className="page-hero__lead mt-5 max-w-2xl">{excerpt}</p> : null}
        </div>
      </section>

      <section className="container-site py-16 md:py-24 grid lg:grid-cols-[1.4fr_0.8fr] gap-14">
        <div>
          {body.includes('<') ? (
            <div className="prose-content mb-8" dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <p className="text-cream-dim text-lg leading-relaxed mb-8">
              {body ||
                t(
                  'Enterprise project delivered for measurable impact.',
                  'مشروع مؤسسي حقق أثراً ملموساً.'
                )}
            </p>
          )}
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img
              src={item.media.url}
              alt={locale === 'ar' ? item.media.altAr : item.media.altEn}
              className="w-full max-h-[520px] object-cover"
            />
          </div>
        </div>

        <GlassCard className="p-6 h-fit">
          <p className="eyebrow mb-3">{t('Next step', 'الخطوة التالية')}</p>
          <h2 className="font-display font-bold text-xl mb-4">
            {t('Start a similar project', 'ابدأ مشروعاً مشابهاً')}
          </h2>
          <p className="text-cream-dim text-sm mb-6 leading-relaxed">
            {t(
              'Discuss how a system like this could fit your operations, CRM, or automation roadmap.',
              'ناقش كيف يمكن لنظام كهذا أن يناسب عملياتك أو CRM أو خارطة الأتمتة لديك.'
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
