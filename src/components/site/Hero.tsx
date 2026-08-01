import { Nav } from './Nav';
import { useLocale } from '../../context/LocaleContext';
import { ConnectButton, TechMarquee } from '../tech';
import { AnimatedCounter } from './AnimatedCounter';

import a1 from '../../../award/src/assets/avatar-1.jpg';
import a2 from '../../../award/src/assets/avatar-2.jpg';
import a3 from '../../../award/src/assets/avatar-3.jpg';
import a4 from '../../../award/src/assets/avatar-4.jpg';

const avatars = [a1, a2, a3, a4];

export function Hero() {
  const { t, isRtl } = useLocale();

  const statsConfig = [
    { end: 8, suffix: '+', formatCommas: false, baseDelay: 0, label: t('Years Experience', 'سنوات خبرة') },
    { end: 10000, suffix: '+', formatCommas: true, baseDelay: 0.4, label: t('Hours Solving Business Problems', 'ساعة في حل مشكلات الأعمال') },
    { end: 2, suffix: '+', formatCommas: false, baseDelay: 1.4, label: t('Technology Ventures Founded', 'مشاريع تقنية تم تأسيسها') },
  ];

  return (
    <section id="top" className="relative overflow-hidden bg-forest text-forest-foreground">
      <Nav />

      <div className="container mx-auto px-5 sm:px-6 relative flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-6 pt-24 sm:pt-32 pb-12 lg:pt-36 lg:pb-0">
        
        {/* LEFT COLUMN CONTENT */}
        <div className="relative z-20 lg:col-span-6 flex flex-col items-start text-start">
          
          {/* Eyebrow Pill */}
          <span className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-[10px] sm:text-[11px] tracking-[0.14em] uppercase font-medium max-w-full border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-[#35BFFB]/50 hover:shadow-[0_0_20px_rgba(53,191,251,0.25)]">
            <span className="h-2 w-2 rounded-full bg-[#35BFFB] animate-pulse shrink-0 shadow-[0_0_8px_#35BFFB]" />
            <span className="relative z-10 truncate animate-text-glass font-semibold">
              {t('Technology Consultant • AI Strategist • Keynote Speaker', 'مستشار تقني • استراتيجي ذكاء اصطناعي • متحدث رئيسي')}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-glass-shine" />
          </span>

          {/* Main Headline */}
          <h1 className="mt-4 text-[28px] sm:text-[44px] lg:text-[56px] leading-[1.14] font-semibold text-white tracking-tight max-w-full lg:max-w-[760px]">
            {t('Helping Businesses Build Smarter Systems That Actually Scale.', 'مساعدة الشركات في بناء أنظمة أذكى تتوسع بالفعل.')}
          </h1>

          {/* MOBILE FEATURED PORTRAIT IMAGE — Prominently placed right under headline on mobile (<1024px) */}
          <div
            className={`block lg:hidden my-4 relative w-full text-center pointer-events-none z-10`}
          >
            <div className="relative inline-block mx-auto">
              <div className="absolute inset-0 bg-[#35BFFB]/20 blur-2xl rounded-full transform scale-90" aria-hidden />
              <img
                src="/award.png"
                alt="Ahmed Ibrahim"
                width={800}
                height={1000}
                className="relative z-10 mx-auto w-[250px] sm:w-[380px] max-w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Value Prop Body */}
          <p className="mt-2 lg:mt-4 text-[15px] sm:text-[18px] leading-relaxed text-white/80 max-w-full lg:max-w-[540px]">
            {t(
              'I work with founders, executives, and growing businesses to simplify operations, embrace AI, and create technology strategies that deliver measurable results.',
              'أعمل مع المؤسسين والتنفيذيين والشركات المتنامية لتبسيط العمليات وتبني الذكاء الاصطناعي وابتكار استراتيجيات تقنية تحقق نتائج ملموسة.'
            )}
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
            <ConnectButton
              variant="ghost"
              className="group relative overflow-hidden !rounded-[12px] !bg-[#3F7D6E] hover:!bg-[#35BFFB] !px-7 !py-3.5 !text-[15px] !font-medium !text-white transition-all duration-300 ease-out cursor-pointer shadow-md hover:shadow-[0_10px_25px_-5px_rgba(53,191,251,0.45)] hover:-translate-y-1 active:translate-y-0 text-center justify-center w-full sm:w-auto inline-flex items-center gap-2 border border-white/10"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {t('Book a consultation', 'احجز استشارة')}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 dir-rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
            </ConnectButton>

            <a
              href="#services"
              className="group relative overflow-hidden rounded-[12px] bg-[#35BFFB] hover:bg-[#25A0D4] px-7 py-3.5 text-[15px] font-medium text-white transition-all duration-300 ease-out shadow-md hover:shadow-[0_10px_25px_-5px_rgba(53,191,251,0.45)] hover:-translate-y-1 active:translate-y-0 text-center w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/10"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {t('Explore my services', 'استكشف خدماتي')}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
            </a>
          </div>

          {/* Key Stats Counter Grid */}
          <dl className="mt-8 sm:mt-14 flex flex-wrap gap-6 sm:gap-8 pb-6 lg:pb-14 w-full border-t border-white/10 pt-6 lg:border-none lg:pt-0">
            {statsConfig.map((s, idx) => (
              <div key={idx} className="flex flex-col shrink-0 group cursor-default">
                <dt className="font-display text-[1.8rem] sm:text-[2.2rem] lg:text-[2.2rem] leading-none font-bold text-white transition-colors duration-300">
                  <AnimatedCounter end={s.end} suffix={s.suffix} formatCommas={s.formatCommas} baseDelay={s.baseDelay} duration={2200} />
                </dt>
                <dd className="mt-2 text-[11px] sm:text-[12.5px] text-white/75 font-normal leading-snug whitespace-nowrap">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* DESKTOP PORTRAIT IMAGE — Absolute centered on Desktop (lg:flex), Hidden on Mobile */}
        <div
          className={`hidden lg:flex pointer-events-none absolute inset-x-0 bottom-0 justify-center z-10 ${
            isRtl ? '-translate-x-20' : 'translate-x-20'
          }`}
        >
          <img
            src="/award.png"
            alt="Ahmed Ibrahim, technology consultant and keynote speaker"
            width={1024}
            height={1280}
            className="mx-auto w-[560px] max-w-full object-contain object-bottom drop-shadow-2xl"
          />
        </div>

        {/* RIGHT COLUMN — Social Proof & Advisor Quote */}
        <div className="relative z-20 lg:col-span-3 lg:col-start-10 lg:pt-2">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3 dir-rtl:space-x-reverse">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  loading="lazy"
                  width={512}
                  height={512}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-forest transform transition-transform duration-300 hover:scale-115 hover:z-30 hover:ring-[#35BFFB] shadow-md"
                />
              ))}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3F7D6E] text-white text-lg ring-2 ring-forest shadow-md animate-pulse hover:scale-110 transition-transform">
                +
              </span>
            </div>
          </div>
          <p className="mt-3 text-[15px] sm:text-[18px] leading-relaxed text-white/90 font-medium">
            <span className="font-bold text-white text-[18px] sm:text-[20px] tracking-tight">
              <AnimatedCounter end={18} suffix="k+" duration={2000} />
            </span>{' '}
            {t('satisfied customer all over World', 'عميل راضٍ في جميع أنحاء العالم')}
          </p>

          <div
            className={`relative mt-6 lg:mt-[184px] max-w-[350px] bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 lg:bg-transparent lg:border-none lg:p-0 ${
              isRtl ? 'lg:translate-x-6 sm:translate-x-0' : 'lg:-translate-x-6 sm:translate-x-0'
            }`}
          >
            <svg
              className="w-8 h-8 text-white/20 absolute -top-4 -left-2 pointer-events-none lg:-top-8 lg:-left-4 lg:w-11 lg:h-11"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-[14px] sm:text-[18px] leading-relaxed text-white/85 relative z-10">
              {t(
                "I'm a technology consultant, keynote speaker, and trusted advisor helping businesses embrace AI, modernize operations, and build future-ready systems through practical strategies and real-world experience.",
                "أنا مستشار تقني ومتحدث رئيسي ومستشار موثوق أساعد الشركات على تبني الذكاء الاصطناعي وتحديث العمليات وبناء أنظمة مستقبلية من خلال استراتيجيات عملية وخبرات واقعية."
              )}
              <svg
                className="w-8 h-8 text-white/20 inline-block align-bottom ms-2 pointer-events-none lg:w-10 lg:h-10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
              </svg>
            </p>
          </div>
        </div>
      </div>

      {/* FADE BRIDGE: dark green → white */}
      <div
        className="relative w-full z-30 pointer-events-none h-6"
        style={{ background: 'linear-gradient(to bottom, rgba(6,71,56,0.5) 0%, #ffffff 100%)' }}
        aria-hidden
      />

      {/* PARTNER LOGO MARQUEE — white band */}
      <div className="relative w-full z-30 bg-white py-5">
        <TechMarquee />
      </div>
    </section>
  );
}
