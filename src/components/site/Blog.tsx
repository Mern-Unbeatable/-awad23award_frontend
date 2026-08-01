import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { ScrollReveal } from './ScrollReveal';

export function Blog() {
  const { t, pathFor } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const posts = [
    {
      slug: 'building-smarter-businesses-with-ai-strategy',
      img: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
      title: t('Building Smarter Businesses with AI Strategy', 'بناء أعمال أكثر ذكاءً باستراتيجية الذكاء الاصطناعي'),
      excerpt: t(
        'Discover practical ways AI can streamline operations, improve decision-making, and create long-term business value.',
        'اكتشف طرقاً عملية يمكن للذكاء الاصطناعي من خلالها تبسيط العمليات وتحسين اتخاذ القرار.'
      ),
      readTime: t('10 Minutes', '10 دقائق'),
      author: t('Ahmed Awad', 'أحمد عوض'),
    },
    {
      slug: 'leading-through-change-and-innovation',
      img: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=400&q=80',
      title: t('Leading Through Change and Innovation', 'القيادة عبر التغيير والابتكار'),
      excerpt: t(
        'Explore leadership strategies that help businesses embrace technology while staying focused on sustainable growth.',
        'استكشف استراتيجيات القيادة التي تساعد الشركات على تبني التكنولوجيا والحفاظ على النمو المستدام.'
      ),
      readTime: t('10 Minutes', '10 دقائق'),
      author: t('Ahmed Awad', 'أحمد عوض'),
    },
    {
      slug: 'turning-data-into-better-decisions',
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
      title: t('Turning Data into Better Decisions', 'تحويل البيانات إلى قرارات أفضل'),
      excerpt: t(
        'Understand how data-driven strategies help businesses identify opportunities and make smarter, faster decisions.',
        'افهم كيف تساعد الاستراتيجيات القائمة على البيانات الشركات في تحديد الفرص واتخاذ قرارات أسرع.'
      ),
      readTime: t('10 Minutes', '10 دقائق'),
      author: t('Ahmed Awad', 'أحمد عوض'),
    },
    {
      slug: 'digital-transformation-that-actually-works',
      img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80',
      title: t('Digital Transformation That Actually Works', 'التحول الرقمي الذي يعمل بالفعل'),
      excerpt: t(
        'Learn how organizations can modernize processes without unnecessary complexity or expensive technology investments.',
        'تعرف على كيفية تحديث العمليات في المؤسسات دون تعقيد غير ضروري أو استثمارات مكلفة.'
      ),
      readTime: t('10 Minutes', '10 دقائق'),
      author: t('Ahmed Awad', 'أحمد عوض'),
    },
    {
      slug: 'future-of-business-automation',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
      title: t('The Future of Business Automation', 'مستقبل أتمتة الأعمال'),
      excerpt: t(
        'See how intelligent automation is reshaping workflows, increasing productivity, and improving customer experiences.',
        'شاهد كيف تعيد الأتمتة الذكية تشكيل مسارات العمل وتزيد الإنتاجية وتحسن تجربة العملاء.'
      ),
      readTime: t('10 Minutes', '10 دقائق'),
      author: t('Ahmed Awad', 'أحمد عوض'),
    },
    {
      slug: 'technology-trends-every-leader-should-know',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      title: t('Technology Trends Every Leader Should Know', 'توجهات التكنولوجيا التي يجب على كل قائد معرفتها'),
      excerpt: t(
        'Stay informed about emerging technologies that are transforming industries and creating new business opportunities.',
        'ابق على اطلاع بالتكنولوجيات الناشئة التي تغير الصناعات وتخلق فرصاً جديدة للأعمال.'
      ),
      readTime: t('10 Minutes', '10 دقائق'),
      author: t('Ahmed Awad', 'أحمد عوض'),
    },
  ];

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

        {/* Original Grid Layout with horizontal scroll container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 min-w-175 lg:min-w-0">
            {posts.map((p, idx) => (
              <ScrollReveal key={p.slug} delay={idx * 160}>
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
