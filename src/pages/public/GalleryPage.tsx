import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Seo } from '../../components/Seo';
import { PageReveal } from '../../components/PageReveal';
import { useLocale } from '../../context/LocaleContext';
import { useSite } from '../../context/SiteContext';
import { useReveal } from '../../hooks/useReveal';
import { resolveMediaUrl } from '../../lib/api';
import { pick } from '../../types';

export function GalleryPage() {
  const { locale, pathFor, t } = useLocale();
  const { gallery, settings, loading } = useSite();
  const ref = useReveal<HTMLElement>([gallery.length, loading]);

  return (
    <>
      <Seo
        title={`${t('Selected Work', 'أعمال مختارة')} | ${settings.brandName}`}
        description={t(
          'Case studies and portfolio projects.',
          'دراسات حالة ومشاريع المعرض.'
        )}
        path={pathFor('/work')}
      />
      <section className="page-hero">
        <div className="container-site relative z-10">
          <PageReveal>
            <p className="eyebrow mb-4">{t('Portfolio', 'معرض الأعمال')}</p>
            <h1 className="page-hero__title">{t('Selected Work', 'أعمال مختارة')}</h1>
            <p className="page-hero__lead">
              {t(
                'Enterprise projects across CRM, automation, and hospitality tech.',
                'مشاريع مؤسسية في CRM والأتمتة وتقنية الضيافة.'
              )}
            </p>
          </PageReveal>
        </div>
      </section>

      <section ref={ref} className="container-site pb-24">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          </div>
        ) : gallery.length === 0 ? (
          <p className="text-cream-dim text-center py-16">
            {t('No portfolio projects are published yet.', 'لا توجد مشاريع منشورة في المعرض بعد.')}
          </p>
        ) : (
          <div className="work-grid">
            {gallery.map((item) => {
              const mediaUrl = resolveMediaUrl(item.heroImageUrl || item.media?.url || '');
              return (
                <Link
                  key={item.id}
                  to={pathFor(`/work/${item.slug}`)}
                  data-reveal
                  className="work-card glass-card glass-card--hover text-start w-full"
                >
                  <div className="work-card__media">
                    {item.media.type === 'video' && mediaUrl ? (
                      <video src={mediaUrl} className="w-full h-full object-cover" muted playsInline />
                    ) : mediaUrl ? (
                      <img
                        src={mediaUrl}
                        alt={locale === 'ar' ? item.media.altAr : item.media.altEn}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-cream-dim text-sm">
                        {t('No image', 'لا توجد صورة')}
                      </div>
                    )}
                  </div>
                  <div className="work-card__body">
                    <h3 className="work-card__title">{pick(item, locale, 'title')}</h3>
                    <p className="text-cream-dim text-sm mt-2 line-clamp-2">
                      {pick(item, locale, 'excerpt') ||
                        t('Enterprise project delivered for measurable impact.', 'مشروع مؤسسي حقق أثراً ملموساً.')}
                    </p>
                    <span className="work-card__cta">{t('View case study →', 'عرض دراسة الحالة ←')}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
