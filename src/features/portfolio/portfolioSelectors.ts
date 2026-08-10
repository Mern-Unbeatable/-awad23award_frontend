import type { RootState } from '../../store/store';

export const selectPortfolio = (state: RootState) => state.portfolio;

export const selectPortfolioItems = (state: RootState) => state.portfolio.items;

export const selectPortfolioStatus = (state: RootState) => state.portfolio.status;

export const selectPortfolioError = (state: RootState) => state.portfolio.error;

export const selectPortfolioSaveStatus = (state: RootState) =>
  state.portfolio.saveStatus;

export const selectPortfolioSaveError = (state: RootState) =>
  state.portfolio.saveError;

export const selectPortfolioIsLoading = (state: RootState) =>
  state.portfolio.status === 'loading';

export const selectPortfolioIsSaving = (state: RootState) =>
  state.portfolio.saveStatus === 'loading';
