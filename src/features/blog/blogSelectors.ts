import type { RootState } from '../../store/store';

export const selectBlog = (state: RootState) => state.blog;

export const selectBlogPosts = (state: RootState) => state.blog.posts;

export const selectBlogStatus = (state: RootState) => state.blog.status;

export const selectBlogError = (state: RootState) => state.blog.error;

export const selectBlogSaveStatus = (state: RootState) => state.blog.saveStatus;

export const selectBlogSaveError = (state: RootState) => state.blog.saveError;

export const selectBlogIsLoading = (state: RootState) =>
  state.blog.status === 'loading';

export const selectBlogIsSaving = (state: RootState) =>
  state.blog.saveStatus === 'loading';
