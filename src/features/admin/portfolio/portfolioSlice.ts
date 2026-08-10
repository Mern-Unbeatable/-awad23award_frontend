import { createSlice } from '@reduxjs/toolkit';
import type { GalleryItem } from '../../../types';
import type { PortfolioStatus } from './portfolioTypes';
import {
  createPortfolioItem,
  deletePortfolioItem,
  fetchAdminPortfolio,
  updatePortfolioItem,
} from './portfolioThunks';

export interface AdminPortfolioState {
  items: GalleryItem[];
  status: PortfolioStatus;
  error: string | null;
  saveStatus: PortfolioStatus;
  saveError: string | null;
}

const initialState: AdminPortfolioState = {
  items: [],
  status: 'idle',
  error: null,
  saveStatus: 'idle',
  saveError: null,
};

const adminPortfolioSlice = createSlice({
  name: 'adminPortfolio',
  initialState,
  reducers: {
    clearPortfolioSaveError(state) {
      state.saveError = null;
      state.saveStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPortfolio.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminPortfolio.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchAdminPortfolio.rejected, (state, action) => {
        state.items = [];
        state.status = 'error';
        state.error =
          (action.payload as string) || 'Failed to load portfolio items.';
      })
      .addCase(createPortfolioItem.pending, (state) => {
        state.saveStatus = 'loading';
        state.saveError = null;
      })
      .addCase(createPortfolioItem.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
        state.saveStatus = 'idle';
        state.saveError = null;
      })
      .addCase(createPortfolioItem.rejected, (state, action) => {
        state.saveStatus = 'error';
        state.saveError =
          (action.payload as string) || 'Failed to save portfolio item.';
      })
      .addCase(updatePortfolioItem.pending, (state) => {
        state.saveStatus = 'loading';
        state.saveError = null;
      })
      .addCase(updatePortfolioItem.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
        state.saveStatus = 'idle';
        state.saveError = null;
      })
      .addCase(updatePortfolioItem.rejected, (state, action) => {
        state.saveStatus = 'error';
        state.saveError =
          (action.payload as string) || 'Failed to save portfolio item.';
      })
      .addCase(deletePortfolioItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearPortfolioSaveError } = adminPortfolioSlice.actions;
export default adminPortfolioSlice.reducer;
