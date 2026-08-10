import axios from 'axios';
import { API_BASE } from '../lib/env';
import { AUTH_ENDPOINTS } from './endpoints/auth.endpoints';
import { clearStoredSession, loadStoredSession, persistTokens } from './authStorage';

interface AuthStoreBridge {
  getState(): {
    auth: {
      accessToken: string | null;
      refreshToken: string | null;
    };
  };
}

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 12000,
});

let appStore: AuthStoreBridge | null = null;

type TokenHandler = (tokens: {
  accessToken: string;
  refreshToken: string;
}) => void;
type ClearHandler = () => void;

let onTokensRefreshed: TokenHandler | null = null;
let onAuthClear: ClearHandler | null = null;

export function injectStore(store: AuthStoreBridge) {
  appStore = store;
}

export function setAuthInterceptHandlers(handlers: {
  onTokensRefreshed: TokenHandler;
  onAuthClear: ClearHandler;
}) {
  onTokensRefreshed = handlers.onTokensRefreshed;
  onAuthClear = handlers.onAuthClear;
}

function getAccessToken(): string | null {
  if (appStore) {
    return appStore.getState().auth.accessToken;
  }
  return loadStoredSession().accessToken;
}

function getRefreshToken(): string | null {
  if (appStore) {
    return appStore.getState().auth.refreshToken;
  }
  return loadStoredSession().refreshToken;
}

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      original._retried ||
      original.url?.includes(AUTH_ENDPOINTS.LOGIN) ||
      original.url?.includes(AUTH_ENDPOINTS.REFRESH)
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
          resolve(axiosInstance(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');

      const res = await axiosInstance.post(AUTH_ENDPOINTS.REFRESH, {
        refreshToken,
      });
      const body = res.data;
      const payload =
        body && typeof body === 'object' && 'data' in body
          ? (body as { data: Record<string, unknown> }).data
          : body;

      const newAccessToken =
        (payload?.accessToken as string | undefined) ||
        (payload?.token as string | undefined) ||
        (body?.accessToken as string | undefined) ||
        (body?.token as string | undefined);
      const newRefreshToken =
        (payload?.refreshToken as string | undefined) ||
        (body?.refreshToken as string | undefined) ||
        refreshToken;

      if (!newAccessToken) throw new Error('Refresh failed to return token');

      const tokens = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

      if (onTokensRefreshed) {
        onTokensRefreshed(tokens);
      } else {
        persistTokens(newAccessToken, newRefreshToken);
      }

      pendingRequests.forEach((cb) => cb(newAccessToken));
      pendingRequests = [];

      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(original);
    } catch (refreshErr) {
      pendingRequests.forEach((cb) => cb(''));
      pendingRequests = [];

      if (onAuthClear) {
        onAuthClear();
      } else {
        clearStoredSession();
      }

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
