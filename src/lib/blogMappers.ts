import type { Post } from '../types';
import { isBlobUrl } from './api';

/** Admin blog list/editor shape (English-first UI) */
export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  category: string;
  readTime: string;
  author: string;
  img: string;
  status: string;
}

export interface BlogFormInput {
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  category: string;
  readTime: string;
  readTimeTouched: boolean;
  autoReadTime: string;
  img: string;
  author?: string;
  status?: string;
}

function formatReadTime(minutes: number | null | undefined, body: string): string {
  if (minutes && minutes > 0) return `${minutes} min read`;
  const words = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  const est = Math.max(1, Math.round(words / 200));
  return `${est} min read`;
}

export function parseReadTimeMinutes(readTime: string): number | undefined {
  const match = readTime.match(/(\d+)/);
  if (!match) return undefined;
  const n = parseInt(match[1], 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function postToBlogItem(post: Post): BlogPostItem {
  return {
    id: post.id,
    slug: post.slug,
    title: post.titleEn || '',
    subtitle: post.seoDescriptionEn || '',
    excerpt: post.excerptEn || '',
    body: post.bodyEn || '',
    category: post.categoryEn || 'Insights',
    readTime: formatReadTime(post.readTimeMinutes, post.bodyEn || ''),
    author: post.authorName || 'Author',
    img: post.coverImage && !isBlobUrl(post.coverImage) ? post.coverImage : '',
    status: post.status || 'draft',
  };
}

export function blogFormToPostPayload(form: BlogFormInput): Record<string, unknown> {
  const excerptEn =
    form.excerpt.trim() ||
    form.subtitle.trim() ||
    form.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) ||
    form.title.trim();

  const readTimeMinutes = form.readTimeTouched
    ? parseReadTimeMinutes(form.readTime)
    : parseReadTimeMinutes(form.autoReadTime);

  const coverImage = form.img.trim();
  const safeCover =
    coverImage && !isBlobUrl(coverImage) ? coverImage : null;
  const status = form.status === 'draft' ? 'draft' : 'published';

  return {
    titleEn: form.title.trim(),
    titleAr: form.title.trim(),
    excerptEn: excerptEn,
    excerptAr: excerptEn,
    bodyEn: form.body,
    bodyAr: form.body,
    categoryEn: form.category.trim() || 'Insights',
    categoryAr: form.category.trim() || 'Insights',
    seoDescriptionEn: form.subtitle.trim() || null,
    seoDescriptionAr: form.subtitle.trim() || null,
    coverImage: safeCover,
    readTimeMinutes,
    authorName: form.author?.trim() || null,
    status,
    featured: false,
  };
}
