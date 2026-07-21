import { Seo } from '../components/Seo';
import { PageReveal } from '../components/PageReveal';
import { JournalCard } from '../components/JournalCard';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { useReveal } from '../hooks/useReveal';

export function JournalPage() {
  const { pathFor, t } = useLocale();
  const { posts, settings } = useSite();
  const ref = useReveal<HTMLElement>([posts.length]);

  const [featured, ...rest] = posts;
  const gridPosts = featured ? rest : posts;

  return (
    <>
      <Seo
        title={`${t('Journal', 'المجلة')} | ${settings.brandName}`}
        description={t(
          'Insights on personal branding, visibility, and stage presence.',
          'رؤى حول العلامة الشخصية والظهور وحضور المنصة.'
        )}
        path={pathFor('/journal')}
      />

      <section className="journal-index-hero">
        <div className="container-site">
          <PageReveal>
            <p className="eyebrow mb-4">{t('Insights', 'رؤى')}</p>
            <div className="journal-index-heading">
              <h1>{t('Journal', 'المجلة')}</h1>
              <p>
                {t(
                  'Stories, frameworks, and notes from the stage and the studio.',
                  'قصص وأطر وملاحظات من المنصة والاستوديو.'
                )}
              </p>
            </div>
          </PageReveal>
        </div>
      </section>

      <section ref={ref} className="container-site pb-24">
        {featured && (
          <div data-reveal className="mb-10 md:mb-14">
            <JournalCard post={featured} featured />
          </div>
        )}

        {gridPosts.length > 0 && (
          <div className="journal-grid">
            {gridPosts.map((post) => (
              <div key={post.id} data-reveal>
                <JournalCard post={post} />
              </div>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p className="text-cream/50 text-center py-20">
            {t('No journal posts yet.', 'لا توجد مقالات بعد.')}
          </p>
        )}
      </section>
    </>
  );
}
