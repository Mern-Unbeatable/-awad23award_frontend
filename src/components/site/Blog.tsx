import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '../../hooks/LocaleContext';
import { useSite } from '../../hooks/SiteContext';
import { pick } from '../../types';
import { resolveMediaUrl, isBlobUrl } from '../../lib/api';
import { ScrollReveal } from './ScrollReveal';

const DEFAULT_POST_IMAGE = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80';

export function Blog() {
  const { locale, t, pathFor } = useLocale();
  const { posts: sitePosts } = useSite();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayPosts = sitePosts.map((post) => {
    const title =
      pick(post, locale, 'title') ||
      (locale === 'ar' ? post.titleAr : post.titleEn) ||
      ((post as unknown as Record<string, string>).title) ||
      '';
    const excerpt =
      pick(post, locale, 'excerpt') ||
      (locale === 'ar' ? post.excerptAr : post.excerptEn) ||
      ((post as unknown as Record<string, string>).excerpt) ||
      '';

    let img = post.coverImage ? resolveMediaUrl(post.coverImage) : '';
    if (!img || isBlobUrl(img)) {
      img = DEFAULT_POST_IMAGE;
    }

    const readTime = post.readTimeMinutes
      ? `${post.readTimeMinutes} ${t('Minutes', 'دقائق')}`
      : t('10 Minutes', '10 دقائق');

    const author = post.authorName || t('Ahmed Ibrahim', 'أحمد عوض');

    return {
      slug: post.slug,
      img,
      title,
      excerpt,
      readTime,
      author,
    };
  });

  return (
    <section id="blog" className="bg-white section-padding">
      <ScrollReveal>
        <div className="container mx-auto px-6">
        {/* Header with bottom line border */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-10">
          <h2 className="text-[26px] font-serif font-bold text-foreground tracking-tight uppercase">
            {t('LEARN, GROW', 'تعلم وتطور')}
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-slate-600 hover:border-gray-400 transition-colors cursor-pointer"
              aria-label="Previous post"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-[#36BFFB] hover:bg-[#20B0F0] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              aria-label="Next post"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Grid Layout with horizontal scroll container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((p, idx) => (
              <ScrollReveal key={p.slug || idx} delay={idx * 160}>
                <Link
                  to={pathFor(`/journal/${p.slug}`)}
                  className="flex gap-4 group cursor-pointer"
                >
                  {/* Left thumbnail image */}
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    width={300}
                    height={300}
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-xl object-cover shrink-0"
                  />

                  {/* Right text content */}
                  <div className="flex flex-col justify-between py-0.5">
                    <div>
                      <h3 className="text-[15px] font-serif font-bold text-foreground leading-snug group-hover:text-[#36BFFB] transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-gray-500 line-clamp-3">
                        {p.excerpt}
                      </p>
                    </div>

                    {/* Footer metadata */}
                    <div className="mt-3 text-[11px] text-gray-400 font-medium flex items-center gap-2">
                      <span>{p.readTime}</span>
                      <span>—</span>
                      <span>{p.author}</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  </section>
  );
}
