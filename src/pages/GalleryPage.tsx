import { useState } from 'react';
import { Seo } from '../components/Seo';
import { PageReveal } from '../components/PageReveal';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { useReveal } from '../hooks/useReveal';
import { pick } from '../types';

export function GalleryPage() {
  const { locale, pathFor, t } = useLocale();
  const { gallery, settings } = useSite();
  const [active, setActive] = useState<string | null>(null);
  const ref = useReveal<HTMLElement>([gallery.length]);
  const activeItem = gallery.find((g) => g.id === active);

  return (
    <>
      <Seo
        title={`${t('Gallery', 'المعرض')} | ${settings.brandName}`}
        description={t(
          'Photos and video from stages, sessions, and studio.',
          'صور وفيديو من المنصات والجلسات والاستوديو.'
        )}
        path={pathFor('/gallery')}
      />
      <section className="pt-32 pb-10 container-site">
        <PageReveal>
          <p className="eyebrow mb-4">{t('Media', 'وسائط')}</p>
          <h1 className="font-display font-extrabold text-[clamp(2.4rem,6vw,4.5rem)] leading-none">
            {t('Gallery', 'المعرض')}
          </h1>
        </PageReveal>
      </section>

      <section ref={ref} className="container-wide pb-24 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {gallery.map((item) => (
          <button
            key={item.id}
            type="button"
            data-reveal
            onClick={() => setActive(item.id)}
            className="gallery-item block w-full break-inside-avoid overflow-hidden group relative cursor-pointer"
          >
            {item.media.type === 'video' ? (
              <video src={item.media.url} className="w-full" muted playsInline />
            ) : (
              <img
                src={item.media.url}
                alt={locale === 'ar' ? item.media.altAr : item.media.altEn}
                className="w-full transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            )}
            <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/35 transition-colors" />
            <span className="absolute bottom-3 start-3 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity font-display">
              {pick(item, locale, 'title')}
            </span>
          </button>
        ))}
      </section>

      {activeItem && (
        <div
          className="fixed inset-0 z-[60] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute top-6 end-6 text-cream font-display tracking-widest text-xs uppercase"
            onClick={() => setActive(null)}
          >
            {t('Close', 'إغلاق')}
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {activeItem.media.type === 'video' ? (
              <video src={activeItem.media.url} controls autoPlay className="w-full max-h-[80vh]" />
            ) : (
              <img
                src={activeItem.media.url}
                alt={pick(activeItem, locale, 'title')}
                className="w-full max-h-[80vh] object-contain mx-auto"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
