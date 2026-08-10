import { Link } from 'react-router-dom';
import { useLocale } from '../hooks/LocaleContext';
import { isBlobUrl, resolveMediaUrl } from '../lib/api';
import { pick, type Post } from '../types';

interface JournalCardProps {
  post: Post;
  featured?: boolean;
  compact?: boolean;
}

function postCoverSrc(coverImage?: string | null): string {
  if (!coverImage || isBlobUrl(coverImage)) return '';
  return resolveMediaUrl(coverImage) || coverImage;
}

export function JournalCard({ post, featured = false, compact = false }: JournalCardProps) {
  const { locale, pathFor, t } = useLocale();
  const title = pick(post, locale, 'title');
  const excerpt = pick(post, locale, 'excerpt');
  const category = pick(post, locale, 'category');
  const coverSrc = postCoverSrc(post.coverImage);
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar' : 'en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  if (featured) {
    return (
      <Link to={pathFor(`/journal/${post.slug}`)} className="journal-featured group">
        <div className="journal-featured-media">
          {coverSrc ? (
            <img src={coverSrc} alt={title} />
          ) : (
            <div className="journal-media-fallback" />
          )}
          <span className="journal-badge">{category}</span>
        </div>
        <div className="journal-featured-body">
          <p className="journal-kicker">{t('Featured', 'مميز')}</p>
          <h2 className="journal-featured-title">{title}</h2>
          {excerpt && <p className="journal-featured-excerpt">{excerpt}</p>}
          <div className="journal-card-meta">
            {dateLabel && <time dateTime={post.publishedAt || undefined}>{dateLabel}</time>}
            <span className="journal-read-more">
              {t('Read article', 'اقرأ المقال')}
              <span aria-hidden> →</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={pathFor(`/journal/${post.slug}`)}
      className={`journal-card group${compact ? ' is-compact' : ''}`}
    >
      <div className="journal-card-media">
        {coverSrc ? (
          <img src={coverSrc} alt={title} />
        ) : (
          <div className="journal-media-fallback" />
        )}
        <span className="journal-badge">{category}</span>
      </div>
      <div className="journal-card-body">
        <div className="journal-card-meta">
          {dateLabel && <time dateTime={post.publishedAt || undefined}>{dateLabel}</time>}
        </div>
        <h3 className="journal-card-title">{title}</h3>
        {!compact && excerpt && <p className="journal-card-excerpt">{excerpt}</p>}
        <span className="journal-read-more">
          {t('Read more', 'اقرأ المزيد')}
          <span aria-hidden> →</span>
        </span>
      </div>
    </Link>
  );
}
