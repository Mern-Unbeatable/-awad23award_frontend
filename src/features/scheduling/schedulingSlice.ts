import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_SCHEDULING_FORM,
  type SchedulingFormState,
  type SchedulingStatus,
} from './schedulingTypes';
import {
  clearPlatformFields,
} from './schedulingMappers';
import type { SchedulingPlatform } from '../../types';
import {
  fetchSchedulingSettings,
  saveSchedulingSettings,
} from './schedulingThunks';

export interface SchedulingState {
  form: SchedulingFormState;
  bookingUrl: string;
  status: SchedulingStatus;
  error: string | null;
  saveStatus: SchedulingStatus;
  saveError: string | null;
  saveSuccessMessage: string | null;
}

const initialState: SchedulingState = {
  form: DEFAULT_SCHEDULING_FORM,
  bookingUrl: '',
  status: 'idle',
  error: null,
  saveStatus: 'idle',
  saveError: null,
  saveSuccessMessage: null,
};

const schedulingSlice = createSlice({
  name: 'scheduling',
  initialState,
  reducers: {
    patchSchedulingForm(
      state,
      action: PayloadAction<Partial<SchedulingFormState>>,
    ) {
      state.form = { ...state.form, ...action.payload };
      state.saveSuccessMessage = null;
    },
    setSchedulingPlatform(state, action: PayloadAction<SchedulingPlatform>) {
      state.form = { ...state.form, ...clearPlatformFields(action.payload) };
      state.saveSuccessMessage = null;
    },
    clearSchedulingMessages(state) {
      state.saveError = null;
      state.saveSuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedulingSettings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedulingSettings.fulfilled, (state, action) => {
        state.form = action.payload.form;
        state.bookingUrl = action.payload.bookingUrl;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchSchedulingSettings.rejected, (state, action) => {
        state.status = 'error';
        state.error =
          (action.payload as string) || 'Failed to load scheduling settings.';
      })
      .addCase(saveSchedulingSettings.pending, (state) => {
        state.saveStatus = 'loading';
        state.saveError = null;
        state.saveSuccessMessage = null;
      })
      .addCase(saveSchedulingSettings.fulfilled, (state, action) => {
        state.form = action.payload.form;
        state.bookingUrl = action.payload.bookingUrl;
        state.saveStatus = 'idle';
        state.saveError = null;
        state.saveSuccessMessage = 'Scheduling settings saved successfully.';
      })
      .addCase(saveSchedulingSettings.rejected, (state, action) => {
        state.saveStatus = 'error';
        state.saveError =
          (action.payload as string) || 'Failed to save settings. Please try again.';
      });
  },
});

export const {
  patchSchedulingForm,
  setSchedulingPlatform,
  clearSchedulingMessages,
} = schedulingSlice.actions;
export default schedulingSlice.reducer;
