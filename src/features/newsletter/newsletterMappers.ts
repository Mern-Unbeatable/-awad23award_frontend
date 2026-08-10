import { isAxiosError } from 'axios';
import type {
  NewsletterStats,
  NewsletterSubscriber,
} from '../../types';

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

export function mapSubscribersResponse(body: unknown): NewsletterSubscriber[] {
  const data = unwrapSuccessBody<NewsletterSubscriber[]>(body);
  return Array.isArray(data) ? data : [];
}

export function mapNewsletterStatsResponse(body: unknown): NewsletterStats {
  return unwrapSuccessBody<NewsletterStats>(body);
}

export function getNewsletterErrorMessage(
  error: unknown,
  fallback: string,
): string {
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
