import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPublicPost, fetchPublicPosts } from './blogThunks';
import {
  selectPublicBlogError,
  selectPublicBlogIsLoading,
  selectPublicBlogPost,
  selectPublicBlogPostError,
  selectPublicBlogPostIsLoading,
  selectPublicBlogPosts,
} from './blogSelectors';

export function useBlogPublic() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPublicBlogPosts);
  const post = useAppSelector(selectPublicBlogPost);
  const isLoadingPosts = useAppSelector(selectPublicBlogIsLoading);
  const isLoadingPost = useAppSelector(selectPublicBlogPostIsLoading);
  const postsError = useAppSelector(selectPublicBlogError);
  const postError = useAppSelector(selectPublicBlogPostError);

  const loadPosts = useCallback(
    () => dispatch(fetchPublicPosts()).unwrap(),
    [dispatch],
  );

  const loadPost = useCallback(
    (slug: string) => dispatch(fetchPublicPost(slug)).unwrap(),
    [dispatch],
  );

  return {
    posts,
    post,
    isLoadingPosts,
    isLoadingPost,
    postsError,
    postError,
    loadPosts,
    loadPost,
  };
}
