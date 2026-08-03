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
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RefreshResponse {
  data: { accessToken: string; refreshToken: string };
}

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retried) {
      return Promise.reject(error);
    }

    original._retried = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await api.post<RefreshResponse>('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = data.data;

      updateTokens(accessToken, newRefreshToken);

      pendingRequests.forEach((cb) => cb(accessToken));
      pendingRequests = [];

      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch {
      clearSession();
      window.location.href = '/admin/login';
      return Promise.reject(error);
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
  subscribe: (email: string, locale: string) =>
    api.post('/newsletter/subscribe', { email, locale, website: '' }),
  contact: (payload: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => api.post('/contact', { ...payload, website: '' }),
};


interface LoginResponse {
  token: string;        
  accessToken: string;  
  refreshToken: string; 
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export const adminApi = {

  login: async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });

    saveSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      admin: data.admin,
    });

    return data;
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
