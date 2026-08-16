/**
 * Central API / server URL configuration.
 *
 * Set VITE_SERVER_URL in web/.env (backend origin, no trailing slash).
 * API requests go to {VITE_SERVER_URL}/api
 */

const DEFAULT_SERVER_URL = 'https://awad23server.maktechgroup.tech';
const API_PATH = '/api';

function normalizeOrigin(url: string) {
  return url.trim().replace(/\/+$/, '');
}

const serverUrl = normalizeOrigin(
  import.meta.env.VITE_SERVER_URL || DEFAULT_SERVER_URL,
);

/** Backend origin (no trailing slash). Used for media/upload URLs. */
export const SERVER_URL = serverUrl;

/** Axios baseURL — relative in dev (Vite proxy), absolute in production builds */
export const API_BASE = import.meta.env.DEV
  ? API_PATH
  : `${serverUrl}${API_PATH}`;

/** Google reCAPTCHA v2 site key (public). Secret key stays on the server. */
export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '';
