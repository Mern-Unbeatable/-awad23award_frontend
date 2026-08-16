import { NEWSLETTER_ENDPOINTS } from '../../../services/endpoints/newsletter.endpoints';
import { http } from '../../../services/http';

export const subscribeRequest = (email: string, recaptchaToken: string) =>
  http.post(NEWSLETTER_ENDPOINTS.SUBSCRIBE, { email, recaptchaToken });
