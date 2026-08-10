import type { RootState } from '../../../store/store';

export const selectPublicScheduling = (state: RootState) =>
  state.publicScheduling.settings;

export const selectPublicSchedulingIsLoading = (state: RootState) =>
  state.publicScheduling.status === 'loading';

export const selectPublicSchedulingError = (state: RootState) =>
  state.publicScheduling.error;
