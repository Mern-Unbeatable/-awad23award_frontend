import { isAxiosError } from 'axios';
import type { Post } from '../../../types';

export function unwrapSuccessBody<T>(body: unknown): T {
  if (
    body &&
    typeof body === 'object' &&
    'success' in body &&
    (body as { success: boolean }).success &&
    'data' in body
  ) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export function unwrapPostsList(body: unknown): Post[] {
  const unwrapped = unwrapSuccessBody<Post[]>(body);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (Array.isArray(body)) return body as Post[];
  return [];
}

export function unwrapPost(body: unknown): Post {
  return unwrapSuccessBody<Post>(body);
}

export function mapPublicPostsResponse(body: unknown): Post[] {
  return unwrapPostsList(body);
}

export function mapPublicPostResponse(body: unknown): Post {
  return unwrapPost(body);
}

export function getBlogErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      return String((data as { message: string }).message);
    }
    if (!error.response) {
      return 'Unable to reach the server. Check that the API is running.';
    }
  }

  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;

  return fallback;
}
