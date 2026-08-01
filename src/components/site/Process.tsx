import { useLocale } from '../../context/LocaleContext';
import { ScrollReveal } from './ScrollReveal';

export function Process() {
  const { t } = useLocale();

  const steps = [
    {
      num: '01',
      title: t('Discover', 'الاستكشاف'),
      body: t(
        'Understand your goals, challenges, and opportunities.',
        'فهم أهدافك، وتحدياتك، والفرص المتاحة.'
      ),
      cardClass: 'md:translate-y-14 md:-rotate-[4deg] z-10',
    },
    {
      num: '02',
      title: t('Strategize', 'الاستراتيجية'),
      body: t(
        'Create a clear roadmap with AI and technology solutions.',
        'إنشاء خارطة طريق واضحة بحلول التقنية والذكاء الاصطناعي.'
      ),
      cardClass: 'md:-translate-y-4 md:-rotate-[1.5deg] z-20 shadow-[0_25px_60px_rgba(0,0,0,0.08)]',
    },
    {
      num: '03',
      title: t('Transform', 'التحول والتنفيذ'),
      body: t(
        'Implement, optimize, and scale for lasting business growth.',
        'التنفيذ والتحسين والتوسع لتحقيق نمو مستدام لأعمالك.'
      ),
      cardClass: 'md:translate-y-16 md:rotate-[4deg] z-10',
    },
  ];

  return (
    <section className="bg-white section-padding overflow-hidden relative">
      <ScrollReveal>
        {/* Background glow in marked portion */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-175 h-75 rounded-[100px] blur-3xl pointer-events-none opacity-90"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(54, 191, 251, 0.28) 0%, rgba(210, 243, 255, 0.6) 55%, transparent 100%)',
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
        {/* Eyebrow and Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-serif italic text-[#2E7D6E] text-[15px] tracking-wide mb-2">
            {t('/ MY Projects Explained', '/ شرح مشاريعي')}
          </p>
          <h2 className="text-[44px] md:text-[54px] leading-[1.12] font-semibold text-foreground tracking-tight">
            {t("Here's how it works", 'طريقة العمل والمنهجية')}
          </h2>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="relative mt-16 max-w-4xl mx-auto pb-0 md:pb-24">
          {/* Desktop Connector line 1 (Between 01 and 02) */}
          <div className="hidden md:block absolute top-27.5 left-[26%] w-32.5 h-20 pointer-events-none z-30">
            <svg viewBox="0 0 130 80" fill="none" className="w-full h-full">
              <path
                d="M 10 65 C 35 15, 95 15, 120 40"
                stroke="#36BFFB"
                strokeWidth="2.5"
                fill="none"
              />
              <circle cx="10" cy="65" r="4.5" fill="white" stroke="#36BFFB" strokeWidth="2.5" />
              <circle cx="120" cy="40" r="4.5" fill="white" stroke="#36BFFB" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Desktop Connector line 2 (Between 02 and 03) */}
          <div className="hidden md:block absolute top-47.5 right-[27%] w-32.5 h-20 pointer-events-none z-30">
            <svg viewBox="0 0 130 80" fill="none" className="w-full h-full">
              <path
                d="M 10 20 C 30 75, 95 75, 120 45"
                stroke="#36BFFB"
                strokeWidth="2.5"
                fill="none"
              />
              <circle cx="10" cy="20" r="4.5" fill="white" stroke="#36BFFB" strokeWidth="2.5" />
              <circle cx="120" cy="45" r="4.5" fill="white" stroke="#36BFFB" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="grid gap-6 md:grid-cols-3 items-start">
            {steps.map((s, idx) => (
              <div key={s.num} className="contents md:block">
                <ScrollReveal delay={idx * 150}>
                  <article
                    className={`bg-white rounded-[28px] p-8 md:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100/90 flex flex-col justify-between min-h-85 transition-all duration-300 ease-out hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] cursor-pointer ${s.cardClass}`}
                  >
                    {/* Step Number */}
                    <div className="text-[54px] font-normal text-slate-800 leading-none tracking-tight">
                      {s.num}
                    </div>

                    {/* Content */}
                    <div className="mt-14">
                      <h3 className="text-[22px] md:text-[24px] font-bold text-foreground mb-3">{s.title}</h3>
                      <p className="text-[14px] leading-relaxed text-[#64748B]">{s.body}</p>
                    </div>
                  </article>
                </ScrollReveal>

                {/* Mobile Vertical Curve Connector (shown between steps on mobile) */}
                {idx < steps.length - 1 && (
                  <div className="flex md:hidden justify-center my-2 pointer-events-none z-30">
                    <svg className="w-10 h-14" viewBox="0 0 40 60" fill="none">
                      <path
                        d="M 20 5 C 35 20, 5 40, 20 55"
                        stroke="#36BFFB"
                        strokeWidth="2.5"
                        fill="none"
                      />
                      <circle cx="20" cy="5" r="4" fill="white" stroke="#36BFFB" strokeWidth="2.5" />
                      <circle cx="20" cy="55" r="4" fill="white" stroke="#36BFFB" strokeWidth="2.5" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  </section>
  );
}
