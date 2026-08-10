import type { RootState } from '../../../store/store';

export const selectPublicPortfolioGallery = (state: RootState) =>
  state.publicPortfolio.gallery;

export const selectPublicPortfolioItem = (state: RootState) =>
  state.publicPortfolio.item;

export const selectPublicPortfolioIsLoading = (state: RootState) =>
  state.publicPortfolio.status === 'loading';

export const selectPublicPortfolioItemIsLoading = (state: RootState) =>
  state.publicPortfolio.itemStatus === 'loading';

export const selectPublicPortfolioError = (state: RootState) =>
  state.publicPortfolio.error;

export const selectPublicPortfolioItemError = (state: RootState) =>
  state.publicPortfolio.itemError;
