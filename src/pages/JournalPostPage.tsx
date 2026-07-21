import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Seo } from '../components/Seo';
import { JournalCard } from '../components/JournalCard';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { publicApi } from '../lib/api';
import { pick, type Post } from '../types';

function toHtml(body: string) {
  const trimmed = body?.trim() || '';
  if (!trimmed) return '';
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;
  return trimmed
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

export function JournalPostPage() {
  const { slug = '' } = useParams();
  const { locale, pathFor, t } = useLocale();
  const { settings, posts } = useSite();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    void publicApi.getPost(slug).then(setPost);
  }, [slug]);

  const related = useMemo(
    () => posts.filter((p) => p.slug !== slug).slice(0, 2),
    [posts, slug]
  );

  if (!post) {
    return (
      <div className="pt-40 container-site pb-24">
        <p className="text-cream/60">{t('Loading…', 'جاري التحميل…')}</p>
      </div>
    );
  }

  const title = pick(post, locale, 'title');
  const excerpt = pick(post, locale, 'excerpt');
  const category = pick(post, locale, 'category');
  const bodyHtml = toHtml(pick(post, locale, 'body'));
  const seoTitle = (locale === 'ar' ? post.seoTitleAr : post.seoTitleEn) || `${title} | ${settings.brandName}`;
  const seoDesc =
    (locale === 'ar' ? post.seoDescriptionAr : post.seoDescriptionEn) || excerpt;
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar' : 'en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDesc}
        image={post.coverImage || undefined}
        path={pathFor(`/journal/${post.slug}`)}
      />

      <article className="journal-post">
        <header className="journal-post-hero">
          {post.coverImage && (
            <div className="journal-post-hero-media" aria-hidden>
              <img src={post.coverImage} alt="" />
              <div className="journal-post-hero-shade" />
            </div>
          )}
          <div className="container-site relative z-10 pt-32 pb-14 md:pt-40 md:pb-20">
            <Link to={pathFor('/journal')} className="journal-back">
              ← {t('Back to journal', 'العودة للمجلة')}
            </Link>
            <p className="eyebrow mt-8 mb-4">{category}</p>
            <h1 className="journal-post-title">{title}</h1>
            {excerpt && <p className="journal-post-lead">{excerpt}</p>}
            <div className="journal-post-meta">
              {dateLabel && <time dateTime={post.publishedAt || undefined}>{dateLabel}</time>}
              <span className="journal-post-meta-dot" aria-hidden>
                ·
              </span>
              <span>{settings.brandName}</span>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="container-wide journal-post-cover">
            <img src={post.coverImage} alt={title} />
          </div>
        )}

        <div
          className="container-site journal-post-body prose-content"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <section className="container-site journal-post-cta">
          <div className="journal-post-cta-inner">
            <p className="eyebrow mb-3">{t('Next step', 'الخطوة التالية')}</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
              {t('Ready to turn insight into action?', 'هل أنت مستعد لتحويل الرؤية إلى فعل؟')}
            </h2>
            <p className="text-ink/70 mb-6 max-w-lg">
              {t(
                'Book a call and let’s map the next move for your personal brand.',
                'احجز مكالمة ولنرسم الخطوة التالية لعلامتك الشخصية.'
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={pathFor('/book')} className="btn btn-dark">
                {t('Book a consultation', 'احجز استشارة')}
              </Link>
              <Link to={pathFor('/contact')} className="btn btn-light">
                {t('Contact', 'تواصل')}
              </Link>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="container-site pb-24 pt-4">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="font-display font-bold text-2xl">
                {t('Keep reading', 'واصل القراءة')}
              </h2>
              <Link to={pathFor('/journal')} className="text-sm text-cream/50 hover:text-accent uppercase tracking-widest font-display">
                {t('All posts', 'كل المقالات')}
              </Link>
            </div>
            <div className="journal-grid">
              {related.map((item) => (
                <div key={item.id}>
                  <JournalCard post={item} compact />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
