import { PORTFOLIO_ENDPOINTS } from '../../../services/endpoints/portfolio.endpoints';
import { http } from '../../../services/http';

export const listPortfolioRequest = () =>
  http.get(PORTFOLIO_ENDPOINTS.LIST);

export const getPortfolioItemBySlugRequest = (slug: string) =>
  http.get(PORTFOLIO_ENDPOINTS.bySlug(slug));
