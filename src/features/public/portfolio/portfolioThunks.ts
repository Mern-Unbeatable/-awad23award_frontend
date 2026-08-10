import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getPortfolioItemBySlugRequest,
  listPortfolioRequest,
} from './portfolioApi';
import {
  getPortfolioErrorMessage,
  mapPortfolioItemResponse,
  mapPortfolioListResponse,
} from './portfolioMappers';

export const fetchPublicGallery = createAsyncThunk(
  'publicPortfolio/fetchGallery',
  async (_, { rejectWithValue }) => {
    try {
      const res = await listPortfolioRequest();
      return mapPortfolioListResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getPortfolioErrorMessage(err, 'Failed to load portfolio items.'),
      );
    }
  },
);

export const fetchPublicGalleryItem = createAsyncThunk(
  'publicPortfolio/fetchGalleryItem',
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await getPortfolioItemBySlugRequest(slug);
      return mapPortfolioItemResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getPortfolioErrorMessage(err, 'Failed to load portfolio item.'),
      );
    }
  },
);
