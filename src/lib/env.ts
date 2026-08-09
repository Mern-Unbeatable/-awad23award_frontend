/**
 * Central API / server URL configuration.
 *
 * Set VITE_SERVER_URL in web/.env (backend origin, no trailing slash).
 * API requests go to {VITE_SERVER_URL}/api
 */

const DEFAULT_SERVER_URL = 'http://localhost:4000';
const API_PATH = '/api';

function normalizeOrigin(url: string) {
  return url.trim().replace(/\/+$/, '');
}

const serverUrl = normalizeOrigin(
  import.meta.env.VITE_SERVER_URL || DEFAULT_SERVER_URL,
);

/** Backend origin, e.g. http://localhost:4000 */
export const SERVER_URL = serverUrl;

/** Full API URL, e.g. http://localhost:4000/api */
export const API_URL = `${serverUrl}${API_PATH}`;

/** Axios baseURL — relative in dev (Vite proxy), absolute in production builds */
export const API_BASE = import.meta.env.DEV ? API_PATH : API_URL;
