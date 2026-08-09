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
import type { GalleryItem, HomeSection, Post, Product, SchedulingSettings, Service, SiteSettings, Testimonial } from '../types';
import {
  fallbackPosts,
  fallbackProducts,
  fallbackScheduling,
  fallbackSections,
  fallbackServices,
  fallbackSettings,
  fallbackTestimonials,
} from '../data/fallback';

interface SiteContextValue {
  settings: SiteSettings;
  scheduling: SchedulingSettings;
  sections: HomeSection[];
  services: Service[];
  products: Product[];
  posts: Post[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  loading: boolean;
  refresh: () => Promise<void>;
  applyScheduling: (data: SchedulingSettings) => void;
  sectionByKey: (key: string) => HomeSection | undefined;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);
  const [scheduling, setScheduling] = useState<SchedulingSettings>(fallbackScheduling);
  const [sections, setSections] = useState<HomeSection[]>(fallbackSections);
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [posts, setPosts] = useState<Post[]>(fallbackPosts);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [
      settingsResult,
      schedulingResult,
      sectionsResult,
      servicesResult,
      productsResult,
      postsResult,
      galleryResult,
      testimonialsResult,
    ] = await Promise.allSettled([
      publicApi.getSettings(),
      publicApi.getScheduling(),
      publicApi.getSections(),
      publicApi.getServices(),
      publicApi.getProducts(),
      publicApi.getPosts(),
      publicApi.getGallery(),
      publicApi.getTestimonials(),
    ]);

    const s = settingsResult.status === 'fulfilled' ? settingsResult.value : fallbackSettings;
    const sec = sectionsResult.status === 'fulfilled' ? sectionsResult.value : fallbackSections;
    const svc = servicesResult.status === 'fulfilled' ? servicesResult.value : fallbackServices;
    const prod = productsResult.status === 'fulfilled' ? productsResult.value : fallbackProducts;
    const p = postsResult.status === 'fulfilled' ? postsResult.value : fallbackPosts;
    const g =
      galleryResult.status === 'fulfilled' ? galleryResult.value : [];
    const t = testimonialsResult.status === 'fulfilled' ? testimonialsResult.value : fallbackTestimonials;

    if (schedulingResult.status === 'fulfilled') {
      setScheduling(schedulingResult.value);
    }

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
    if (galleryResult.status === 'fulfilled') {
      setGallery(g);
    }
    setTestimonials(t.length ? t : fallbackTestimonials);
    setLoading(false);
  }, []);

  const applyScheduling = useCallback((data: SchedulingSettings) => {
    setScheduling(data);
    setSettings((prev) => ({
      ...prev,
      calendlyUrl: data.bookingUrl || prev.calendlyUrl,
    }));
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
      scheduling,
      sections,
      services,
      products,
      posts,
      gallery,
      testimonials,
      loading,
      refresh,
      applyScheduling,
      sectionByKey,
    }),
    [settings, scheduling, sections, services, products, posts, gallery, testimonials, loading, refresh, applyScheduling, sectionByKey]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
