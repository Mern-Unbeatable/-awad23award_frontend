import type { RootState } from '../../../store/store';

export const selectNewsletter = (state: RootState) => state.adminNewsletter;

export const selectNewsletterSubscribers = (state: RootState) =>
  state.adminNewsletter.subscribers;

export const selectNewsletterStats = (state: RootState) =>
  state.adminNewsletter.stats;

export const selectNewsletterStatus = (state: RootState) =>
  state.adminNewsletter.status;

export const selectNewsletterError = (state: RootState) =>
  state.adminNewsletter.error;

export const selectNewsletterActionError = (state: RootState) =>
  state.adminNewsletter.actionError;

export const selectNewsletterExportStatus = (state: RootState) =>
  state.adminNewsletter.exportStatus;

export const selectNewsletterIsLoading = (state: RootState) =>
  state.adminNewsletter.status === 'loading';

export const selectNewsletterIsExporting = (state: RootState) =>
  state.adminNewsletter.exportStatus === 'loading';
