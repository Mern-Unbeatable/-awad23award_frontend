import { createSlice } from '@reduxjs/toolkit';
import type { BlogPostItem } from '../../../lib/blogMappers';
import type { BlogStatus } from './blogTypes';
import {
  createBlogPost,
  deleteBlogPost,
  fetchAdminPosts,
  updateBlogPost,
} from './blogThunks';

export interface AdminBlogState {
  posts: BlogPostItem[];
  status: BlogStatus;
  error: string | null;
  saveStatus: BlogStatus;
  saveError: string | null;
}

const initialState: AdminBlogState = {
  posts: [],
  status: 'idle',
  error: null,
  saveStatus: 'idle',
  saveError: null,
};

const adminBlogSlice = createSlice({
  name: 'adminBlog',
  initialState,
  reducers: {
    clearBlogSaveError(state) {
      state.saveError = null;
      state.saveStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAdminPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchAdminPosts.rejected, (state, action) => {
        state.posts = [];
        state.status = 'error';
        state.error =
          (action.payload as string) || 'Failed to load blog posts.';
      })
      .addCase(createBlogPost.pending, (state) => {
        state.saveStatus = 'loading';
        state.saveError = null;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
        state.saveStatus = 'idle';
        state.saveError = null;
      })
      .addCase(createBlogPost.rejected, (state, action) => {
        state.saveStatus = 'error';
        state.saveError =
          (action.payload as string) || 'Failed to save blog post.';
      })
      .addCase(updateBlogPost.pending, (state) => {
        state.saveStatus = 'loading';
        state.saveError = null;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        );
        state.saveStatus = 'idle';
        state.saveError = null;
      })
      .addCase(updateBlogPost.rejected, (state, action) => {
        state.saveStatus = 'error';
        state.saveError =
          (action.payload as string) || 'Failed to save blog post.';
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export const { clearBlogSaveError } = adminBlogSlice.actions;
export default adminBlogSlice.reducer;
