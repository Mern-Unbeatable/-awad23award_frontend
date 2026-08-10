export type UserRole = 'ADMIN' | 'EDITOR';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
