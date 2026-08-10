import { isAxiosError } from 'axios';
import type {
  SchedulingPlatform,
  SchedulingSettings,
} from '../../../types';
import {
  DEFAULT_SCHEDULING_FORM,
  type SchedulingFormState,
  type SchedulingUpdatePayload,
} from './settingsTypes';

export function mapSchedulingToForm(data: SchedulingSettings): SchedulingFormState {
  return {
    platform: data.platform,
    isEnabled: data.isEnabled,
    calendlyUrl: data.calendlyUrl,
    calComUsername: data.calComUsername,
    savvyCalUsername: data.savvyCalUsername,
    acuityUserId: data.acuityUserId,
    customLink: data.customLink,
    buttonText: data.buttonText || DEFAULT_SCHEDULING_FORM.buttonText,
    buttonColor: data.buttonColor || DEFAULT_SCHEDULING_FORM.buttonColor,
  };
}

export function mapSchedulingResponse(body: unknown): SchedulingSettings {
  return body as SchedulingSettings;
}

export function buildSchedulingPayload(
  settings: SchedulingFormState,
): SchedulingUpdatePayload {
  return {
    platform: settings.platform,
    isEnabled: settings.isEnabled,
    buttonText: settings.buttonText.trim(),
    buttonColor: settings.buttonColor?.trim() || null,
    calendlyUrl:
      settings.platform === 'calendly' ? settings.calendlyUrl?.trim() : undefined,
    calComUsername:
      settings.platform === 'calcom' ? settings.calComUsername?.trim() : undefined,
    savvyCalUsername:
      settings.platform === 'savvycal' ? settings.savvyCalUsername?.trim() : undefined,
    acuityUserId:
      settings.platform === 'acuity' ? settings.acuityUserId?.trim() : undefined,
    customLink:
      settings.platform === 'custom' ? settings.customLink?.trim() : undefined,
  };
}

export function getSchedulingUrl(settings: SchedulingFormState): string | null {
  if (!settings.isEnabled) return null;

  switch (settings.platform) {
    case 'calendly':
      return settings.calendlyUrl?.trim() || null;
    case 'calcom':
      return settings.calComUsername
        ? `https://cal.com/${settings.calComUsername.trim()}`
        : null;
    case 'savvycal':
      return settings.savvyCalUsername
        ? `https://savvycal.com/${settings.savvyCalUsername.trim()}`
        : null;
    case 'acuity':
      return settings.acuityUserId
        ? `https://acuityscheduling.com/schedule.php?owner=${settings.acuityUserId.trim()}`
        : null;
    case 'custom':
      return settings.customLink?.trim() || null;
    default:
      return null;
  }
}

export function validateSchedulingForm(
  settings: SchedulingFormState,
  bookingUrl: string,
): string | null {
  if (!settings.isEnabled) return null;

  if (!bookingUrl) {
    switch (settings.platform) {
      case 'calendly':
        return 'Please enter your Calendly URL.';
      case 'calcom':
        return 'Please enter your Cal.com username.';
      case 'savvycal':
        return 'Please enter your SavvyCal username.';
      case 'acuity':
        return 'Please enter your Acuity user ID.';
      case 'custom':
        return 'Please enter a custom booking link.';
      default:
        return 'Please complete the booking configuration.';
    }
  }

  if (settings.platform === 'calendly' || settings.platform === 'custom') {
    try {
      const parsed = new URL(bookingUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return 'URL must start with http:// or https://';
      }
    } catch {
      return 'Please enter a valid URL.';
    }
  }

  return null;
}

export function getSettingsErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 429) {
      return 'Too many requests. Wait a moment and try again.';
    }
    if (error.response?.status === 401) {
      return 'Session expired. Please log in again.';
    }
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

export function clearPlatformFields(
  platform: SchedulingPlatform,
): Partial<SchedulingFormState> {
  return {
    platform,
    calendlyUrl: undefined,
    calComUsername: undefined,
    savvyCalUsername: undefined,
    acuityUserId: undefined,
    customLink: undefined,
  };
}
