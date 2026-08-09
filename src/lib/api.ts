import axios from 'axios';
import {
  saveSession,
  getAccessToken,
  clearSession,
  getRefreshToken,
  updateTokens,
} from './auth';
import { API_BASE } from './env';
import {
  normalizePortfolioList,
  tabbedToGalleryItem,
  type PortfolioTabbedPayload,
} from './portfolioMappers';
import type {
  GalleryItem,
  HomeSection,
  NewsletterStats,
  NewsletterSubscriber,
  Post,
  Product,
  SchedulingSettings,
  Service,
  SiteSettings,
  Testimonial,
} from '../types';

const api = axios.create({
  baseURL: API_BASE,
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

      const newAccessToken =
        payload?.accessToken ||
        payload?.token ||
        body?.accessToken ||
        body?.token;
      const newRefreshToken =
        payload?.refreshToken || body?.refreshToken || refreshToken;

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
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/admin/login')
      ) {
        window.location.href = '/admin/login';
      }
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

/** Unwrap `{ success, data }` responses from admin newsletter endpoints */
function unwrapSuccessBody<T>(body: unknown): T {
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    (body as { success: boolean }).success &&
    'data' in body
  ) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export const publicApi = {
  getSettings: () =>
    api.get<SiteSettings>('/settings').then((res) => res.data),
  getScheduling: () =>
    api
      .get<SchedulingSettings>('/settings/scheduling')
      .then((res) => res.data),
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
  getPosts: () => api.get<Post[]>('/posts').then((res) => res.data),
  getPost: (slug: string) =>
    api.get<Post>(`/posts/${slug}`).then((res) => res.data),
  getGallery: () =>
    api.get('/gallery').then((res) => normalizePortfolioList(res.data)),
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
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const body = res.data;
    const payload = body?.data || body;

    const token =
      payload?.accessToken ||
      payload?.token ||
      body?.accessToken ||
      body?.token;
    const refreshToken = payload?.refreshToken || body?.refreshToken || token;
    const adminData = payload?.admin ||
      payload?.user ||
      body?.admin ||
      body?.user || { id: '1', email, name: 'Admin' };

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
  getSettings: () => api.get<SiteSettings>('/settings'),
  updateSettings: (data: Partial<SiteSettings>) =>
    api.put<SiteSettings>('/settings', data),
  getSchedulingSettings: async (): Promise<SchedulingSettings> => {
    const res = await api.get<SchedulingSettings>('/admin/settings/scheduling');
    return res.data;
  },
  updateSchedulingSettings: async (
    data: Omit<SchedulingSettings, 'id' | 'bookingUrl'>,
  ): Promise<SchedulingSettings> => {
    const res = await api.put<SchedulingSettings>(
      '/admin/settings/scheduling',
      data,
    );
    return res.data;
  },
  getSections: () => api.get<HomeSection[]>('/pages'),
  updateSection: (key: string, data: Partial<HomeSection>) =>
    api.put(`/pages/${key}`, data),
  getServices: () => api.get<Service[]>('/services?all=1'),
  createService: (data: Partial<Service>) => api.post('/services', data),
  updateService: (id: string, data: Partial<Service>) =>
    api.put(`/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/services/${id}`),
  getPosts: () => api.get<Post[]>('/posts?all=1'),
  listPostsAdmin: async (): Promise<Post[]> => {
    const res = await api.get('/posts?all=1');
    const unwrapped = unwrapSuccessBody<Post[]>(res.data);
    if (Array.isArray(unwrapped)) return unwrapped;
    return Array.isArray(res.data) ? (res.data as Post[]) : [];
  },
  createPost: async (data: Partial<Post> | Record<string, unknown>): Promise<Post> => {
    const res = await api.post('/posts', data);
    return unwrapSuccessBody<Post>(res.data);
  },
  updatePost: async (id: string, data: Partial<Post> | Record<string, unknown>): Promise<Post> => {
    const res = await api.put(`/posts/${id}`, data);
    return unwrapSuccessBody<Post>(res.data);
  },
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
  listSubscribers: async (): Promise<NewsletterSubscriber[]> => {
    const res = await api.get('/newsletter');
    const data = unwrapSuccessBody<NewsletterSubscriber[]>(res.data);
    return Array.isArray(data) ? data : [];
  },
  getNewsletterStats: async (): Promise<NewsletterStats> => {
    const res = await api.get('/newsletter/stats');
    return unwrapSuccessBody<NewsletterStats>(res.data);
  },
  deleteSubscriber: (id: string) => api.delete(`/newsletter/${id}`),
  exportSubscribersCsv: async (): Promise<Blob> => {
    const res = await api.get('/newsletter/export', { responseType: 'blob' });
    return res.data;
  },
  getMessages: () => api.get('/contact'),
  markRead: (id: string) => api.patch(`/contact/${id}/read`),
  deleteMessage: (id: string) => api.delete(`/contact/${id}`),
  getTestimonials: () => api.get<Testimonial[]>('/testimonials?all=1'),
  createTestimonial: (data: Partial<Testimonial>) =>
    api.post('/testimonials', data),
  updateTestimonial: (id: string, data: Partial<Testimonial>) =>
    api.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => api.delete(`/testimonials/${id}`),
  getCalendlyAuthUrl: () => api.get<{ url: string }>('/calendly/auth-url'),
  getCalendlyStatus: () =>
    api.get<{
      connected: boolean;
      calendlyUrl: string;
      calendlyConnectedAt: string | null;
    }>('/calendly/status'),
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
