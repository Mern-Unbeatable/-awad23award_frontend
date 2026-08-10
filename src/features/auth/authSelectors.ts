import type { RootState } from '../../store/store';
import { parseRoleFromToken } from '../../services/authStorage';

export const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectAuthInitialized = (state: RootState) => state.auth.initialized;

export const selectUserRole = (state: RootState) => {
  const user = state.auth.user;
  if (user?.role) return user.role;

  const token = state.auth.accessToken;
  if (!token) return null;

  return parseRoleFromToken(token) ?? null;
};
