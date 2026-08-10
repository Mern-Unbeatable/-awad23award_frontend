import axios from 'axios';
import { axiosInstance as api } from '../services/axiosInstance';
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
  subscribe: (email: string) => api.post('/newsletter/subscribe', { email }),
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
  getTestimonials: () => api.get<Testimonial[]>('/testimonials?all=1'),
  createTestimonial: (data: Partial<Testimonial>) =>
    api.post('/testimonials', data),
  updateTestimonial: (id: string, data: Partial<Testimonial>) =>
    api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => api.delete(`/testimonials/${id}`),
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
 * Rewrite backend upload URLs to same-origin `/uploads/...` paths (Vite proxy in dev).
 * Returns empty string for blob/data URLs (not persistable).
 */
export function resolveMediaUrl(url: string): string {
  if (!url || isBlobUrl(url) || url.startsWith('data:')) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('/uploads/')) return trimmed;
  if (trimmed.startsWith('uploads/')) return `/${trimmed}`;

  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.startsWith('/uploads/')) {
      return parsed.pathname;
    }
    // External URLs (unsplash, etc.)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // bare filename, e.g. uuid.png stored without path
    if (/^[a-f0-9-]+\.(png|jpe?g|webp|gif)$/i.test(trimmed)) {
      return `/uploads/${trimmed}`;
    }
  }

  return trimmed;
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

/** Human-readable message from an Axios or unknown error (includes status + validation errors). */
export function formatApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;
    const record =
      data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
    const message =
      (typeof record?.message === 'string' && record.message) || err.message;
    const fieldErrors = Array.isArray(record?.errors)
      ? record.errors.filter((e): e is string => typeof e === 'string').join('; ')
      : '';
    const parts = [
      status ? `HTTP ${status}` : '',
      message,
      fieldErrors,
    ].filter(Boolean);
    return parts.join(' — ');
  }
  return err instanceof Error ? err.message : 'Request failed';
}

/** Upload a file via Media API and return its persisted URL. */
export async function uploadImageFile(file: File, altEn = '', altAr = ''): Promise<string> {
  const response = await adminApi.uploadMedia(file, altEn, altAr);
  const url = extractUploadedUrl(response);
  if (!url) throw new Error('Upload succeeded but no URL was returned');
  return url;
}
