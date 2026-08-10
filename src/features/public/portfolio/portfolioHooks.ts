import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPublicGallery, fetchPublicGalleryItem } from './portfolioThunks';
import {
  selectPublicPortfolioError,
  selectPublicPortfolioGallery,
  selectPublicPortfolioIsLoading,
  selectPublicPortfolioItem,
  selectPublicPortfolioItemError,
  selectPublicPortfolioItemIsLoading,
} from './portfolioSelectors';

export function usePortfolioPublic() {
  const dispatch = useAppDispatch();
  const gallery = useAppSelector(selectPublicPortfolioGallery);
  const item = useAppSelector(selectPublicPortfolioItem);
  const isLoadingGallery = useAppSelector(selectPublicPortfolioIsLoading);
  const isLoadingItem = useAppSelector(selectPublicPortfolioItemIsLoading);
  const galleryError = useAppSelector(selectPublicPortfolioError);
  const itemError = useAppSelector(selectPublicPortfolioItemError);

  const loadGallery = useCallback(
    () => dispatch(fetchPublicGallery()).unwrap(),
    [dispatch],
  );

  const loadItem = useCallback(
    (slug: string) => dispatch(fetchPublicGalleryItem(slug)).unwrap(),
    [dispatch],
  );

  return {
    gallery,
    item,
    isLoadingGallery,
    isLoadingItem,
    galleryError,
    itemError,
    loadGallery,
    loadItem,
  };
}
