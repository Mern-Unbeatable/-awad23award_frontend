import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { GlassCard, TechButton } from '../components/tech';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { publicApi } from '../lib/api';
import { pick, type Product } from '../types';

export function ProductPage() {
  const { slug = '' } = useParams();
  const { locale, pathFor, t } = useLocale();
  const { settings } = useSite();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    void publicApi.getProduct(slug).then(setProduct);
  }, [slug]);

  if (!product) {
    return (
      <div className="pt-40 container-site pb-24">
        <p className="text-cream-dim">{t('Loading…', 'جاري التحميل…')}</p>
      </div>
    );
  }

  const priceLabel =
    locale === 'ar' ? product.priceLabelAr || product.priceLabelEn : product.priceLabelEn;

  return (
    <>
      <Seo
        title={`${pick(product, locale, 'title')} | ${settings.brandName}`}
        description={pick(product, locale, 'excerpt')}
        image={product.imageUrl || undefined}
        path={pathFor(`/product/${product.slug}`)}
      />

      <section className="page-hero">
        <div className="container-site">
          <p className="eyebrow mb-4">{t('Product', 'منتج')}</p>
          <h1 className="page-hero__title">{pick(product, locale, 'title')}</h1>
          {priceLabel && <p className="text-accent font-display font-semibold mt-3">{priceLabel}</p>}
        </div>
      </section>

      <section className="container-site py-16 md:py-24 grid lg:grid-cols-2 gap-12">
        <div className="tech-hero__portrait-wrap max-h-[480px]">
          <img
            src={product.imageUrl || ''}
            alt={pick(product, locale, 'title')}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-cream-dim text-lg leading-relaxed mb-6">{pick(product, locale, 'excerpt')}</p>
          <div
            className="prose-content mb-8"
            dangerouslySetInnerHTML={{ __html: pick(product, locale, 'body') }}
          />
          <GlassCard className="p-6">
            <p className="eyebrow mb-2">{t('Inquiry', 'استفسار')}</p>
            <p className="text-cream-dim text-sm mb-4">
              {t(
                'Contact us for pricing, availability, and delivery options.',
                'تواصل معنا للأسعار والتوفر وخيارات التسليم.'
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <TechButton to={pathFor('/contact')} variant="primary">
                {t('Send inquiry', 'أرسل استفساراً')}
              </TechButton>
              <TechButton to={pathFor('/book')} variant="outline">
                {t("Let's Connect", 'لنتواصل')}
              </TechButton>
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
