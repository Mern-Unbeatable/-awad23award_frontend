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
      offsetClass: 'md:translate-y-16',
    },
    {
      num: '02',
      title: t('Strategize', 'الاستراتيجية'),
      body: t(
        'Create a clear roadmap with AI and technology solutions.',
        'إنشاء خارطة طريق واضحة بحلول التقنية والذكاء الاصطناعي.'
      ),
      offsetClass: 'md:translate-y-0',
    },
    {
      num: '03',
      title: t('Transform', 'التحول والتنفيذ'),
      body: t(
        'Implement, optimize, and scale for lasting business growth.',
        'التنفيذ والتحسين والتوسع لتحقيق نمو مستدام لأعمالك.'
      ),
      offsetClass: 'md:translate-y-20',
    },
  ];

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="container mx-auto px-6">
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
        <div className="relative mt-16 max-w-5xl mx-auto pb-24">
          {/* Connector line 1 (Between 01 and 02) */}
          <div className="hidden md:block absolute top-[120px] left-[26%] w-[150px] h-[90px] pointer-events-none z-10">
            <svg viewBox="0 0 150 90" fill="none" className="w-full h-full">
              <path
                d="M 10 80 C 40 10, 110 10, 140 45"
                stroke="#36BFFB"
                strokeWidth="2"
                strokeDasharray="0"
                fill="none"
              />
              <circle cx="10" cy="80" r="4" fill="white" stroke="#36BFFB" strokeWidth="2" />
              <circle cx="140" cy="45" r="4" fill="white" stroke="#36BFFB" strokeWidth="2" />
            </svg>
          </div>

          {/* Connector line 2 (Between 02 and 03) */}
          <div className="hidden md:block absolute top-[160px] right-[26%] w-[150px] h-[90px] pointer-events-none z-10">
            <svg viewBox="0 0 150 90" fill="none" className="w-full h-full">
              <path
                d="M 10 25 C 40 85, 110 85, 140 50"
                stroke="#36BFFB"
                strokeWidth="2"
                strokeDasharray="0"
                fill="none"
              />
              <circle cx="10" cy="25" r="4" fill="white" stroke="#36BFFB" strokeWidth="2" />
              <circle cx="140" cy="50" r="4" fill="white" stroke="#36BFFB" strokeWidth="2" />
            </svg>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <article
                key={s.num}
                className={`bg-white rounded-[24px] p-8 md:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[320px] transition-transform duration-300 ${s.offsetClass}`}
              >
                {/* Step Number */}
                <div className="text-[52px] font-normal text-slate-800 leading-none">
                  {s.num}
                </div>

                {/* Content */}
                <div className="mt-16">
                  <h3 className="text-[24px] font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-[14.5px] leading-relaxed text-[#64748B]">{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
