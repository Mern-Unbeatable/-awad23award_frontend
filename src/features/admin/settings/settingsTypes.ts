import type { SchedulingPlatform } from '../../../types';

export type SettingsStatus = 'idle' | 'loading' | 'error';

export type SchedulingFormState = {
  platform: SchedulingPlatform;
  isEnabled: boolean;
  calendlyUrl?: string;
  calComUsername?: string;
  savvyCalUsername?: string;
  acuityUserId?: string;
  customLink?: string;
  buttonText: string;
  buttonColor?: string | null;
};

export type SchedulingUpdatePayload = Omit<SchedulingFormState, never>;

export const DEFAULT_SCHEDULING_FORM: SchedulingFormState = {
  platform: 'calendly',
  isEnabled: false,
  buttonText: 'Book Now',
  buttonColor: '#2563eb',
};
