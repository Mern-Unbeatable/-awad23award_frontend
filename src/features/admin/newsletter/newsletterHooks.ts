import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  deleteNewsletterSubscriber,
  exportNewsletterCsv,
  fetchNewsletterData,
} from './newsletterThunks';
import { clearNewsletterActionError } from './newsletterSlice';
import {
  selectNewsletterActionError,
  selectNewsletterError,
  selectNewsletterIsExporting,
  selectNewsletterIsLoading,
  selectNewsletterStats,
  selectNewsletterSubscribers,
} from './newsletterSelectors';

export function useNewsletterAdmin() {
  const dispatch = useAppDispatch();
  const subscribers = useAppSelector(selectNewsletterSubscribers);
  const stats = useAppSelector(selectNewsletterStats);
  const isLoading = useAppSelector(selectNewsletterIsLoading);
  const isExporting = useAppSelector(selectNewsletterIsExporting);
  const error = useAppSelector(selectNewsletterError);
  const actionError = useAppSelector(selectNewsletterActionError);

  const loadNewsletterData = useCallback(
    () => dispatch(fetchNewsletterData()).unwrap(),
    [dispatch],
  );

  const deleteSubscriber = useCallback(
    (id: string) => dispatch(deleteNewsletterSubscriber(id)).unwrap(),
    [dispatch],
  );

  const exportCsv = useCallback(
    () => dispatch(exportNewsletterCsv()).unwrap(),
    [dispatch],
  );

  const clearActionError = useCallback(
    () => dispatch(clearNewsletterActionError()),
    [dispatch],
  );

  return {
    subscribers,
    stats,
    isLoading,
    isExporting,
    error,
    actionError,
    loadNewsletterData,
    deleteSubscriber,
    exportCsv,
    clearActionError,
  };
}
