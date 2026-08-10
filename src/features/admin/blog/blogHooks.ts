import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  createBlogPost,
  deleteBlogPost,
  fetchAdminPosts,
  updateBlogPost,
} from './blogThunks';
import { clearBlogSaveError } from './blogSlice';
import {
  selectAdminBlogError,
  selectAdminBlogIsLoading,
  selectAdminBlogIsSaving,
  selectAdminBlogPosts,
  selectAdminBlogSaveError,
} from './blogSelectors';
import type { CreateBlogPostPayload, UpdateBlogPostPayload } from './blogTypes';

export function useBlogAdmin() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAdminBlogPosts);
  const isLoading = useAppSelector(selectAdminBlogIsLoading);
  const isSaving = useAppSelector(selectAdminBlogIsSaving);
  const error = useAppSelector(selectAdminBlogError);
  const saveError = useAppSelector(selectAdminBlogSaveError);

  const loadPosts = useCallback(
    () => dispatch(fetchAdminPosts()).unwrap(),
    [dispatch],
  );

  const createPost = useCallback(
    (payload: CreateBlogPostPayload) =>
      dispatch(createBlogPost(payload)).unwrap(),
    [dispatch],
  );

  const updatePost = useCallback(
    (id: string, data: UpdateBlogPostPayload) =>
      dispatch(updateBlogPost({ id, data })).unwrap(),
    [dispatch],
  );

  const deletePost = useCallback(
    (id: string) => dispatch(deleteBlogPost(id)).unwrap(),
    [dispatch],
  );

  const clearSaveError = useCallback(
    () => dispatch(clearBlogSaveError()),
    [dispatch],
  );

  return {
    posts,
    isLoading,
    isSaving,
    error,
    saveError,
    loadPosts,
    createPost,
    updatePost,
    deletePost,
    clearSaveError,
  };
}
