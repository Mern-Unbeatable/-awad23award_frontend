import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { SchedulingPlatform } from '../../types';
import {
  clearSchedulingMessages,
  patchSchedulingForm,
  setSchedulingPlatform,
} from './schedulingSlice';
import {
  fetchSchedulingSettings,
  saveSchedulingSettings,
} from './schedulingThunks';
import {
  selectSchedulingBookingUrl,
  selectSchedulingError,
  selectSchedulingForm,
  selectSchedulingIsLoading,
  selectSchedulingIsSaving,
  selectSchedulingSaveError,
  selectSchedulingSaveSuccessMessage,
} from './schedulingSelectors';
import type { SchedulingFormState } from './schedulingTypes';
import { getSchedulingUrl } from './schedulingMappers';

export function useSchedulingAdmin() {
  const dispatch = useAppDispatch();
  const form = useAppSelector(selectSchedulingForm);
  const bookingUrl = useAppSelector(selectSchedulingBookingUrl);
  const isLoading = useAppSelector(selectSchedulingIsLoading);
  const isSaving = useAppSelector(selectSchedulingIsSaving);
  const error = useAppSelector(selectSchedulingError);
  const saveError = useAppSelector(selectSchedulingSaveError);
  const saveSuccessMessage = useAppSelector(selectSchedulingSaveSuccessMessage);

  const previewUrl = form.isEnabled
    ? getSchedulingUrl(form) || bookingUrl
    : '';

  const loadSettings = useCallback(
    () => dispatch(fetchSchedulingSettings()).unwrap(),
    [dispatch],
  );

  const saveSettings = useCallback(
    () => dispatch(saveSchedulingSettings(form)).unwrap(),
    [dispatch, form],
  );

  const updateForm = useCallback(
    (patch: Partial<SchedulingFormState>) =>
      dispatch(patchSchedulingForm(patch)),
    [dispatch],
  );

  const changePlatform = useCallback(
    (platform: SchedulingPlatform) =>
      dispatch(setSchedulingPlatform(platform)),
    [dispatch],
  );

  const clearMessages = useCallback(
    () => dispatch(clearSchedulingMessages()),
    [dispatch],
  );

  return {
    form,
    bookingUrl,
    previewUrl,
    isLoading,
    isSaving,
    error,
    saveError,
    saveSuccessMessage,
    loadSettings,
    saveSettings,
    updateForm,
    changePlatform,
    clearMessages,
  };
}
