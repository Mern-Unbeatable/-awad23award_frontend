import { Nav } from './Nav';
import { useLocale } from '../../context/LocaleContext';
import { ConnectButton, TechMarquee } from '../tech';
import { AnimatedCounter } from './AnimatedCounter';


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
          <span className="group relative overflow-hidden inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 backdrop-blur-md px-2.5 sm:px-4 py-1 sm:py-1.5 text-[8.5px] min-[380px]:text-[9.5px] sm:text-[11px] tracking-[0.04em] sm:tracking-[0.14em] uppercase font-medium max-w-full border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-[#35BFFB]/50 hover:shadow-[0_0_20px_rgba(53,191,251,0.25)]">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#35BFFB] animate-pulse shrink-0 shadow-[0_0_8px_#35BFFB]" />
            <span className="relative z-10 whitespace-nowrap animate-text-glass font-semibold">
              {t('Technology Consultant • AI Strategist • Keynote Speaker', 'مستشار تقني • استراتيجي ذكاء اصطناعي • متحدث رئيسي')}
            </span>
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-glass-shine" />
          </span>

          {/* Main Headline */}
          <h1 className={`mt-4 text-[31px] sm:text-[44px] lg:text-[56px] leading-[1.14] font-semibold text-white tracking-tight max-w-full${isRtl ? ' lg:max-w-105' : ''}`}>
            {isRtl
              ? t(
                  'Helping Businesses Build Smarter Systems That Actually Scale.',
                  'مساعدة الشركات في بناء أنظمة أذكى تتوسع بالفعل.'
                )
                  .split(' ')
                  .map((word, wordIdx, wordArr) => (
                    <span key={wordIdx} className="inline-block">
                      <span
                        className="inline-block animate-hero-title-wave"
                        style={{ animationDelay: `${wordIdx * 0.12}s` }}
                      >
                        {word}
                      </span>
                      {wordIdx < wordArr.length - 1 && <span className="inline-block">&nbsp;</span>}
                    </span>
                  ))
              : (() => {
                  const lines = [
                    ['Helping', 'Businesses', 'Build'],
                    ['Smarter', 'Systems', 'That'],
                    ['Actually', 'Scale.'],
                  ];
                  let globalCharIdx = 0;
                  return lines.map((words, lineIdx) => (
                    <span key={lineIdx} className="block">
                      {words.map((word, wordIdx) => (
                        <span key={wordIdx} className="inline whitespace-nowrap">
                          <span className="inline-block whitespace-nowrap">
                            {word.split('').map((char) => {
                              const delay = globalCharIdx++ * 0.048;
                              return (
                                <span
                                  key={delay}
                                  className="inline-block animate-hero-title-wave"
                                  style={{ animationDelay: `${delay}s` }}
                                >
                                  {char}
                                </span>
                              );
                            })}
                          </span>
                          {wordIdx < words.length - 1 && (
                            <span
                              className="inline-block animate-hero-title-wave"
                              style={{ animationDelay: `${globalCharIdx++ * 0.048}s` }}
                            >
                              &nbsp;
                            </span>
                          )}
                        </span>
                      ))}
                    </span>
                  ));
                })()}
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
                className="relative z-10 mx-auto w-62.5 sm:w-95 max-w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Value Prop Body */}
          <p className="mt-2 lg:mt-4 text-[15px] sm:text-[18px] leading-relaxed text-white/80 max-w-full lg:max-w-135">
            {t(
              'I work with founders, executives, and growing businesses to simplify operations, embrace AI, and create technology strategies that deliver measurable results.',
              'أعمل مع المؤسسين والتنفيذيين والشركات المتنامية لتبسيط العمليات وتبني الذكاء الاصطناعي وابتكار استراتيجيات تقنية تحقق نتائج ملموسة.'
            )}
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
            <ConnectButton
              variant="ghost"
              className="group relative overflow-hidden rounded-lg! bg-[#35BFFB]! px-7! py-3.5! text-[15px]! font-medium! text-white! transition-all duration-300 ease-out cursor-pointer shadow-md hover:shadow-[0_10px_25px_-5px_rgba(53,191,251,0.45)] hover:-translate-y-1 active:translate-y-0 text-center justify-center w-full sm:w-auto inline-flex items-center gap-2 border border-white/10"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {t('Book a consultation', 'احجز استشارة')}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 dir-rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
            </ConnectButton>

            <a
              href="#services"
              className="group relative overflow-hidden rounded-lg bg-[#3F7D6E] px-7 py-3.5 text-[15px] font-medium text-white transition-all duration-300 ease-out shadow-md hover:shadow-[0_10px_25px_-5px_rgba(63,125,110,0.45)] hover:-translate-y-1 active:translate-y-0 text-center w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/10"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {t('Explore my services', 'استكشف خدماتي')}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
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
            className="mx-auto w-140 max-w-full object-contain object-bottom drop-shadow-2xl"
          />
        </div>

        {/* RIGHT COLUMN — Journey Card */}
        <div className="relative z-20 lg:col-span-3 lg:col-start-10 lg:pt-2 flex flex-col justify-start">
          <div className="relative rounded-2xl bg-white/7 backdrop-blur-md border border-white/12 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden">

            {/* Ambient glows */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#35BFFB]/12 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

            {/* Section label */}
            <p className="text-[10px] tracking-[0.18em] uppercase font-semibold text-white/40 mb-4">
              {t('The Journey', 'رحلة المسير')}
            </p>

            {/* Timeline */}
            <div className="relative flex flex-col gap-0">

              {/* Node 1 — Malaysia */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#35BFFB]/20 border border-[#35BFFB]/40 shadow-[0_0_12px_rgba(53,191,251,0.3)]">
                    <span className="text-base leading-none">🇲🇾</span>
                    <span className="absolute inset-0 rounded-full animate-ping bg-[#35BFFB]/20" style={{ animationDuration: '2.5s' }} />
                  </div>
                  {/* Animated connector */}
                  <div className="relative w-px flex-1 my-1 overflow-hidden" style={{ height: '40px' }}>
                    <div className="absolute inset-0 bg-linear-to-b from-[#35BFFB]/50 to-emerald-400/50" />
                    <div className="absolute top-0 left-0 w-full animate-journey-beam" style={{ height: '40%', background: 'linear-gradient(to bottom, transparent, white, transparent)' }} />
                  </div>
                </div>
                <div className="pt-1 pb-5">
                  <p className="text-[12px] font-bold text-[#35BFFB] tracking-wide uppercase">{t('Malaysia', 'ماليزيا')}</p>
                  <p className="text-[12.5px] text-white/80 mt-0.5">{t('Studied & built foundations', 'دراسة وبناء الأسس')}</p>
                </div>
              </div>

              {/* Node 2 — Saudi Arabia */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                    <span className="text-base leading-none">🇸🇦</span>
                    <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/20" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-[12px] font-bold text-emerald-400 tracking-wide uppercase">{t('Saudi Arabia', 'السعودية')}</p>
                  <p className="text-[12.5px] text-white/80 mt-0.5">{t('Built real-world solutions', 'بنى حلولاً واقعية')}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 my-4" />

            {/* Quote */}
            <div className="flex gap-2.5 items-start">
              <div className="w-0.5 rounded-full bg-linear-to-b from-[#35BFFB] to-emerald-400 self-stretch shrink-0 mt-0.5" />
              <p className="text-[12.5px] leading-relaxed text-white/70 italic">
                {t(
                  'I bring a multicultural perspective that helps organizations bridge global technology with local business realities.',
                  'أحمل منظوراً متعدد الثقافات يساعد المؤسسات على الجمع بين التكنولوجيا العالمية وواقع الأعمال المحلية.'
                )}
              </p>
            </div>
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