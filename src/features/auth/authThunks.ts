import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  clearStoredSession,
  loadStoredSession,
  persistUser,
  parseRoleFromToken,
} from '../../services/authStorage';
import { getCurrentUserRequest, loginRequest, logoutRequest } from './authApi';
import { mapLoginResponse, mapMeResponse } from './authMappers';
import type { AuthSession, LoginCredentials } from './authTypes';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const res = await loginRequest(credentials);
      return mapLoginResponse(res.data, credentials);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Invalid email or password.';
      return rejectWithValue(message);
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  const { refreshToken } = loadStoredSession();
  try {
    if (refreshToken) {
      await logoutRequest(refreshToken);
    }
  } catch {
    // Clear local session even if server logout fails.
  }
});

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const session = loadStoredSession();
  if (!session.accessToken) {
    return { session: null };
  }

  try {
    const res = await getCurrentUserRequest();
    const user = mapMeResponse(res.data);
    const role = user.role ?? parseRoleFromToken(session.accessToken!);
    const mergedUser = { ...user, ...(role ? { role } : {}) };
    persistUser(mergedUser);
    return {
      session: {
        accessToken: session.accessToken!,
        refreshToken: session.refreshToken ?? session.accessToken!,
        user: mergedUser,
      } satisfies AuthSession,
    };
  } catch {
    if (session.user) {
      return {
        session: {
          accessToken: session.accessToken!,
          refreshToken: session.refreshToken ?? session.accessToken!,
          user: session.user,
        } satisfies AuthSession,
      };
    }
    clearStoredSession();
    return { session: null };
  }
});
