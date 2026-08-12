import { axiosInstance as api } from '../services/axiosInstance';
import { SERVER_URL } from './env';
import type {
  GalleryItem,
  HomeSection,
  Product,
  Service,
  SiteSettings,
  Testimonial,
} from '../types';

export const publicApi = {
  getSettings: () =>
    api.get<SiteSettings>('/settings').then((res) => res.data),
  getSections: () =>
    api.get<HomeSection[]>('/pages').then((res) => res.data),
  getServices: () =>
    api.get<Service[]>('/services').then((res) => res.data),
  getService: (slug: string) =>
    api.get<Service>(`/services/${slug}`).then((res) => res.data),
  getProducts: () =>
    api.get<Product[]>('/products').then((res) => res.data),
  getProduct: (slug: string) =>
    api.get<Product>(`/products/${slug}`).then((res) => res.data),
  getTestimonials: () =>
    api.get<Testimonial[]>('/testimonials').then((res) => res.data),
  contact: (payload: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => api.post('/contact', { ...payload, website: '' }),
};

export const adminApi = {
  stats: () => api.get('/contact/stats'),
  getSections: () => api.get<HomeSection[]>('/pages'),
  updateSection: (key: string, data: Partial<HomeSection>) =>
    api.put(`/pages/${key}`, data),
  getServices: () => api.get<Service[]>('/services?all=1'),
  createService: (data: Partial<Service>) => api.post('/services', data),
  updateService: (id: string, data: Partial<Service>) =>
    api.put(`/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/services/${id}`),
  getMedia: () => api.get('/media'),
  uploadMedia: (file: File, altEn = '', altAr = '') => {
    const form = new FormData();
    form.append('file', file);
    form.append('altEn', altEn);
    form.append('altAr', altAr);
    return api.post('/media/upload', form, {
      timeout: 120_000,
      _uploadFile: file,
      _altEn: altEn,
      _altAr: altAr,
    } as Record<string, unknown>);
  },
  addMediaUrl: (url: string, type: 'image' | 'video' = 'image') =>
    api.post('/media/url', { url, type }),
  getMessages: () => api.get('/contact'),
  markRead: (id: string) => api.patch(`/contact/${id}/read`),
  deleteMessage: (id: string) => api.delete(`/contact/${id}`),
};

/** Extract persisted media URL from upload API response (wrapped or flat). */
export function extractUploadedUrl(response: { data?: unknown }): string | undefined {
  const body = response.data;
  if (!body || typeof body !== 'object') return undefined;
  const record = body as Record<string, unknown>;
  if (record.data && typeof record.data === 'object' && record.data !== null) {
    const inner = record.data as Record<string, unknown>;
    if (typeof inner.url === 'string') return inner.url;
  }
  if (typeof record.url === 'string') return record.url;
  return undefined;
}

export function isBlobUrl(url: string): boolean {
  return url.startsWith('blob:');
}

/**
 * Resolve a stored media URL for use in <img src> / CSS.
 *
 * Upload paths are always served from the backend (`SERVER_URL` / Vite `/uploads` proxy).
 * Never leave bare `/uploads/...` in production builds — that would hit the frontend host.
 * Returns empty string for blob/data URLs (not persistable).
 */
export function resolveMediaUrl(url: string): string {
  if (!url || isBlobUrl(url) || url.startsWith('data:')) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  let uploadPath: string | null = null;

  if (trimmed.startsWith('/uploads/')) {
    uploadPath = trimmed;
  } else if (trimmed.startsWith('uploads/')) {
    uploadPath = `/${trimmed}`;
  } else {
    try {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith('/uploads/')) {
        uploadPath = `${parsed.pathname}${parsed.search}`;
      } else if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        // External URLs (unsplash, CDN, etc.)
        return trimmed;
      }
    } catch {
      // bare filename, e.g. uuid.png stored without path
      if (/^[a-f0-9-]+\.(png|jpe?g|webp|gif)$/i.test(trimmed)) {
        uploadPath = `/uploads/${trimmed}`;
      }
    }
  }

  if (!uploadPath) return trimmed;

  // Dev: same-origin path so Vite can proxy to the API server.
  if (import.meta.env.DEV) return uploadPath;

  // Production: absolute backend origin (frontend host does not serve /uploads).
  return `${SERVER_URL}${uploadPath}`;
}

export function resolveGalleryItem(item: GalleryItem): GalleryItem {
  const hero = resolveMediaUrl(item.heroImageUrl || item.media?.url || '');
  return {
    ...item,
    heroImageUrl: hero,
    media: {
      ...item.media,
      url: hero || resolveMediaUrl(item.media?.url || ''),
    },
    screenshots: (item.screenshots || [])
      .map((u) => resolveMediaUrl(u))
      .filter(Boolean),
    challengeImageUrl: item.challengeImageUrl
      ? resolveMediaUrl(item.challengeImageUrl)
      : undefined,
    solutionArchImageUrl: item.solutionArchImageUrl
      ? resolveMediaUrl(item.solutionArchImageUrl)
      : undefined,
    recognitionImageUrl: item.recognitionImageUrl
      ? resolveMediaUrl(item.recognitionImageUrl)
      : undefined,
  };
}

/** Upload a file via Media API and return its persisted URL. */
export async function uploadImageFile(file: File, altEn = '', altAr = ''): Promise<string> {
  const response = await adminApi.uploadMedia(file, altEn, altAr);
  const url = extractUploadedUrl(response);
  if (!url) throw new Error('Upload succeeded but no URL was returned');
  return url;
}
