import type { RootState } from '../../store/store';

export const selectScheduling = (state: RootState) => state.scheduling;

export const selectSchedulingForm = (state: RootState) => state.scheduling.form;

export const selectSchedulingBookingUrl = (state: RootState) =>
  state.scheduling.bookingUrl;

export const selectSchedulingStatus = (state: RootState) => state.scheduling.status;

export const selectSchedulingError = (state: RootState) => state.scheduling.error;

export const selectSchedulingSaveStatus = (state: RootState) =>
  state.scheduling.saveStatus;

export const selectSchedulingSaveError = (state: RootState) =>
  state.scheduling.saveError;

export const selectSchedulingSaveSuccessMessage = (state: RootState) =>
  state.scheduling.saveSuccessMessage;

export const selectSchedulingIsLoading = (state: RootState) =>
  state.scheduling.status === 'loading';

export const selectSchedulingIsSaving = (state: RootState) =>
  state.scheduling.saveStatus === 'loading';
