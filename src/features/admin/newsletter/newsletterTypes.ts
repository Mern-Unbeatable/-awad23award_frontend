import type { NewsletterStats } from '../../../types';

export type NewsletterStatus = 'idle' | 'loading' | 'error';

export const EMPTY_NEWSLETTER_STATS: NewsletterStats = {
  totalSubscribers: 0,
  newThisMonth: 0,
  latestSubscription: null,
};
