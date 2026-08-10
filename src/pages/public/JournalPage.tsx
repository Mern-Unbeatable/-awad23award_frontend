import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Seo } from '../../components/Seo';
import { JournalCard } from '../../components/JournalCard';
import { useLocale } from '../../hooks/LocaleContext';
import { useSite } from '../../hooks/SiteContext';
import { useBlogPublic } from '../../features/public/blog/blogHooks';

export function JournalPage() {
  const { pathFor, t } = useLocale();
  const { settings } = useSite();
  const { posts, loadPosts, isLoadingPosts } = useBlogPublic();

  useEffect(() => {
    loadPosts().catch(() => undefined);
  }, [loadPosts]);

  return (
    <>
      <Seo
        title={`${t('Insights', 'مقالات')} | ${settings.brandName}`}
        description={t(
          'Articles on technology, AI, and digital transformation.',
          'مقالات حول التقنية والذكاء الاصطناعي والتحول الرقمي.',
        )}
        path={pathFor('/journal')}
      />

      <div className="bg-white pt-28 pb-16 min-h-screen">
        <div className="container-site">
          <header className="mb-10">
            <p className="eyebrow mb-4">{t('Insights', 'مقالات')}</p>
            <h1 className="page-hero__title">{t('Journal', 'المدونة')}</h1>
          </header>

          {isLoadingPosts ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-[#36BFFB] animate-spin" />
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <JournalCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
