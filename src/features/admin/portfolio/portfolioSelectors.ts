import type { RootState } from '../../../store/store';

export const selectAdminPortfolioItems = (state: RootState) =>
  state.adminPortfolio.items;

export const selectAdminPortfolioError = (state: RootState) =>
  state.adminPortfolio.error;

export const selectAdminPortfolioSaveError = (state: RootState) =>
  state.adminPortfolio.saveError;

export const selectAdminPortfolioIsLoading = (state: RootState) =>
  state.adminPortfolio.status === 'loading';

export const selectAdminPortfolioIsSaving = (state: RootState) =>
  state.adminPortfolio.saveStatus === 'loading';
