export const PORTFOLIO_ENDPOINTS = {
  LIST: '/gallery',
  byId: (id: string) => `/gallery/${id}`,
  bySlug: (slug: string) => `/gallery/${encodeURIComponent(slug)}`,
} as const;
