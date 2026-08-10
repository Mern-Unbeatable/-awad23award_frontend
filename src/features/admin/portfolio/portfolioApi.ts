import { PORTFOLIO_ENDPOINTS } from '../../../services/endpoints/portfolio.endpoints';
import { http } from '../../../services/http';
import type {
  CreatePortfolioPayload,
  UpdatePortfolioPayload,
} from './portfolioTypes';

export const listPortfolioRequest = () =>
  http.get(PORTFOLIO_ENDPOINTS.LIST, { params: { all: '1' } });

export const createPortfolioItemRequest = (body: CreatePortfolioPayload) =>
  http.post(PORTFOLIO_ENDPOINTS.LIST, body);

export const updatePortfolioItemRequest = (
  id: string,
  body: UpdatePortfolioPayload,
) => http.put(PORTFOLIO_ENDPOINTS.byId(id), body);

export const deletePortfolioItemRequest = (id: string) =>
  http.delete(PORTFOLIO_ENDPOINTS.byId(id));
