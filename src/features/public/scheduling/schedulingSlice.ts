import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SchedulingSettings } from '../../../types';
import type { SchedulingStatus } from './schedulingTypes';
import { fetchPublicScheduling } from './schedulingThunks';

export interface PublicSchedulingState {
  settings: SchedulingSettings | null;
  status: SchedulingStatus;
  error: string | null;
}

const initialState: PublicSchedulingState = {
  settings: null,
  status: 'idle',
  error: null,
};

const publicSchedulingSlice = createSlice({
  name: 'publicScheduling',
  initialState,
  reducers: {
    applyScheduling(state, action: PayloadAction<SchedulingSettings>) {
      state.settings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicScheduling.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPublicScheduling.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchPublicScheduling.rejected, (state, action) => {
        state.status = 'error';
        state.error =
          (action.payload as string) || 'Failed to load scheduling settings.';
      });
  },
});

export const { applyScheduling } = publicSchedulingSlice.actions;
export default publicSchedulingSlice.reducer;
