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
        title={`${t('Insights', 'رؤى')} | ${settings.brandName}`}
        description={t(
          'Tech insights on CRM, automation, and AI for enterprise leaders.',
          'رؤى تقنية حول CRM والأتمتة والذكاء الاصطناعي لقادة المؤسسات.'
        )}
        path={pathFor('/journal')}
      />

      <section className="page-hero">
        <div className="container-site relative z-10">
          <PageReveal>
            <p className="eyebrow mb-4">{t('Insights', 'رؤى')}</p>
            <h1 className="page-hero__title">{t('Insights', 'رؤى')}</h1>
            <p className="page-hero__lead">
              {t(
                'Notes on CRM transformation, WhatsApp automation, and AI agents.',
                'ملاحظات حول تحول CRM وأتمتة واتساب ووكلاء الذكاء الاصطناعي.'
              )}
            </p>
          </PageReveal>
        </div>
      </section>

      <section ref={ref} className="container-site pb-24 pt-8">
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
          <p className="text-cream-dim text-center py-20">
            {t('No insights yet.', 'لا توجد رؤى بعد.')}
          </p>
        )}
      </section>
    </>
  );
}
