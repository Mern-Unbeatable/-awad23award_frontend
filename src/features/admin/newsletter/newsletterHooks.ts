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

function downloadCsvBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'newsletter_subscribers.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

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

  const exportCsv = useCallback(async () => {
    const blob = await dispatch(exportNewsletterCsv()).unwrap();
    downloadCsvBlob(blob);
  }, [dispatch]);

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
