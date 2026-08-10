export const NEWSLETTER_ENDPOINTS = {
  LIST: '/newsletter',
  STATS: '/newsletter/stats',
  EXPORT: '/newsletter/export',
  byId: (id: string) => `/newsletter/${id}`,
} as const;
