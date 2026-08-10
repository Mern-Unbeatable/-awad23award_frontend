import { createSlice } from '@reduxjs/toolkit';
import type { GalleryItem } from '../../../types';
import type { PortfolioStatus } from './portfolioTypes';
import { fetchPublicGallery, fetchPublicGalleryItem } from './portfolioThunks';

export interface PublicPortfolioState {
  gallery: GalleryItem[];
  item: GalleryItem | null;
  itemSlug: string | null;
  status: PortfolioStatus;
  itemStatus: PortfolioStatus;
  error: string | null;
  itemError: string | null;
}

const initialState: PublicPortfolioState = {
  gallery: [],
  item: null,
  itemSlug: null,
  status: 'idle',
  itemStatus: 'idle',
  error: null,
  itemError: null,
};

const publicPortfolioSlice = createSlice({
  name: 'publicPortfolio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicGallery.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPublicGallery.fulfilled, (state, action) => {
        state.gallery = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchPublicGallery.rejected, (state, action) => {
        state.gallery = [];
        state.status = 'error';
        state.error =
          (action.payload as string) || 'Failed to load portfolio items.';
      })
      .addCase(fetchPublicGalleryItem.pending, (state, action) => {
        state.itemStatus = 'loading';
        state.itemError = null;
        state.itemSlug = action.meta.arg;
      })
      .addCase(fetchPublicGalleryItem.fulfilled, (state, action) => {
        state.item = action.payload;
        state.itemSlug = action.payload.slug;
        state.itemStatus = 'idle';
        state.itemError = null;
      })
      .addCase(fetchPublicGalleryItem.rejected, (state, action) => {
        state.item = null;
        state.itemStatus = 'error';
        state.itemError =
          (action.payload as string) || 'Failed to load portfolio item.';
      });
  },
});

export default publicPortfolioSlice.reducer;
