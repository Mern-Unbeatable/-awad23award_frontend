import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

export function Testimonials() {
  const { t } = useLocale();

  const items = [
    {
      num: '01',
      quote: t(
        "Ahmed had significant impact in the enhancement of the Fund's digital services, and I would highly recommend him to whichever position he applies.",
        'كان لأحمد تأثير كبير في تحسين الخدمات الرقمية للصندوق، وأوصي به بشدة لأي منصب يتقدم له.'
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
        'تقديراً لمساهمتك البارزة وتفانيك الاستثنائي في التنفيذ الناجح لحل (SANAM CRM).'
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
        'أنا في منظومة الشركات الناشئة منذ عقود، وهذه هي الفكرة الأولى منذ فترة طويلة التي أثارت اهتمامي بحق.'
      ),
      name: 'Lewa Abukhait',
      role: 'Venture Capital Investor',
      org: '',
      accentColor: 'bg-[#2E7D6E]',
    },
    {
      num: '04',
      quote: t(
        "I've been in the startup ecosystem for decades, and this is the first idea in a long time that genuinely intrigued me.",
        'أنا في منظومة الشركات الناشئة منذ عقود، وهذه هي الفكرة الأولى منذ فترة طويلة التي أثارت اهتمامي بحق.'
      ),
      name: 'Lewa Abukhait',
      role: 'Venture Capital Investor',
      org: '',
      accentColor: 'bg-[#2E7D6E]',
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div>
            <h2 className="text-[44px] md:text-[54px] font-serif font-bold text-foreground tracking-tight leading-none">
              {t('Testimonials', 'توصيات وآراء العملاء')}
            </h2>
            <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#52606D]">
              {t(
                'Explore customer feedback on my service and its impact on my experiences.',
                'استكشف آراء العملاء وتجاربهم حول الخدمات المقدمة والأثر المحقق.'
              )}
            </p>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-slate-600 hover:border-gray-400 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-[#36BFFB] hover:bg-[#20B0F0] text-white flex items-center justify-center transition-colors shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Testimonials 4 Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <figure
              key={item.num + item.name}
              className="bg-white rounded-b-[12px] rounded-t-[4px] border-t-[3px] border-t-[#2E7D6E] border-x border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-7 flex flex-col justify-between relative min-h-[310px] hover:shadow-md transition-shadow"
            >
              {/* Top row with stars and watermark number */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F97316] text-[#F97316]" />
                    ))}
                  </div>
                  <span className="font-serif text-[38px] font-normal text-gray-200/80 leading-none select-none">
                    {item.num}
                  </span>
                </div>

                {/* Cyan Quote Mark */}
                <div className="text-[#36BFFB] text-[30px] font-serif leading-none mb-2">“</div>

                {/* Quote Text */}
                <blockquote className="font-serif italic text-[14px] leading-relaxed text-slate-800">
                  {item.quote}
                </blockquote>
              </div>

              {/* Bottom Author Section */}
              <figcaption className="mt-6 pt-4 border-t border-gray-100 flex gap-3 items-start">
                <div className={`w-[2.5px] rounded-full self-stretch shrink-0 ${item.accentColor || 'bg-[#2E7D6E]'}`} />
                <div>
                  <span className={`block text-[13px] font-bold leading-snug ${item.nameColor || 'text-foreground'}`}>
                    {item.name}
                  </span>
                  <span className={`block text-[11px] mt-0.5 ${item.roleColor || 'text-gray-400'}`}>
                    {item.role}
                  </span>
                  {item.org && (
                    <span className={`block text-[10.5px] font-bold tracking-wider uppercase mt-1 ${item.orgColor}`}>
                      {item.org}
                    </span>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
