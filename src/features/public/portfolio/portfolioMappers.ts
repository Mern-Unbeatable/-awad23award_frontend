import { isAxiosError } from 'axios';
import { resolveGalleryItem } from '../../../lib/api';
import {
  normalizePortfolioList,
  tabbedToGalleryItem,
} from '../../../lib/portfolioMappers';
import type { GalleryItem } from '../../../types';

export function mapPortfolioListResponse(body: unknown): GalleryItem[] {
  return normalizePortfolioList(body).map(resolveGalleryItem);
}

export function mapPortfolioItemResponse(body: unknown): GalleryItem {
  return resolveGalleryItem(tabbedToGalleryItem(body));
}

export function getPortfolioErrorMessage(
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
