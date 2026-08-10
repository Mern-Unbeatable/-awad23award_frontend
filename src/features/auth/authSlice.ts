import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  clearStoredSession,
  loadStoredSession,
  persistSession,
  persistTokens,
} from '../../services/authStorage';
import type { AuthUser } from './authTypes';
import {
  initializeAuth,
  loginUser,
  logoutUser,
} from './authThunks';

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'initializing' | 'error';
  error: string | null;
  initialized: boolean;
}

const stored = loadStoredSession();

const initialState: AuthState = {
  user: stored.user,
  accessToken: stored.accessToken,
  refreshToken: stored.refreshToken,
  isAuthenticated: Boolean(stored.accessToken),
  status: 'idle',
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      persistTokens(
        action.payload.accessToken,
        action.payload.refreshToken,
      );
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      clearStoredSession();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const session = action.payload;
        state.user = session.user;
        state.accessToken = session.accessToken;
        state.refreshToken = session.refreshToken;
        state.isAuthenticated = true;
        state.status = 'idle';
        state.error = null;
        persistSession(session);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'error';
        state.error =
          (action.payload as string) || 'Invalid email or password.';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
        clearStoredSession();
      })
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'initializing';
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.initialized = true;
        state.status = 'idle';
        const session = action.payload.session;
        if (session) {
          state.user = session.user;
          state.accessToken = session.accessToken;
          state.refreshToken = session.refreshToken;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.initialized = true;
        state.status = 'idle';
      });
  },
});

export const { setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
