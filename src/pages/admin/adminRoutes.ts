/** Admin dashboard URL paths — keep in sync with `App.tsx` nested routes */
export const ADMIN_ROUTES = {
  root: '/admin',
  login: '/admin/login',
  blogs: '/admin/blogs',
  portfolio: '/admin/portfolio',
  newsletter: '/admin/newsletter',
  homepage: '/admin/homepage',
  services: '/admin/services',
  messages: '/admin/messages',
  settings: '/admin/settings',
} as const;

/** Default landing after login */
export const ADMIN_DEFAULT_ROUTE = ADMIN_ROUTES.blogs;

export const ADMIN_BLOG_NEW = `${ADMIN_ROUTES.blogs}/new`;

export function adminBlogEditPath(postId: string) {
  return `${ADMIN_ROUTES.blogs}/${postId}/edit`;
}

export const ADMIN_PORTFOLIO_NEW = `${ADMIN_ROUTES.portfolio}/new`;

export function adminPortfolioEditPath(itemId: string) {
  return `${ADMIN_ROUTES.portfolio}/${itemId}/edit`;
}
