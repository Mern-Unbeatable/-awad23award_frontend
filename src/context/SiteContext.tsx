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
import type { GalleryItem, HomeSection, Post, Service, SiteSettings, Testimonial } from '../types';
import {
  fallbackGallery,
  fallbackPosts,
  fallbackSections,
  fallbackServices,
  fallbackSettings,
  fallbackTestimonials,
} from '../data/fallback';

interface SiteContextValue {
  settings: SiteSettings;
  sections: HomeSection[];
  services: Service[];
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
  const [posts, setPosts] = useState<Post[]>(fallbackPosts);
  const [gallery, setGallery] = useState<GalleryItem[]>(fallbackGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [s, sec, svc, p, g, t] = await Promise.all([
      publicApi.getSettings(),
      publicApi.getSections(),
      publicApi.getServices(),
      publicApi.getPosts(),
      publicApi.getGallery(),
      publicApi.getTestimonials(),
    ]);
    // Empty DB after migrate (no seed) returns blank rows — keep rich fallbacks
    setSettings({
      ...fallbackSettings,
      ...s,
      aboutImageUrl: s.aboutImageUrl || fallbackSettings.aboutImageUrl,
      showreelPoster: s.showreelPoster || fallbackSettings.showreelPoster,
      showreelUrl: s.showreelUrl || fallbackSettings.showreelUrl,
      logoUrl: s.logoUrl || null,
    });
    setSections(sec.length ? sec : fallbackSections);
    setServices(svc.length ? svc : fallbackServices);
    setPosts(p.length ? p : fallbackPosts);
    setGallery(g.length ? g : fallbackGallery);
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
      posts,
      gallery,
      testimonials,
      loading,
      refresh,
      sectionByKey,
    }),
    [settings, sections, services, posts, gallery, testimonials, loading, refresh, sectionByKey]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
