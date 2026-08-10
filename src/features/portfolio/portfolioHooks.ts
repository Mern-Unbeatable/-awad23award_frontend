import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createPortfolioItem,
  deletePortfolioItem,
  fetchAdminPortfolio,
  updatePortfolioItem,
} from './portfolioThunks';
import { clearPortfolioSaveError } from './portfolioSlice';
import {
  selectPortfolioError,
  selectPortfolioIsLoading,
  selectPortfolioIsSaving,
  selectPortfolioItems,
  selectPortfolioSaveError,
} from './portfolioSelectors';
import type {
  CreatePortfolioPayload,
  UpdatePortfolioPayload,
} from './portfolioTypes';

export function usePortfolioAdmin() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectPortfolioItems);
  const isLoading = useAppSelector(selectPortfolioIsLoading);
  const isSaving = useAppSelector(selectPortfolioIsSaving);
  const error = useAppSelector(selectPortfolioError);
  const saveError = useAppSelector(selectPortfolioSaveError);

  const loadItems = useCallback(
    () => dispatch(fetchAdminPortfolio()).unwrap(),
    [dispatch],
  );

  const createItem = useCallback(
    (payload: CreatePortfolioPayload) =>
      dispatch(createPortfolioItem(payload)).unwrap(),
    [dispatch],
  );

  const updateItem = useCallback(
    (id: string, data: UpdatePortfolioPayload) =>
      dispatch(updatePortfolioItem({ id, data })).unwrap(),
    [dispatch],
  );

  const deleteItem = useCallback(
    (id: string) => dispatch(deletePortfolioItem(id)).unwrap(),
    [dispatch],
  );

  const clearSaveError = useCallback(
    () => dispatch(clearPortfolioSaveError()),
    [dispatch],
  );

  return {
    items,
    isLoading,
    isSaving,
    error,
    saveError,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    clearSaveError,
  };
}
