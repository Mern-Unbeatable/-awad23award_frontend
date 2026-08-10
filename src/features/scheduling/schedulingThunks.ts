import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getSchedulingSettingsRequest,
  updateSchedulingSettingsRequest,
} from './schedulingApi';
import {
  buildSchedulingPayload,
  getSchedulingErrorMessage,
  getSchedulingUrl,
  mapSchedulingResponse,
  mapSchedulingToForm,
  validateSchedulingForm,
} from './schedulingMappers';
import type { SchedulingFormState } from './schedulingTypes';

export const fetchSchedulingSettings = createAsyncThunk(
  'scheduling/fetchSettings',
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
        getSchedulingErrorMessage(err, 'Failed to load scheduling settings.'),
      );
    }
  },
);

export const saveSchedulingSettings = createAsyncThunk(
  'scheduling/saveSettings',
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
        getSchedulingErrorMessage(err, 'Failed to save settings. Please try again.'),
      );
    }
  },
);
