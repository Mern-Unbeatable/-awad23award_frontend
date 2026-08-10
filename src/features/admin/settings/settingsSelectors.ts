import type { RootState } from '../../../store/store';

export const selectSchedulingForm = (state: RootState) => state.adminSettings.form;

export const selectSchedulingBookingUrl = (state: RootState) =>
  state.adminSettings.bookingUrl;

export const selectSchedulingError = (state: RootState) => state.adminSettings.error;

export const selectSchedulingSaveError = (state: RootState) =>
  state.adminSettings.saveError;

export const selectSchedulingSaveSuccessMessage = (state: RootState) =>
  state.adminSettings.saveSuccessMessage;

export const selectSchedulingIsLoading = (state: RootState) =>
  state.adminSettings.status === 'loading';

export const selectSchedulingIsSaving = (state: RootState) =>
  state.adminSettings.saveStatus === 'loading';
