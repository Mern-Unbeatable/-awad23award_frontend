import type { RootState } from '../../../store/store';

export const selectAdminBlogPosts = (state: RootState) => state.adminBlog.posts;

export const selectAdminBlogError = (state: RootState) => state.adminBlog.error;

export const selectAdminBlogSaveError = (state: RootState) =>
  state.adminBlog.saveError;

export const selectAdminBlogIsLoading = (state: RootState) =>
  state.adminBlog.status === 'loading';

export const selectAdminBlogIsSaving = (state: RootState) =>
  state.adminBlog.saveStatus === 'loading';
