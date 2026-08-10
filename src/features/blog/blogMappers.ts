import { isAxiosError } from 'axios';
import type { Post } from '../../types';
import {
  postToBlogItem,
  type BlogPostItem,
} from '../../lib/blogMappers';

/** Unwrap `{ success, data }` admin API responses. */
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

export function mapPostsListResponse(body: unknown): BlogPostItem[] {
  return unwrapPostsList(body).map(postToBlogItem);
}

export function mapPostResponse(body: unknown): BlogPostItem {
  return postToBlogItem(unwrapPost(body));
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
