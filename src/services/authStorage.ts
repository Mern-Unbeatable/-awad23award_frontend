import type { AuthSession, AuthUser, UserRole } from '../features/auth/authTypes';

const KEYS = {
  accessToken: 'awad_access_token',
  refreshToken: 'awad_refresh_token',
  admin: 'awad_admin',
} as const;

function normalizeRole(value: unknown): UserRole | undefined {
  if (value === 'ADMIN' || value === 'EDITOR') return value;
  return undefined;
}

export function parseRoleFromToken(token: string): UserRole | undefined {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return undefined;
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json) as { role?: unknown };
    return normalizeRole(payload.role);
  } catch {
    return undefined;
  }
}

export function loadStoredSession(): Partial<AuthSession> & {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
} {
  const accessToken = localStorage.getItem(KEYS.accessToken);
  const refreshToken = localStorage.getItem(KEYS.refreshToken);
  const rawUser = localStorage.getItem(KEYS.admin);

  let user: AuthUser | null = null;
  if (rawUser && rawUser !== 'undefined' && rawUser !== 'null') {
    try {
      user = JSON.parse(rawUser) as AuthUser;
    } catch {
      user = null;
    }
  }

  const validAccess =
    accessToken &&
    accessToken !== 'undefined' &&
    accessToken !== 'null' &&
    accessToken.trim() !== ''
      ? accessToken
      : null;

  const validRefresh =
    refreshToken &&
    refreshToken !== 'undefined' &&
    refreshToken !== 'null' &&
    refreshToken.trim() !== ''
      ? refreshToken
      : null;

  return {
    accessToken: validAccess,
    refreshToken: validRefresh,
    user,
  };
}

export function persistSession(session: AuthSession): void {
  localStorage.setItem(KEYS.accessToken, session.accessToken);
  localStorage.setItem(KEYS.refreshToken, session.refreshToken);
  localStorage.setItem(KEYS.admin, JSON.stringify(session.user));
}

export function persistTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(KEYS.accessToken, accessToken);
  localStorage.setItem(KEYS.refreshToken, refreshToken);
}

export function persistUser(user: AuthUser): void {
  localStorage.setItem(KEYS.admin, JSON.stringify(user));
}

export function clearStoredSession(): void {
  localStorage.removeItem(KEYS.accessToken);
  localStorage.removeItem(KEYS.refreshToken);
  localStorage.removeItem(KEYS.admin);
}
