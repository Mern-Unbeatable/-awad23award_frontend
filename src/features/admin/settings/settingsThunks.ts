import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getSchedulingSettingsRequest,
  updateSchedulingSettingsRequest,
} from './settingsApi';
import {
  buildSchedulingPayload,
  getSettingsErrorMessage,
  getSchedulingUrl,
  mapSchedulingResponse,
  mapSchedulingToForm,
  validateSchedulingForm,
} from './settingsMappers';
import type { SchedulingFormState } from './settingsTypes';

export const fetchSchedulingSettings = createAsyncThunk(
  'adminSettings/fetchScheduling',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSchedulingSettingsRequest();
      const data = mapSchedulingResponse(res.data);
      return {
        form: mapSchedulingToForm(data),
        bookingUrl: data.bookingUrl || '',
      };
    } catch (err) {
      return rejectWithValue(
        getSettingsErrorMessage(err, 'Failed to load scheduling settings.'),
      );
    }
  },
);

export const saveSchedulingSettings = createAsyncThunk(
  'adminSettings/saveScheduling',
  async (form: SchedulingFormState, { rejectWithValue }) => {
    const resolvedUrl = form.isEnabled ? getSchedulingUrl(form) || '' : '';
    const validationError = validateSchedulingForm(form, resolvedUrl);
    if (validationError) {
      return rejectWithValue(validationError);
    }

    try {
      const payload = buildSchedulingPayload(form);
      const res = await updateSchedulingSettingsRequest(payload);
      const data = mapSchedulingResponse(res.data);
      return {
        form: mapSchedulingToForm(data),
        bookingUrl: data.bookingUrl || '',
        settings: data,
      };
    } catch (err) {
      return rejectWithValue(
        getSettingsErrorMessage(err, 'Failed to save settings. Please try again.'),
      );
    }
  },
);
