import { createSlice } from '@reduxjs/toolkit';
import type { NewsletterStats, NewsletterSubscriber } from '../../types';
import {
  EMPTY_NEWSLETTER_STATS,
  type NewsletterStatus,
} from './newsletterTypes';
import {
  deleteNewsletterSubscriber,
  exportNewsletterCsv,
  fetchNewsletterData,
} from './newsletterThunks';

export interface NewsletterState {
  subscribers: NewsletterSubscriber[];
  stats: NewsletterStats;
  status: NewsletterStatus;
  error: string | null;
  actionError: string | null;
  exportStatus: NewsletterStatus;
}

const initialState: NewsletterState = {
  subscribers: [],
  stats: EMPTY_NEWSLETTER_STATS,
  status: 'idle',
  error: null,
  actionError: null,
  exportStatus: 'idle',
};

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    clearNewsletterActionError(state) {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsletterData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNewsletterData.fulfilled, (state, action) => {
        state.subscribers = action.payload.subscribers;
        state.stats = action.payload.stats;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchNewsletterData.rejected, (state, action) => {
        state.subscribers = [];
        state.stats = EMPTY_NEWSLETTER_STATS;
        state.status = 'error';
        state.error =
          (action.payload as string) || 'Failed to load newsletter subscribers.';
      })
      .addCase(deleteNewsletterSubscriber.fulfilled, (state, action) => {
        state.subscribers = state.subscribers.filter(
          (s) => s.id !== action.payload.id,
        );
        state.stats = action.payload.stats;
        state.actionError = null;
      })
      .addCase(deleteNewsletterSubscriber.rejected, (state, action) => {
        state.actionError =
          (action.payload as string) || 'Failed to delete subscriber.';
      })
      .addCase(exportNewsletterCsv.pending, (state) => {
        state.exportStatus = 'loading';
        state.actionError = null;
      })
      .addCase(exportNewsletterCsv.fulfilled, (state) => {
        state.exportStatus = 'idle';
        state.actionError = null;
      })
      .addCase(exportNewsletterCsv.rejected, (state, action) => {
        state.exportStatus = 'idle';
        state.actionError =
          (action.payload as string) || 'Failed to export subscribers.';
      });
  },
});

export const { clearNewsletterActionError } = newsletterSlice.actions;
export default newsletterSlice.reducer;
