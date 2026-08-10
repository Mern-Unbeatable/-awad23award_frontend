import { POSTS_ENDPOINTS } from '../../../services/endpoints/posts.endpoints';
import { http } from '../../../services/http';

export const listPostsRequest = () => http.get(POSTS_ENDPOINTS.LIST);

export const getPostBySlugRequest = (slug: string) =>
  http.get(POSTS_ENDPOINTS.bySlug(slug));
