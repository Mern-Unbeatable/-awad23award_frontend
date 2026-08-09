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
  getSchedulingSettings: () =>
    api.get<SchedulingSettings>('/admin/settings/scheduling'),
  updateSchedulingSettings: (
    data: Omit<SchedulingSettings, 'id' | 'bookingUrl'>,
  ) => api.put<SchedulingSettings>('/admin/settings/scheduling', data),
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
  /** Admin: list all portfolio items (tab-grouped API → flat GalleryItem) */
  listPortfolioAdmin: async (): Promise<GalleryItem[]> => {
    const res = await api.get('/gallery?all=1');
    return normalizePortfolioList(res.data);
  },
  /** Admin: get one item by slug (includes unpublished when all=1) */
  getPortfolioBySlug: async (slug: string): Promise<GalleryItem> => {
    const res = await api.get(`/gallery/${encodeURIComponent(slug)}`, {
      params: { all: '1' },
    });
    return tabbedToGalleryItem(res.data);
  },
  /** Admin: create via tab-grouped POST /gallery (Postman canonical) */
  createPortfolioItem: async (payload: PortfolioTabbedPayload): Promise<GalleryItem> => {
    const res = await api.post('/gallery', payload);
    return tabbedToGalleryItem(res.data);
  },
  /** Admin: partial or full tab-grouped PUT /gallery/:id */
  updatePortfolioItem: async (
    id: string,
    payload: PortfolioTabbedPayload,
  ): Promise<GalleryItem> => {
    const res = await api.put(`/gallery/${id}`, payload);
    return tabbedToGalleryItem(res.data);
  },
  deletePortfolioItem: (id: string) => api.delete(`/gallery/${id}`),
  getMedia: () => api.get('/media'),
  uploadMedia: (file: File, altEn = '', altAr = '') => {
    const form = new FormData();
    form.append('file', file);
    form.append('altEn', altEn);
    form.append('altAr', altAr);
    return api.post('/media/upload', form);
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
