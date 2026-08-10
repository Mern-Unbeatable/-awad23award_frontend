import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createPortfolioItemRequest,
  deletePortfolioItemRequest,
  listPortfolioRequest,
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
  'adminPortfolio/fetchItems',
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

export const createPortfolioItem = createAsyncThunk(
  'adminPortfolio/createItem',
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
  'adminPortfolio/updateItem',
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
  'adminPortfolio/deleteItem',
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
