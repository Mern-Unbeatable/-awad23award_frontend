import { Helmet } from 'react-helmet-async';
import { useLocale } from '../hooks/LocaleContext';
import { useSite } from '../hooks/SiteContext';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

export function Seo({ title, description, image, path = '' }: SeoProps) {
  const { locale } = useLocale();
  const { settings } = useSite();
  const pageTitle =
    title || (locale === 'ar' ? settings.seoTitleAr : settings.seoTitleEn);
  const pageDesc =
    description || (locale === 'ar' ? settings.seoDescriptionAr : settings.seoDescriptionEn);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = `${origin}${path}`;

  return (
    <Helmet>
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
