import type { RootState } from '../../store/store';

export const selectNewsletter = (state: RootState) => state.newsletter;

export const selectNewsletterSubscribers = (state: RootState) =>
  state.newsletter.subscribers;

export const selectNewsletterStats = (state: RootState) => state.newsletter.stats;

export const selectNewsletterStatus = (state: RootState) => state.newsletter.status;

export const selectNewsletterError = (state: RootState) => state.newsletter.error;

export const selectNewsletterActionError = (state: RootState) =>
  state.newsletter.actionError;

export const selectNewsletterExportStatus = (state: RootState) =>
  state.newsletter.exportStatus;

export const selectNewsletterIsLoading = (state: RootState) =>
  state.newsletter.status === 'loading';

export const selectNewsletterIsExporting = (state: RootState) =>
  state.newsletter.exportStatus === 'loading';
