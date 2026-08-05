
const KEYS = {
  accessToken: 'awad_access_token',
  refreshToken: 'awad_refresh_token',
  admin: 'awad_admin',
} as const;


export interface AdminInfo {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  admin: AdminInfo;
}


export function saveSession(session: AuthSession): void {
  localStorage.setItem(KEYS.accessToken, session.accessToken);
  localStorage.setItem(KEYS.refreshToken, session.refreshToken);
  localStorage.setItem(KEYS.admin, JSON.stringify(session.admin));
}


export function getAccessToken(): string | null {
  const token = localStorage.getItem(KEYS.accessToken);
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') return null;
  return token;
}

export function getRefreshToken(): string | null {
  const token = localStorage.getItem(KEYS.refreshToken);
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') return null;
  return token;
}


export function getAdmin(): AdminInfo | null {
  const raw = localStorage.getItem(KEYS.admin);
  if (!raw || raw === 'undefined' || raw === 'null') return null;
  try {
    return JSON.parse(raw) as AdminInfo;
  } catch {
    return null;
  }
}


export function isLoggedIn(): boolean {
  return getAccessToken() !== null;
}


export function clearSession(): void {
  localStorage.removeItem(KEYS.accessToken);
  localStorage.removeItem(KEYS.refreshToken);
  localStorage.removeItem(KEYS.admin);
}

export function updateTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(KEYS.accessToken, accessToken);
  localStorage.setItem(KEYS.refreshToken, refreshToken);
}
