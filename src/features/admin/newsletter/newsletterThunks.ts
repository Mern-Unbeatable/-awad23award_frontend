import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteSubscriberRequest,
  exportSubscribersCsvRequest,
  getNewsletterStatsRequest,
  listSubscribersRequest,
} from './newsletterApi';
import {
  getNewsletterErrorMessage,
  mapNewsletterStatsResponse,
  mapSubscribersResponse,
} from './newsletterMappers';

export const fetchNewsletterData = createAsyncThunk(
  'adminNewsletter/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const [listRes, statsRes] = await Promise.all([
        listSubscribersRequest(),
        getNewsletterStatsRequest(),
      ]);
      return {
        subscribers: mapSubscribersResponse(listRes.data),
        stats: mapNewsletterStatsResponse(statsRes.data),
      };
    } catch (err) {
      return rejectWithValue(
        getNewsletterErrorMessage(err, 'Failed to load newsletter subscribers.'),
      );
    }
  },
);

export const deleteNewsletterSubscriber = createAsyncThunk(
  'adminNewsletter/deleteSubscriber',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteSubscriberRequest(id);
      const statsRes = await getNewsletterStatsRequest();
      return {
        id,
        stats: mapNewsletterStatsResponse(statsRes.data),
      };
    } catch (err) {
      return rejectWithValue(
        getNewsletterErrorMessage(err, 'Failed to delete subscriber.'),
      );
    }
  },
);

export const exportNewsletterCsv = createAsyncThunk(
  'adminNewsletter/exportCsv',
  async (_, { rejectWithValue }) => {
    try {
      const res = await exportSubscribersCsvRequest();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        getNewsletterErrorMessage(err, 'Failed to export subscribers.'),
      );
    }
  },
);
