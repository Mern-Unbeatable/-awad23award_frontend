import { parseRoleFromToken } from '../../services/authStorage';
import type { AuthSession, AuthUser, UserRole } from './authTypes';

function unwrapPayload(body: unknown): Record<string, unknown> {
  if (body && typeof body === 'object' && 'data' in body) {
    const record = body as Record<string, unknown>;
    if (record.data && typeof record.data === 'object') {
      return record.data as Record<string, unknown>;
    }
  }
  return (body as Record<string, unknown>) ?? {};
}

export function mapMeResponse(body: unknown): AuthUser {
  const payload = unwrapPayload(body);
  const role =
    payload.role === 'ADMIN' || payload.role === 'EDITOR'
      ? (payload.role as UserRole)
      : undefined;

  return {
    id: String(payload.id ?? ''),
    email: String(payload.email ?? ''),
    name: String(payload.name ?? 'Admin'),
    ...(role ? { role } : {}),
  };
}

export function mapLoginResponse(
  body: unknown,
  credentials: { email: string },
): AuthSession {
  const record = (body as Record<string, unknown>) ?? {};
  const payload = unwrapPayload(body);

  const token =
    (payload.accessToken as string | undefined) ||
    (payload.token as string | undefined) ||
    (record.accessToken as string | undefined) ||
    (record.token as string | undefined);

  const refreshToken =
    (payload.refreshToken as string | undefined) ||
    (record.refreshToken as string | undefined) ||
    token;

  const adminData =
    (payload.admin as Record<string, unknown> | undefined) ||
    (payload.user as Record<string, unknown> | undefined) ||
    (record.admin as Record<string, unknown> | undefined) ||
    (record.user as Record<string, unknown> | undefined) ||
    { id: '1', email: credentials.email, name: 'Admin' };

  if (!token || typeof token !== 'string') {
    throw new Error('No valid access token received from backend server.');
  }

  const role =
    adminData.role === 'ADMIN' || adminData.role === 'EDITOR'
      ? (adminData.role as UserRole)
      : parseRoleFromToken(token);

  const user: AuthUser = {
    id: String(adminData.id),
    email: String(adminData.email),
    name: String(adminData.name ?? 'Admin'),
    ...(role ? { role } : {}),
  };

  return {
    accessToken: token,
    refreshToken: String(refreshToken),
    user,
  };
}
