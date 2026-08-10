import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPostBySlugRequest, listPostsRequest } from './blogApi';
import {
  getBlogErrorMessage,
  mapPublicPostResponse,
  mapPublicPostsResponse,
} from './blogMappers';

export const fetchPublicPosts = createAsyncThunk(
  'publicBlog/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await listPostsRequest();
      return mapPublicPostsResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getBlogErrorMessage(err, 'Failed to load blog posts.'),
      );
    }
  },
);

export const fetchPublicPost = createAsyncThunk(
  'publicBlog/fetchPost',
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await getPostBySlugRequest(slug);
      return mapPublicPostResponse(res.data);
    } catch (err) {
      return rejectWithValue(
        getBlogErrorMessage(err, 'Failed to load blog post.'),
      );
    }
  },
);
