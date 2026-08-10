import { useEffect } from 'react';
import { useAuth } from './authHooks';

/** Hydrates auth state from storage and refreshes user from /auth/me when a token exists. */
export function AuthBootstrap() {
  const { initialize, initialized } = useAuth();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  return null;
}
