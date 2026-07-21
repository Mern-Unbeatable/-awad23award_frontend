export type Locale = 'en' | 'ar';

export interface SiteSettings {
  id: string;
  brandName: string;
  logoUrl?: string | null;
  taglineEn: string;
  taglineAr: string;
  contactEmail: string;
  contactPhone?: string | null;
  calendlyUrl: string;
  calendlyConnectedAt?: string | null;
  socialInstagram?: string | null;
  socialLinkedin?: string | null;
  socialYoutube?: string | null;
  socialTwitter?: string | null;
  seoTitleEn: string;
  seoTitleAr: string;
  seoDescriptionEn: string;
  seoDescriptionAr: string;
  aboutImageUrl?: string | null;
  showreelUrl?: string | null;
  showreelPoster?: string | null;
}

export interface HomeSection {
  id: string;
  key: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  bodyEn: string;
  bodyAr: string;
  ctaLabelEn: string;
  ctaLabelAr: string;
  ctaLink: string;
  imageUrl?: string | null;
  order: number;
}

export interface Service {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  featuresEn: string[];
  featuresAr: string[];
  imageUrl?: string | null;
  order: number;
  published: boolean;
}

export interface Post {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  coverImage?: string | null;
  categoryEn: string;
  categoryAr: string;
  seoTitleEn?: string | null;
  seoTitleAr?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionAr?: string | null;
  status: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  imageUrl?: string | null;
  priceLabelEn?: string | null;
  priceLabelAr?: string | null;
  order: number;
  published: boolean;
}

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleAr: string;
  slug: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  order: number;
  published: boolean;
  media: {
    id: string;
    type: string;
    url: string;
    altEn: string;
    altAr: string;
  };
}

export interface Testimonial {
  id: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  quoteEn: string;
  quoteAr: string;
  avatarUrl?: string | null;
  order: number;
}

export function pick(
  item: object,
  locale: Locale,
  field: string
): string {
  const key = `${field}${locale === 'ar' ? 'Ar' : 'En'}`;
  const value = (item as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}
