import { AUTH_ENDPOINTS } from '../../services/endpoints/auth.endpoints';
import { http } from '../../services/http';
import type { LoginCredentials } from './authTypes';

export const loginRequest = (credentials: LoginCredentials) =>
  http.post(AUTH_ENDPOINTS.LOGIN, credentials);

export const logoutRequest = (refreshToken: string) =>
  http.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken });

export const refreshRequest = (refreshToken: string) =>
  http.post(AUTH_ENDPOINTS.REFRESH, { refreshToken });

export const getCurrentUserRequest = () => http.get(AUTH_ENDPOINTS.ME);
