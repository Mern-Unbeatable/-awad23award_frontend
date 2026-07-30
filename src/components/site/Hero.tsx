import { Nav } from './Nav';
import { useLocale } from '../../context/LocaleContext';
import { ConnectButton, TechMarquee } from '../tech';

import a1 from '../../../award/src/assets/avatar-1.jpg';
import a2 from '../../../award/src/assets/avatar-2.jpg';
import a3 from '../../../award/src/assets/avatar-3.jpg';
import a4 from '../../../award/src/assets/avatar-4.jpg';

const avatars = [a1, a2, a3, a4];

export function Hero() {
  const { t, isRtl } = useLocale();

  const stats = [
    { value: '8+', label: t('Years Experience', 'سنوات خبرة') },
    { value: '10,000+', label: t('Hours Solving Business Problems', 'ساعة في حل مشكلات الأعمال') },
    { value: '2+', label: t('Technology Ventures Founded', 'مشاريع تقنية تم تأسيسها') },
  ];

  return (
    <section id="top" className="relative overflow-hidden bg-forest text-forest-foreground">
      <Nav />

      <div className="container mx-auto px-6 relative grid gap-10 pt-32 pb-12 lg:grid-cols-12 lg:gap-6 lg:pt-36 lg:pb-0">
        {/* Left column */}
        <div className="relative z-20 lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-foreground/10 whitespace-nowrap px-3.5 py-1.5 text-[10px] tracking-[0.16em] uppercase font-medium text-forest-foreground/85">
            <span className="h-1.5 w-1.5 rounded-full bg-sky" />
            {t('Technology Consultant • AI Strategist • Keynote Speaker', 'مستشار تقني • استراتيجي ذكاء اصطناعي • متحدث رئيسي')}
          </span>

          <h1 className="mt-6 max-w-[760px] text-[40px] sm:text-[52px] lg:text-[56px] leading-[1.1] font-medium">
            {t('Helping Businesses Build Smarter Systems That Actually Scale.', 'مساعدة الشركات في بناء أنظمة أذكى تتوسع بالفعل.')}
          </h1>

          <p className="mt-6 max-w-[540px] text-[18px] leading-relaxed text-forest-foreground/80">
            {t(
              'I work with founders, executives, and growing businesses to simplify operations, embrace AI, and create technology strategies that deliver measurable results.',
              'أعمل مع المؤسسين والتنفيذيين والشركات المتنامية لتبسيط العمليات وتبني الذكاء الاصطناعي وابتكار استراتيجيات تقنية تحقق نتائج ملموسة.'
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ConnectButton
              variant="ghost"
              className="!rounded-[8px] !bg-[#3F7D6E] hover:!bg-[#35BFFB] !px-6 !py-3 !text-[14px] !font-medium !text-white transition-all duration-300 cursor-pointer shadow-sm"
            >
              {t('Book a consultation', 'احجز استشارة')}
            </ConnectButton>
            <a
              href="#services"
              className="rounded-[8px] bg-[#35BFFB] hover:bg-[#3F7D6E] px-6 py-3 text-[14px] font-medium text-white transition-all duration-300 shadow-sm"
            >
              {t('Explore my services', 'استكشف خدماتي')}
            </a>
          </div>

          <dl className="mt-14 flex flex-wrap items-start gap-8 sm:gap-10 pb-14">
            {stats.map((s) => (
              <div key={s.value}>
                <dt className="font-display text-[2.2rem] leading-none font-semibold text-white">{s.value}</dt>
                <dd className="mt-3 text-[12px] text-white/80 font-normal leading-snug whitespace-nowrap">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait */}
        <div
          className={`pointer-events-none relative z-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex lg:justify-center ${
            isRtl ? 'lg:-translate-x-20' : 'lg:translate-x-20'
          }`}
        >
          <img
            src="/award.png"
            alt="Ahmed Ibrahim, technology consultant and keynote speaker"
            width={1024}
            height={1280}
            className="mx-auto w-[380px] max-w-full object-contain object-bottom sm:w-[480px] lg:w-[560px]"
          />
        </div>

        {/* Right column */}
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
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-forest"
                />
              ))}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-soft text-lg ring-2 ring-forest">
                +
              </span>
            </div>
          </div>
          <p className="mt-4 max-w-[260px] text-[18px] leading-relaxed text-forest-foreground/85">
            {t('18k+ satisfied customer all over World', '18k+ عميل راضٍ في جميع أنحاء العالم')}
          </p>

          <div
            className={`relative mt-46 mt-[184px] max-w-[350px] ${
              isRtl ? 'translate-x-6 sm:translate-x-8' : '-translate-x-6 sm:-translate-x-8'
            }`}
          >
            <svg
              className="w-11 h-11 text-white/20 absolute -top-8 -left-4 pointer-events-none"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-[18px] leading-relaxed text-forest-foreground/85 relative z-10">
              {t(
                "I'm a technology consultant, keynote speaker, and trusted advisor helping businesses embrace AI, modernize operations, and build future-ready systems through practical strategies and real-world experience.",
                "أنا مستشار تقني ومتحدث رئيسي ومستشار موثوق أساعد الشركات على تبني الذكاء الاصطناعي وتحديث العمليات وبناء أنظمة مستقبلية من خلال استراتيجيات عملية وخبرات واقعية."
              )}
              <svg
                className="w-10 h-10 text-white/20 inline-block align-bottom ms-2 pointer-events-none"
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
