import { isAxiosError } from 'axios';
import type { SchedulingSettings } from '../../../types';

export function mapSchedulingResponse(body: unknown): SchedulingSettings {
  return body as SchedulingSettings;
}

export function getSchedulingErrorMessage(
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
