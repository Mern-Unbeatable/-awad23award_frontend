import axios from 'axios';
import { saveSession, getAccessToken, clearSession, getRefreshToken, updateTokens } from './auth';
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
  fallbackGallery,
  fallbackPosts,
  fallbackProducts,
  fallbackScheduling,
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
  getScheduling: () =>
    withFallback(
      async () => (await api.get<SchedulingSettings>('/settings/scheduling')).data,
      fallbackScheduling
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
  getSettings: () => api.get<SiteSettings>('/settings'),
  updateSettings: (data: Partial<SiteSettings>) => api.put<SiteSettings>('/settings', data),
  getSchedulingSettings: () => api.get<SchedulingSettings>('/admin/settings/scheduling'),
  updateSchedulingSettings: (data: Omit<SchedulingSettings, 'id' | 'bookingUrl'>) =>
    api.put<SchedulingSettings>('/admin/settings/scheduling', data),
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
  createPortfolioItem: (data: Partial<GalleryItem>) => api.post('/gallery', data),
  updatePortfolioItem: (id: string, data: Partial<GalleryItem>) => api.put(`/gallery/${id}`, data),
  deleteGalleryItem: (id: string) => api.delete(`/gallery/${id}`),
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
