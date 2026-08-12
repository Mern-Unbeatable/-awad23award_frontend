import type { Post } from '../types';
import { isBlobUrl } from './api';

/** Admin blog list/editor shape (bilingual UI) */
export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  excerpt: string;
  excerptAr: string;
  body: string;
  bodyAr: string;
  category: string;
  categoryAr: string;
  readTime: string;
  author: string;
  img: string;
  status: string;
}

export interface BlogFormInput {
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  excerpt: string;
  excerptAr: string;
  body: string;
  bodyAr: string;
  category: string;
  categoryAr: string;
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
    titleAr: post.titleAr || '',
    subtitle: post.seoDescriptionEn || '',
    subtitleAr: post.seoDescriptionAr || '',
    excerpt: post.excerptEn || '',
    excerptAr: post.excerptAr || '',
    body: post.bodyEn || '',
    bodyAr: post.bodyAr || '',
    category: post.categoryEn || 'Insights',
    categoryAr: post.categoryAr || '',
    readTime: formatReadTime(post.readTimeMinutes, post.bodyEn || ''),
    author: post.authorName || 'Author',
    img: post.coverImage && !isBlobUrl(post.coverImage) ? post.coverImage : '',
    status: post.status || 'draft',
  };
}

export function blogFormToPostPayload(form: BlogFormInput): Record<string, unknown> {
  const titleEn = form.title.trim();
  const titleAr = form.titleAr.trim() || titleEn;

  const excerptEn =
    form.excerpt.trim() ||
    form.subtitle.trim() ||
    form.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) ||
    titleEn;

  const excerptAr =
    form.excerptAr.trim() ||
    form.subtitleAr.trim() ||
    form.bodyAr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) ||
    titleAr ||
    excerptEn;

  const bodyEn = form.body;
  const bodyAr = form.bodyAr.trim() ? form.bodyAr : form.body;

  const categoryEn = form.category.trim() || 'Insights';
  const categoryAr = form.categoryAr.trim() || categoryEn;

  const seoDescriptionEn = form.subtitle.trim() || null;
  const seoDescriptionAr = form.subtitleAr.trim() || seoDescriptionEn;

  const readTimeMinutes = form.readTimeTouched
    ? parseReadTimeMinutes(form.readTime)
    : parseReadTimeMinutes(form.autoReadTime);

  const coverImage = form.img.trim();
  const safeCover =
    coverImage && !isBlobUrl(coverImage) ? coverImage : null;
  const status = form.status === 'draft' ? 'draft' : 'published';

  return {
    titleEn,
    titleAr,
    excerptEn,
    excerptAr,
    bodyEn,
    bodyAr,
    categoryEn,
    categoryAr,
    seoDescriptionEn,
    seoDescriptionAr,
    coverImage: safeCover,
    readTimeMinutes,
    authorName: form.author?.trim() || null,
    status,
    featured: false,
  };
}
