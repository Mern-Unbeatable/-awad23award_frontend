import { POSTS_ENDPOINTS } from '../../../services/endpoints/posts.endpoints';
import { http } from '../../../services/http';
import type {
  CreateBlogPostPayload,
  UpdateBlogPostPayload,
} from './blogTypes';

export const listPostsRequest = () =>
  http.get(POSTS_ENDPOINTS.LIST, { params: { all: '1' } });

export const createPostRequest = (body: CreateBlogPostPayload) =>
  http.post(POSTS_ENDPOINTS.LIST, body);

export const updatePostRequest = (
  id: string,
  body: UpdateBlogPostPayload,
) => http.put(POSTS_ENDPOINTS.byId(id), body);

export const deletePostRequest = (id: string) =>
  http.delete(POSTS_ENDPOINTS.byId(id));
