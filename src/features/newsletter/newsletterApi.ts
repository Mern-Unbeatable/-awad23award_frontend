import { NEWSLETTER_ENDPOINTS } from '../../services/endpoints/newsletter.endpoints';
import { http } from '../../services/http';

export const listSubscribersRequest = () =>
  http.get(NEWSLETTER_ENDPOINTS.LIST);

export const getNewsletterStatsRequest = () =>
  http.get(NEWSLETTER_ENDPOINTS.STATS);

export const deleteSubscriberRequest = (id: string) =>
  http.delete(NEWSLETTER_ENDPOINTS.byId(id));

export const exportSubscribersCsvRequest = () =>
  http.get<Blob>(NEWSLETTER_ENDPOINTS.EXPORT, { responseType: 'blob' });
