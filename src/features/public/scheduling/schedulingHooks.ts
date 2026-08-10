import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import type { SchedulingSettings } from '../../../types';
import { applyScheduling } from './schedulingSlice';
import { fetchPublicScheduling } from './schedulingThunks';
import {
  selectPublicScheduling,
  selectPublicSchedulingError,
  selectPublicSchedulingIsLoading,
} from './schedulingSelectors';

export function useSchedulingPublic() {
  const dispatch = useAppDispatch();
  const scheduling = useAppSelector(selectPublicScheduling);
  const isLoading = useAppSelector(selectPublicSchedulingIsLoading);
  const error = useAppSelector(selectPublicSchedulingError);

  const loadScheduling = useCallback(
    () => dispatch(fetchPublicScheduling()).unwrap(),
    [dispatch],
  );

  const applySchedulingSettings = useCallback(
    (data: SchedulingSettings) => dispatch(applyScheduling(data)),
    [dispatch],
  );

  return {
    scheduling,
    isLoading,
    error,
    loadScheduling,
    applyScheduling: applySchedulingSettings,
  };
}
