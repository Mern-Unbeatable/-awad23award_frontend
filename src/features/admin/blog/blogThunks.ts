import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createPostRequest,
  deletePostRequest,
  listPostsRequest,
  updatePostRequest,
} from './blogApi';
import {
  getBlogErrorMessage,
  mapPostResponse,
  mapPostsListResponse,
} from './blogMappers';
import type { CreateBlogPostPayload, UpdateBlogPostPayload } from './blogTypes';

export const fetchAdminPosts = createAsyncThunk(
  'adminBlog/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await listPostsRequest();
      return mapPostsListResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getBlogErrorMessage(err, 'Failed to load blog posts.'),
      );
    }
  },
);

export const createBlogPost = createAsyncThunk(
  'adminBlog/createPost',
  async (payload: CreateBlogPostPayload, { rejectWithValue }) => {
    try {
      const res = await createPostRequest(payload);
      return mapPostResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getBlogErrorMessage(err, 'Failed to save blog post.'),
      );
    }
  },
);

export const updateBlogPost = createAsyncThunk(
  'adminBlog/updatePost',
  async (
    { id, data }: { id: string; data: UpdateBlogPostPayload },
    { rejectWithValue },
  ) => {
    try {
      const res = await updatePostRequest(id, data);
      return mapPostResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getBlogErrorMessage(err, 'Failed to save blog post.'),
      );
    }
  },
);

export const deleteBlogPost = createAsyncThunk(
  'adminBlog/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePostRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        getBlogErrorMessage(err, 'Failed to delete blog post.'),
      );
    }
  },
);
