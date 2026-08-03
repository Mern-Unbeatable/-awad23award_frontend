import { useLocale } from '../../context/LocaleContext';
import { ScrollReveal } from './ScrollReveal';

export function About() {
  const { t, locale } = useLocale();

  const topics = [
    {
      title: t('AI & Automation', 'الذكاء الاصطناعي والأتمتة'),
      body: t('Helping businesses automate workflows and improve efficiency.', 'مساعدة الشركات على أتمتة سير العمل وتحسين الكفاءة.'),
    },
    {
      title: t('Business Strategy', 'استراتيجية الأعمال'),
      body: t('Aligning technology with clear business goals and sustainable growth.', 'ربط التقنية بأهداف عمل واضحة ونمو مستدام.'),
    },
    {
      title: t('Digital Transformation', 'التحول الرقمي'),
      body: t('Modernizing operations with scalable digital solutions.', 'تحديث العمليات بحلول رقمية قابلة للتوسع.'),
    },
    {
      title: t('Keynote Speaking', 'التحدث في المؤتمرات'),
      body: t('Sharing practical insights on AI, innovation, and the future of business.', 'تقديم رؤى عملية حول الذكاء الاصطناعي والابتكار ومستقبل الأعمال.'),
    },
  ];

  return (
    <section id="about" className="bg-white section-padding">
      <ScrollReveal>
        <div className="container mx-auto px-6 grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left column */}
          <div>
            {/* Eyebrow */}
            <p className="text-[13px] text-forest font-medium">
              {t('( About Me )', '( عني )')}
            </p>

            <h2 className="mt-4 text-[32px] sm:text-[44px] lg:text-[56px] leading-[1.12] font-semibold text-foreground max-w-xl">
              {locale === 'ar' ? (
                'نظرة عميقة في تجاربي والدروس المستفادة'
              ) : (
                <>
                  A Deep Dive into My<br className="hidden sm:inline" />
                  Life's Experiences and<br className="hidden sm:inline" />
                  Lessons Learned
                </>
              )}
            </h2>

            {/* Topics */}
            <div className="mt-10 flex flex-col gap-4 max-w-md">
              {topics.map((tItem) => (
                <div
                  key={tItem.title}
                  className="group bg-[#FAFAFA] p-5 sm:p-6 rounded-lg border border-transparent hover:border-[#35BFFB] hover:shadow-[0_8px_25px_rgba(53,191,251,0.15)] transition-all duration-300 ease-in-out cursor-pointer"
                >
                  {/* Wave / signal icon */}
                  <svg
                    className="w-5 h-5 text-[#35BFFB] mb-3 transition-transform duration-300 group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M2 12h2M6 8v8M10 5v14M14 8v8M18 10v4M22 12h-2" />
                  </svg>
                  <h3 className="text-[20px] sm:text-[24px] font-bold text-foreground group-hover:text-[#35BFFB] transition-colors duration-300">{tItem.title}</h3>
                  <p className="mt-2 text-[14px] sm:text-[16px] leading-relaxed text-muted-foreground">{tItem.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div>
            <img
              src="/about.png"
              alt="Ahmed Ibrahim at a technology conference"
              loading="lazy"
              width={1200}
              height={800}
              className="w-full rounded-xl object-cover max-h-130"
            />

            <div className="mt-5 space-y-4 text-[16px] sm:text-[18px] leading-relaxed text-[#175069]">
              <p>
                {t("Hello, I'm", 'مرحباً، أنا')}{' '}
                <span className="font-semibold text-[#36BFFB]">
                  {t('Ahmed Ibrahim', 'أحمد إبراهيم')}
                </span>
                {t(
                  '. I build software products, enterprise systems, and digital solutions that solve real business problems.',
                  '. أبني منتجات برمجية وأنظمة مؤسسية وحلولاً رقمية تحل مشكلات الأعمال الحقيقية.'
                )}
              </p>
              <p>
                {t(
                  "I'm the founder of AD Squared, where I help entrepreneurs and organizations turn ideas into successful products. From validating concepts and defining product strategy to building MVPs and scalable platforms, I work with teams to create technology that delivers measurable business value.",
                  'أنا مؤسس AD Squared، حيث أساعد رواد الأعمال والمؤسسات على تحويل الأفكار إلى منتجات ناجحة، من التحقق من المفاهيم وتحديد استراتيجية المنتج إلى بناء النماذج الأولية والمنصات القابلة للتوسع.'
                )}
              </p>
              <p>
                {t(
                  'With over eight years of experience in software engineering and digital transformation, I specialize in enterprise applications, AI-powered solutions, CRM platforms, automation, and business process design. My background includes designing and delivering large-scale systems for both startups and enterprise organizations, with expertise in Microsoft Dynamics 365 CRM, Power Platform, and enterprise architecture.',
                  'مع أكثر من ثماني سنوات من الخبرة في هندسة البرمجيات والتحول الرقمي، أتخصص في تطبيقات المؤسسات والحلول المدعومة بالذكاء الاصطناعي ومنصات CRM والأتمتة وتصميم العمليات التجارية.'
                )}
              </p>
              <p>
                {t(
                  "I believe great technology starts with understanding people and business—not just writing code. Whether I'm building an AI solution, a customer platform, or an internal enterprise system, my focus is always on simplifying complexity, improving decision-making, and creating products people genuinely want to use.",
                  'أؤمن بأن التقنية الرائعة تبدأ بفهم الناس والأعمال، وليس مجرد كتابة الكود. سواء كنت أبني حلاً للذكاء الاصطناعي أو منصة للعملاء أو نظاماً مؤسسياً داخلياً، فإن تركيزي دائماً على تبسيط التعقيد وتحسين صنع القرار.'
                )}
              </p>
              <p>
                {t(
                  "Outside of client work, I'm passionate about entrepreneurship, product strategy, and venture building. I enjoy working with founders to validate opportunities, achieve product-market fit, and build businesses on strong technology foundations.",
                  'خارج نطاق العمل مع العملاء، أنا شغوف بريادة الأعمال واستراتيجية المنتج وبناء المشاريع.'
                )}
              </p>
              <p>
                {t(
                  "My work lives at the intersection of technology, entrepreneurship, and innovation—and I'm always exploring new ways to build products, companies, and ideas that create lasting impact. If you're building something ambitious, I'd love to connect.",
                  'يقع عملي عند تقاطع التكنولوجيا وريادة الأعمال والابتكار، وأنا دائماً أستكشف طرقاً جديدة لبناء منتجات وشركات وأفكار تخلق تأثيراً دائماً.'
                )}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
