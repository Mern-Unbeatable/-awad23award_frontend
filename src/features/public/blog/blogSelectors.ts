import type { RootState } from '../../../store/store';

export const selectPublicBlogPosts = (state: RootState) => state.publicBlog.posts;

export const selectPublicBlogPost = (state: RootState) => state.publicBlog.post;

export const selectPublicBlogPostError = (state: RootState) =>
  state.publicBlog.postError;

export const selectPublicBlogPostIsLoading = (state: RootState) =>
  state.publicBlog.postStatus === 'loading';

export const selectPublicBlogIsLoading = (state: RootState) =>
  state.publicBlog.status === 'loading';

export const selectPublicBlogError = (state: RootState) => state.publicBlog.error;
