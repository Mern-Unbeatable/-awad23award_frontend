import axios from 'axios';
import { saveSession, getAccessToken, clearSession, getRefreshToken, updateTokens } from './auth';
import type {
  GalleryItem,
  HomeSection,
  Post,
  Product,
  Service,
  SiteSettings,
  Testimonial,
} from '../types';
import {
  fallbackGallery,
  fallbackPosts,
  fallbackProducts,
  fallbackSections,
  fallbackServices,
  fallbackSettings,
  fallbackTestimonials,
} from '../data/fallback';

const api = axios.create({
  baseURL: '/api',
  timeout: 12000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      original._retried ||
      original.url?.includes('/auth/login') ||
      original.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    original._retried = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');

      const res = await api.post('/auth/refresh', { refreshToken });
      const body = res.data;
      const payload = body?.data || body;

      const newAccessToken = payload?.accessToken || payload?.token || body?.accessToken || body?.token;
      const newRefreshToken = payload?.refreshToken || body?.refreshToken || refreshToken;

      if (!newAccessToken) throw new Error('Refresh failed to return token');

      updateTokens(newAccessToken, newRefreshToken);

      pendingRequests.forEach((cb) => cb(newAccessToken));
      pendingRequests = [];

      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(original);
    } catch (refreshErr) {
      pendingRequests.forEach((cb) => cb(''));
      pendingRequests = [];
      clearSession();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);


async function withFallback<T>(request: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await request();
  } catch {
    return fallback;
  }
}

export const publicApi = {
  getSettings: () =>
    withFallback(
      async () => (await api.get<SiteSettings>('/settings')).data,
      fallbackSettings
    ),
  getSections: () =>
    withFallback(
      async () => (await api.get<HomeSection[]>('/pages')).data,
      fallbackSections
    ),
  getServices: () =>
    withFallback(async () => (await api.get<Service[]>('/services')).data, fallbackServices),
  getService: async (slug: string) => {
    try {
      return (await api.get<Service>(`/services/${slug}`)).data;
    } catch {
      return fallbackServices.find((s) => s.slug === slug) || null;
    }
  },
  getProducts: () =>
    withFallback(async () => (await api.get<Product[]>('/products')).data, fallbackProducts),
  getProduct: async (slug: string) => {
    try {
      return (await api.get<Product>(`/products/${slug}`)).data;
    } catch {
      return fallbackProducts.find((p) => p.slug === slug) || null;
    }
  },
  getPosts: () =>
    withFallback(async () => (await api.get<Post[]>('/posts')).data, fallbackPosts),
  getPost: async (slug: string) => {
    try {
      return (await api.get<Post>(`/posts/${slug}`)).data;
    } catch {
      return fallbackPosts.find((p) => p.slug === slug) || null;
    }
  },
  getGallery: () =>
    withFallback(
      async () => (await api.get<GalleryItem[]>('/gallery')).data,
      fallbackGallery
    ),
  getTestimonials: () =>
    withFallback(
      async () => (await api.get<Testimonial[]>('/testimonials')).data,
      fallbackTestimonials
    ),
  subscribe: (email: string) =>
    api.post('/newsletter/subscribe', { email }),
  contact: (payload: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => api.post('/contact', { ...payload, website: '' }),
};



export const adminApi = {

  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const body = res.data;
    const payload = body?.data || body;

    const token = payload?.accessToken || payload?.token || body?.accessToken || body?.token;
    const refreshToken = payload?.refreshToken || body?.refreshToken || token;
    const adminData = payload?.admin || payload?.user || body?.admin || body?.user || { id: '1', email, name: 'Admin' };

    if (!token || typeof token !== 'string') {
      throw new Error('No valid access token received from backend server.');
    }

    saveSession({
      accessToken: token,
      refreshToken: refreshToken,
      admin: adminData,
    });

    return body;
  },
  me: () => api.get('/auth/me'),

  logout: async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      clearSession();
    }
  },
  stats: () => api.get('/contact/stats'),
  updateSettings: (data: Partial<SiteSettings>) => api.put('/settings', data),
  getSections: () => api.get<HomeSection[]>('/pages'),
  updateSection: (key: string, data: Partial<HomeSection>) => api.put(`/pages/${key}`, data),
  getServices: () => api.get<Service[]>('/services?all=1'),
  createService: (data: Partial<Service>) => api.post('/services', data),
  updateService: (id: string, data: Partial<Service>) => api.put(`/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/services/${id}`),
  getPosts: () => api.get<Post[]>('/posts?all=1'),
  createPost: (data: Partial<Post>) => api.post('/posts', data),
  updatePost: (id: string, data: Partial<Post>) => api.put(`/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  getGallery: () => api.get<GalleryItem[]>('/gallery?all=1'),
  createGalleryItem: (data: { mediaId: string; titleEn?: string; titleAr?: string }) =>
    api.post('/gallery', data),
  createPortfolioItem: (data: Record<string, unknown>) => api.post('/gallery', data),
  updatePortfolioItem: (id: string, data: Record<string, unknown>) =>
    api.put(`/gallery/${id}`, data),
  deleteGalleryItem: (id: string) => api.delete(`/gallery/${id}`),
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
  getSubscribers: () => api.get('/newsletter'),
  deleteSubscriber: (id: string) => api.delete(`/newsletter/${id}`),
  exportSubscribers: () =>
    api.get('/newsletter/export', { responseType: 'blob' }),
  getMessages: () => api.get('/contact'),
  markRead: (id: string) => api.patch(`/contact/${id}/read`),
  deleteMessage: (id: string) => api.delete(`/contact/${id}`),
  getTestimonials: () => api.get<Testimonial[]>('/testimonials?all=1'),
  createTestimonial: (data: Partial<Testimonial>) => api.post('/testimonials', data),
  updateTestimonial: (id: string, data: Partial<Testimonial>) =>
    api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => api.delete(`/testimonials/${id}`),
  getCalendlyAuthUrl: () => api.get<{ url: string }>('/calendly/auth-url'),
  getCalendlyStatus: () =>
    api.get<{ connected: boolean; calendlyUrl: string; calendlyConnectedAt: string | null }>(
      '/calendly/status'
    ),
  syncCalendly: () => api.post('/calendly/sync'),
  disconnectCalendly: () => api.post('/calendly/disconnect'),
};

export default api;

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
 * Rewrite backend absolute upload URLs to same-origin paths so images load
 * through the Vite `/uploads` proxy during local development.
 */
export function resolveMediaUrl(url: string): string {
  if (!url || isBlobUrl(url) || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads/')) return url;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith('/uploads/')) {
      return parsed.pathname;
    }
  } catch {
    // not a valid absolute URL — return as-is
  }
  return url;
}

/** Unwrap `{ success, data }` API responses or return payload as-is. */
export function unwrapApiData<T>(body: unknown): T {
  if (body && typeof body === 'object' && 'data' in body) {
    const record = body as Record<string, unknown>;
    if (record.success !== undefined && record.data !== undefined) {
      return record.data as T;
    }
  }
  return body as T;
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
