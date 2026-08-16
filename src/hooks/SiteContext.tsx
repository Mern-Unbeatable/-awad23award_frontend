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
import type {
  GalleryItem,
  HomeSection,
  Post,
  Product,
  SchedulingSettings,
  Service,
  SiteSettings,
  Testimonial,
} from '../types';
import {
  fallbackPosts,
  fallbackProducts,
  fallbackScheduling,
  fallbackSections,
  fallbackServices,
  fallbackSettings,
  fallbackTestimonials,
} from '../data/fallback';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectPublicBlogPosts,
  selectPublicBlogIsLoading,
} from '../features/public/blog/blogSelectors';
import { fetchPublicPosts } from '../features/public/blog/blogThunks';
import {
  selectPublicPortfolioGallery,
  selectPublicPortfolioIsLoading,
} from '../features/public/portfolio/portfolioSelectors';
import { fetchPublicGallery } from '../features/public/portfolio/portfolioThunks';
import {
  selectPublicScheduling,
  selectPublicSchedulingIsLoading,
} from '../features/public/scheduling/schedulingSelectors';
import { applyScheduling as applyPublicScheduling } from '../features/public/scheduling/schedulingSlice';
import { fetchPublicScheduling } from '../features/public/scheduling/schedulingThunks';

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
  const dispatch = useAppDispatch();
  const publicPosts = useAppSelector(selectPublicBlogPosts);
  const publicGallery = useAppSelector(selectPublicPortfolioGallery);
  const publicScheduling = useAppSelector(selectPublicScheduling);
  const blogPublicLoading = useAppSelector(selectPublicBlogIsLoading);
  const portfolioPublicLoading = useAppSelector(selectPublicPortfolioIsLoading);
  const schedulingPublicLoading = useAppSelector(selectPublicSchedulingIsLoading);

  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);
  const [sections, setSections] = useState<HomeSection[]>(fallbackSections);
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [siteLoading, setSiteLoading] = useState(true);

  const posts = publicPosts.length ? publicPosts : fallbackPosts;
  const gallery = publicGallery;
  const scheduling = publicScheduling ?? fallbackScheduling;
  const loading =
    siteLoading ||
    blogPublicLoading ||
    portfolioPublicLoading ||
    schedulingPublicLoading;

  const refresh = useCallback(async () => {
    setSiteLoading(true);
    const [
      settingsResult,
      sectionsResult,
      servicesResult,
      postsResult,
      galleryResult,
      schedulingResult,
    ] = await Promise.allSettled([
      publicApi.getSettings(),
      publicApi.getSections(),
      publicApi.getServices(),
      dispatch(fetchPublicPosts()),
      dispatch(fetchPublicGallery()),
      dispatch(fetchPublicScheduling()),
    ]);

    const s =
      settingsResult.status === 'fulfilled' ? settingsResult.value : fallbackSettings;
    const sec =
      sectionsResult.status === 'fulfilled' ? sectionsResult.value : fallbackSections;
    const svc =
      servicesResult.status === 'fulfilled' ? servicesResult.value : fallbackServices;

    const rawBrand = s.brandName || fallbackSettings.brandName;
    const brand = rawBrand
      .replace(/Awad/gi, 'Ibrahim')
      .replace(/عوض/g, 'إبراهيم')
      .replace(/official/gi, '')
      .trim();
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
                  imageUrl:
                    section.imageUrl ||
                    fallbackSections.find((f) => f.key === 'hero')?.imageUrl,
                  bodyEn: /Personal Brand|Keynote|Mentor/i.test(section.bodyEn)
                    ? fallbackSections.find((f) => f.key === 'hero')!.bodyEn
                    : section.bodyEn,
                  bodyAr:
                    section.bodyAr || fallbackSections.find((f) => f.key === 'hero')!.bodyAr,
                }
              : section,
          )
        : fallbackSections,
    );
    setServices(
      (svc.length ? svc : fallbackServices).map((service) => {
        const broken =
          !service.imageUrl ||
          service.imageUrl.includes('photo-1611746872915-64342b5c553a');
        if (!broken) return service;
        const fallback = fallbackServices.find((f) => f.slug === service.slug);
        return { ...service, imageUrl: fallback?.imageUrl || service.imageUrl };
      }),
    );
    setProducts(fallbackProducts);
    setTestimonials(fallbackTestimonials);
    setSiteLoading(false);

    void postsResult;
    void galleryResult;
    void schedulingResult;
  }, [dispatch]);

  const applyScheduling = useCallback(
    (data: SchedulingSettings) => {
      dispatch(applyPublicScheduling(data));
      setSettings((prev) => ({
        ...prev,
        calendlyUrl: data.bookingUrl || prev.calendlyUrl,
      }));
    },
    [dispatch],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const sectionByKey = useCallback(
    (key: string) => sections.find((s) => s.key === key),
    [sections],
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
    [
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
    ],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
