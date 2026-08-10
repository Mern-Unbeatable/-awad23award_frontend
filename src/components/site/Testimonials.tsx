import { useMemo, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '../../hooks/LocaleContext';
import { useSite } from '../../hooks/SiteContext';
import { pick, type Testimonial } from '../../types';
import { ScrollReveal } from './ScrollReveal';

const ACCENT_COLORS = ['bg-[#2E7D6E]', 'bg-[#36BFFB]', 'bg-[#2E7D6E]', 'bg-[#36BFFB]'];

type TestimonialItem = {
  num: string;
  quote: string;
  name: string;
  role: string;
  org: string;
  accentColor: string;
  nameColor?: string;
  roleColor?: string;
  orgColor?: string;
};

function fallbackTestimonialItems(t: (en: string, ar: string) => string): TestimonialItem[] {
  return [
    {
      num: '01',
      quote: t(
        "Ahmed had significant impact in the enhancement of the Fund's digital services, and I would highly recommend him to whichever position he applies.",
        'كان لأحمد تأثير كبير في تحسين الخدمات الرقمية للصندوق، وأوصي به بشدة لأي منصب يتقدم له.',
      ),
      name: 'Abdulaziz Alsughayyir',
      role: 'Digital Transformation & Innovation Director',
      org: 'REAL ESTATE DEVELOPMENT FUND (REDF)',
      orgColor: 'text-[#2E7D6E]',
      accentColor: 'bg-[#2E7D6E]',
    },
    {
      num: '02',
      quote: t(
        'In recognition of your outstanding contribution and exceptional dedication to the successful implementation of the SANAM Solution (CRM).',
        'تقديراً لمساهمتك البارزة وتفانيك الاستثنائي في التنفيذ الناجح لحل (SANAM CRM).',
      ),
      name: 'OFFICIAL RECOGNITION AWARD',
      role: 'Public Investment Fund (PIF)',
      org: '',
      nameColor: 'text-[#2E7D6E]',
      roleColor: 'text-[#36BFFB]',
      accentColor: 'bg-[#36BFFB]',
    },
    {
      num: '03',
      quote: t(
        "I've been in the startup ecosystem for decades, and this is the first idea in a long time that genuinely intrigued me.",
        'أنا في منظومة الشركات الناشئة منذ عقود، وهذه هي الفكرة الأولى منذ فترة طويلة التي أثارت اهتمامي بحق.',
      ),
      name: 'Lewa Abukhait',
      role: 'Venture Capital Investor',
      org: '',
      accentColor: 'bg-[#2E7D6E]',
    },
  ];
}

function mapTestimonialToItem(
  testimonial: Testimonial,
  idx: number,
  locale: 'en' | 'ar',
): TestimonialItem {
  return {
    num: String(idx + 1).padStart(2, '0'),
    quote: pick(testimonial, locale, 'quote'),
    name: pick(testimonial, locale, 'name'),
    role: pick(testimonial, locale, 'role'),
    org: '',
    accentColor: ACCENT_COLORS[idx % ACCENT_COLORS.length],
  };
}

export function Testimonials() {
  const { locale, t } = useLocale();
  const { testimonials } = useSite();
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => {
    if (testimonials.length) {
      return testimonials
        .sort((a, b) => a.order - b.order)
        .map((item, idx) => mapTestimonialToItem(item, idx, locale));
    }
    return fallbackTestimonialItems(t);
  }, [testimonials, locale, t]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white section-padding">
      <ScrollReveal>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <div>
              <h2 className="text-[32px] sm:text-[44px] md:text-[54px] font-serif font-bold text-foreground tracking-tight leading-none">
                {t('Testimonials', 'توصيات وآراء العملاء')}
              </h2>
              <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#52606D]">
                {t(
                  'Explore customer feedback on my service and its impact on my experiences.',
                  'استكشف آراء العملاء وتجاربهم حول الخدمات المقدمة والأثر المحقق.',
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-slate-600 hover:border-gray-400 transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full bg-[#36BFFB] hover:bg-[#20B0F0] text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-smooth gap-6 sm:grid-cols-2 lg:grid-cols-4 pb-4 sm:pb-0 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, idx) => (
              <ScrollReveal
                key={item.num + item.name}
                delay={idx * 160}
                className="w-full shrink-0 sm:w-auto snap-center h-full"
              >
                <figure
                  className="w-full shrink-0 sm:w-auto snap-center bg-white rounded-b-2xl rounded-t-lg border-t-[3px] border-t-[#2E7D6E] border-x border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-7 flex flex-col justify-between relative min-h-77.5 hover:shadow-md transition-shadow h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-[#F97316] text-[#F97316]"
                          />
                        ))}
                      </div>
                      <span className="font-serif text-[38px] font-normal text-gray-200/80 leading-none select-none">
                        {item.num}
                      </span>
                    </div>

                    <div className="text-[#36BFFB] text-[30px] font-serif leading-none mb-2">
                      “
                    </div>

                    <blockquote className="font-serif italic text-[14px] leading-relaxed text-slate-800">
                      {item.quote}
                    </blockquote>
                  </div>

                  <figcaption className="mt-6 pt-4 border-t border-gray-100 flex gap-3 items-start">
                    <div
                      className={`w-[2.5px] rounded-full self-stretch shrink-0 ${item.accentColor || 'bg-[#2E7D6E]'}`}
                    />
                    <div>
                      <span
                        className={`block text-[13px] font-bold leading-snug ${item.nameColor || 'text-foreground'}`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`block text-[11px] mt-0.5 ${item.roleColor || 'text-gray-400'}`}
                      >
                        {item.role}
                      </span>
                      {item.org && (
                        <span
                          className={`block text-[10.5px] font-bold tracking-wider uppercase mt-1 ${item.orgColor}`}
                        >
                          {item.org}
                        </span>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
