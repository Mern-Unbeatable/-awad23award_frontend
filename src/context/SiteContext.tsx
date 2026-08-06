import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { publicApi } from '../lib/api';
import { normalizeGalleryList } from '../lib/portfolio';
import type { GalleryItem, HomeSection, Post, Product, Service, SiteSettings, Testimonial } from '../types';
import {
  fallbackGallery,
  fallbackPosts,
  fallbackProducts,
  fallbackSections,
  fallbackServices,
  fallbackSettings,
  fallbackTestimonials,
} from '../data/fallback';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface SiteContextValue {
  settings: SiteSettings;
  sections: HomeSection[];
  services: Service[];
  products: Product[];
  posts: Post[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  loading: boolean;
  refresh: () => Promise<void>;
  sectionByKey: (key: string) => HomeSection | undefined;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);
  const [sections, setSections] = useState<HomeSection[]>(fallbackSections);
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [posts, setPosts] = useState<Post[]>(fallbackPosts);
  const [gallery, setGallery] = useState<GalleryItem[]>(fallbackGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [s, sec, svc, prod, p, g, t] = await Promise.all([
      publicApi.getSettings(),
      publicApi.getSections(),
      publicApi.getServices(),
      publicApi.getProducts(),
      publicApi.getPosts(),
      publicApi.getGallery(),
      publicApi.getTestimonials(),
    ]);
    // Sanitise: backend may still carry the old "Awad" brand — normalise to Ibrahim everywhere
    const rawBrand = s.brandName || fallbackSettings.brandName;
    const brand = rawBrand.replace(/Awad/gi, 'Ibrahim').replace(/عوض/g, 'إبراهيم').replace(/official/gi, '').trim();
    const rawSeoEn = s.seoTitleEn || fallbackSettings.seoTitleEn;
    const rawSeoAr = s.seoTitleAr || fallbackSettings.seoTitleAr;
    setSettings({
      ...fallbackSettings,
      ...s,
      brandName: brand,
      seoTitleEn: rawSeoEn.replace(/Awad/gi, 'Ibrahim'),
      seoTitleAr: rawSeoAr.replace(/عوض/g, 'إبراهيم'),
      aboutImageUrl: s.aboutImageUrl || fallbackSettings.aboutImageUrl,
      showreelPoster: s.showreelPoster || fallbackSettings.showreelPoster,
      showreelUrl: s.showreelUrl || fallbackSettings.showreelUrl,
      logoUrl: null,
    });
    setSections(
      sec.length
        ? sec.map((section) =>
            section.key === 'hero'
              ? {
                  ...section,
                  imageUrl: section.imageUrl || fallbackSections.find((f) => f.key === 'hero')?.imageUrl,
                  bodyEn: /Personal Brand|Keynote|Mentor/i.test(section.bodyEn)
                    ? fallbackSections.find((f) => f.key === 'hero')!.bodyEn
                    : section.bodyEn,
                  bodyAr: section.bodyAr || fallbackSections.find((f) => f.key === 'hero')!.bodyAr,
                }
              : section
          )
        : fallbackSections
    );
    setServices(
      (svc.length ? svc : fallbackServices).map((service) => {
        const broken =
          !service.imageUrl ||
          service.imageUrl.includes('photo-1611746872915-64342b5c553a');
        if (!broken) return service;
        const fallback = fallbackServices.find((f) => f.slug === service.slug);
        return { ...service, imageUrl: fallback?.imageUrl || service.imageUrl };
      })
    );
    setProducts(
      (prod.length ? prod : fallbackProducts).map((product) => {
        if (product.imageUrl) return product;
        const fallback = fallbackProducts.find((f) => f.slug === product.slug);
        return { ...product, imageUrl: fallback?.imageUrl || product.imageUrl };
      })
    );
    setPosts(p.length ? p : fallbackPosts);
    setGallery(
      normalizeGalleryList(g.length ? g : fallbackGallery).map((item, index) => {
        const byTitle = fallbackGallery.find(
          (f) => f.titleEn.toLowerCase() === (item.titleEn || '').toLowerCase()
        );
        const byOrder = fallbackGallery[index];
        const fallback = byTitle || byOrder;
        const coverUrl = item.heroImageUrl || item.media?.url || '';
        const broken =
          !coverUrl ||
          coverUrl.includes('photo-1611746872915-64342b5c553a') ||
          coverUrl.includes('photo-1611606063065-ee7946f0787a');
        const resolvedUrl = broken ? fallback?.media.url || coverUrl : coverUrl;
        return {
          ...item,
          slug: item.slug || fallback?.slug || slugify(item.titleEn || `work-${index + 1}`),
          excerptEn: item.excerptEn || fallback?.excerptEn || '',
          excerptAr: item.excerptAr || fallback?.excerptAr || '',
          bodyEn: item.bodyEn || fallback?.bodyEn || '',
          bodyAr: item.bodyAr || fallback?.bodyAr || '',
          heroImageUrl: resolvedUrl,
          media: {
            ...item.media,
            url: resolvedUrl,
          },
        };
      })
    );
    setTestimonials(t.length ? t : fallbackTestimonials);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const sectionByKey = useCallback(
    (key: string) => sections.find((s) => s.key === key),
    [sections]
  );

  const value = useMemo(
    () => ({
      settings,
      sections,
      services,
      products,
      posts,
      gallery,
      testimonials,
      loading,
      refresh,
      sectionByKey,
    }),
    [settings, sections, services, products, posts, gallery, testimonials, loading, refresh, sectionByKey]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
