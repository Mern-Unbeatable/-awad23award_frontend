import { useLocale } from '../../context/LocaleContext';

export function Process() {
  const { t, locale } = useLocale();

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
    <section className="bg-white py-24 overflow-hidden relative">
      {/* Background glow in marked portion */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-[100px] blur-3xl pointer-events-none opacity-90"
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
        <div className="relative mt-16 max-w-4xl mx-auto pb-28">
          {/* Connector line 1 (Between 01 and 02) */}
          <div className="hidden md:block absolute top-[110px] left-[26%] w-[130px] h-[80px] pointer-events-none z-30">
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

          {/* Connector line 2 (Between 02 and 03) */}
          <div className="hidden md:block absolute top-[190px] right-[27%] w-[130px] h-[80px] pointer-events-none z-30">
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
            {steps.map((s) => (
              <article
                key={s.num}
                className={`bg-white rounded-[28px] p-8 md:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100/90 flex flex-col justify-between min-h-[340px] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] ${s.cardClass}`}
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
