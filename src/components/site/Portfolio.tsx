import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { useSite } from '../../context/SiteContext';
import { pick } from '../../types';
import { resolveMediaUrl, isBlobUrl } from '../../lib/api';
import { fallbackGallery } from '../../data/fallback';
import { ScrollReveal } from './ScrollReveal';

export function Portfolio() {
  const { locale, t, pathFor } = useLocale();
  const { gallery } = useSite();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayProjects = (gallery && gallery.length ? gallery : fallbackGallery).map((item, index) => {
    const title =
      pick(item, locale, 'title') ||
      (locale === 'ar' ? item.titleAr : item.titleEn) ||
      ((item as unknown as Record<string, string>).title) ||
      '';

    const sub =
      pick(item, locale, 'sub') ||
      pick(item, locale, 'excerpt') ||
      (locale === 'ar' ? (item.subAr || item.excerptAr) : (item.subEn || item.excerptEn)) ||
      ((item as unknown as Record<string, string>).sub) ||
      ((item as unknown as Record<string, string>).excerpt) ||
      '';

    const tag =
      pick(item, locale, 'tag') ||
      item.tag ||
      (locale === 'ar' ? 'مشروع' : 'Project');

    const tagStyle = item.tagStyle || 'bg-white text-black font-semibold';

    let img = item.heroImageUrl || item.media?.url || '';
    if (!img || isBlobUrl(img)) {
      const fb = fallbackGallery[index % fallbackGallery.length];
      img = fb?.media.url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
    } else {
      img = resolveMediaUrl(img);
    }

    return {
      slug: item.slug,
      img,
      tag,
      tagStyle,
      title,
      sub,
    };
  });

  return (
    <section id="work" className="bg-black text-white section-padding">
      <ScrollReveal>
        <div className="container mx-auto px-6 max-w-7xl">
        {/* Title */}
        <h2 className="text-[44px] sm:text-[72px] md:text-[96px] leading-none font-serif font-semibold text-white tracking-tight">
          {t('My Portfolio', 'معرض أعمالي')}
        </h2>

        {/* Subtitle description and top-right navigation buttons */}
        <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <p className="max-w-xl text-[16px] leading-relaxed text-gray-200">
            {t(
              'From AI consulting and digital transformation to executive advisory, I work closely with organizations to understand their goals and deliver technology solutions that drive measurable growth.',
              'من استشارات الذكاء الاصطناعي والتحول الرقمي إلى تقديم المشورة التنفيذية، أعمل عن قرب مع المؤسسات لفهم أهدافها وتقديم حلول تقنية تحقق نمواً ملموساً.'
            )}
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-white hover:text-white transition-colors cursor-pointer"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-[#36BFFB] hover:bg-[#20B0F0] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Portfolio Projects Grid with horizontal scroll */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((p, idx) => (
              <ScrollReveal key={p.slug || idx} delay={idx * 160}>
                <Link
                  to={pathFor(`/work/${p.slug}`)}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-lg bg-[#1E1E1E] aspect-16/10">
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                      width={800}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge Overlay */}
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[12px] shadow-sm ${p.tagStyle}`}
                    >
                      {p.tag}
                    </span>
                  </div>

                  {/* Title & Category Subtitle */}
                  <h3 className="mt-4 text-[18px] font-bold text-white group-hover:text-sky-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[13.5px] text-gray-400 font-normal">{p.sub}</p>
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
