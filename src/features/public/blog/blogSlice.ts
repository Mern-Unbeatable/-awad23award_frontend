import { createSlice } from '@reduxjs/toolkit';
import type { Post } from '../../../types';
import type { BlogStatus } from './blogTypes';
import { fetchPublicPost, fetchPublicPosts } from './blogThunks';

export interface PublicBlogState {
  posts: Post[];
  post: Post | null;
  postSlug: string | null;
  status: BlogStatus;
  postStatus: BlogStatus;
  error: string | null;
  postError: string | null;
}

const initialState: PublicBlogState = {
  posts: [],
  post: null,
  postSlug: null,
  status: 'idle',
  postStatus: 'idle',
  error: null,
  postError: null,
};

const publicBlogSlice = createSlice({
  name: 'publicBlog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPublicPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(fetchPublicPosts.rejected, (state, action) => {
        state.posts = [];
        state.status = 'error';
        state.error =
          (action.payload as string) || 'Failed to load blog posts.';
      })
      .addCase(fetchPublicPost.pending, (state, action) => {
        state.postStatus = 'loading';
        state.postError = null;
        state.postSlug = action.meta.arg;
      })
      .addCase(fetchPublicPost.fulfilled, (state, action) => {
        state.post = action.payload;
        state.postSlug = action.payload.slug;
        state.postStatus = 'idle';
        state.postError = null;
      })
      .addCase(fetchPublicPost.rejected, (state, action) => {
        state.post = null;
        state.postStatus = 'error';
        state.postError =
          (action.payload as string) || 'Failed to load blog post.';
      });
  },
});

export default publicBlogSlice.reducer;
