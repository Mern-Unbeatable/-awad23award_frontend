export const POSTS_ENDPOINTS = {
  LIST: '/posts',
  byId: (id: string) => `/posts/${id}`,
  bySlug: (slug: string) => `/posts/${slug}`,
} as const;
