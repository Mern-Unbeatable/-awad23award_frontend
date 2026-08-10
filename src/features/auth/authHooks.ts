import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loginUser,
  logoutUser,
  initializeAuth,
} from './authThunks';
import {
  selectAuthError,
  selectAuthInitialized,
  selectAuthStatus,
  selectAuthUser,
  selectIsAuthenticated,
  selectUserRole,
} from './authSelectors';
import type { LoginCredentials } from './authTypes';

export function useAuth() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const role = useAppSelector(selectUserRole);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const initialized = useAppSelector(selectAuthInitialized);

  const login = useCallback(
    (credentials: LoginCredentials) =>
      dispatch(loginUser(credentials)).unwrap(),
    [dispatch],
  );

  const logout = useCallback(() => dispatch(logoutUser()).unwrap(), [dispatch]);

  const initialize = useCallback(() => dispatch(initializeAuth()), [dispatch]);

  return {
    isAuthenticated,
    user,
    role,
    status,
    error,
    initialized,
    login,
    logout,
    initialize,
  };
}
