import { createAsyncThunk } from '@reduxjs/toolkit';
import { getSchedulingRequest } from './schedulingApi';
import {
  getSchedulingErrorMessage,
  mapSchedulingResponse,
} from './schedulingMappers';

export const fetchPublicScheduling = createAsyncThunk(
  'publicScheduling/fetchScheduling',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSchedulingRequest();
      return mapSchedulingResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getSchedulingErrorMessage(err, 'Failed to load scheduling settings.'),
      );
    }
  },
);
