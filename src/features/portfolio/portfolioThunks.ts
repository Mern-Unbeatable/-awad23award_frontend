import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createPortfolioItemRequest,
  deletePortfolioItemRequest,
  listPortfolioAdminRequest,
  updatePortfolioItemRequest,
} from './portfolioApi';
import {
  getPortfolioErrorMessage,
  mapPortfolioItemResponse,
  mapPortfolioListResponse,
} from './portfolioMappers';
import type {
  CreatePortfolioPayload,
  UpdatePortfolioPayload,
} from './portfolioTypes';

export const fetchAdminPortfolio = createAsyncThunk(
  'portfolio/fetchAdminPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const res = await listPortfolioAdminRequest();
      return mapPortfolioListResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getPortfolioErrorMessage(err, 'Failed to load portfolio items.'),
      );
    }
  },
);

export const createPortfolioItem = createAsyncThunk(
  'portfolio/createItem',
  async (payload: CreatePortfolioPayload, { rejectWithValue }) => {
    try {
      const res = await createPortfolioItemRequest(payload);
      return mapPortfolioItemResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getPortfolioErrorMessage(err, 'Failed to save portfolio item.'),
      );
    }
  },
);

export const updatePortfolioItem = createAsyncThunk(
  'portfolio/updateItem',
  async (
    { id, data }: { id: string; data: UpdatePortfolioPayload },
    { rejectWithValue },
  ) => {
    try {
      const res = await updatePortfolioItemRequest(id, data);
      return mapPortfolioItemResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getPortfolioErrorMessage(err, 'Failed to save portfolio item.'),
      );
    }
  },
);

export const deletePortfolioItem = createAsyncThunk(
  'portfolio/deleteItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePortfolioItemRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        getPortfolioErrorMessage(err, 'Failed to delete portfolio item.'),
      );
    }
  },
);
