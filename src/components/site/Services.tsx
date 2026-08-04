import { Brain, Cpu, BarChart3, CheckCircle2 } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { ScrollReveal } from './ScrollReveal';

export function Services() {
  const { t } = useLocale();

  const services = [
    {
      icon: Brain,
      title: t('AI & Automation', 'الذكاء الاصطناعي والأتمتة'),
      body: t(
        'Identify high-leverage automation opportunities, build AI-powered workflows, and implement tools that eliminate repetitive work without disrupting your team.',
        'تحديد فرص الأتمتة عالية التأثير، وبناء مسارات عمل مدعومة بالذكاء الاصطناعي، وتطبيق أدوات تلغي المهام المتكررة دون تعطيل فريقك.'
      ),
      points: [
        t('AI readiness audit', 'تدقيق الجاهزية للذكاء الاصطناعي'),
        t('Workflow automation design', 'تصميم أتمتة مسارات العمل'),
        t('LLM integration strategy', 'استراتيجية دمج نماذج اللغات الكبيرة'),
        t('ROI measurement frameworks', 'أطر قياس العائد على الاستثمار'),
      ],
    },
    {
      icon: Cpu,
      title: t('Technology Consulting', 'الاستشارات التقنية'),
      body: t(
        'Get clarity on the technology landscape, evaluate the right stack, and create a roadmap that aligns with your business goals – not just industry trends.',
        'الحصول على وضوح في المشهد التقني، وتقييم البنية المناسبة، وإنشاء خارطة طريق تتوافق مع أهداف عملك لا مجرد الصيحات.'
      ),
      points: [
        t('Tech stack review', 'مراجعة البنية التقنية'),
        t('Digital transformation roadmap', 'خارطة طريق التحول الرقمي'),
        t('Vendor & tool selection', 'اختيار الموردين والأدوات'),
        t('Architecture planning', 'تخطيط البنية التحتية'),
      ],
    },
    {
      icon: BarChart3,
      title: t('Business Systems', 'أنظمة الأعمال'),
      body: t(
        'Design and implement connected systems that scale with your growth – from CRMs to data pipelines – so your business operates like a well-oiled machine.',
        'تصميم وتطبيق أنظمة متصلة تتوسع مع نموك – من إدارة علاقات العملاء إلى خطوط البيانات – ليعمل عملك بكفاءة عالية.'
      ),
      points: [
        t('Operations mapping', 'رسم خرائط العمليات'),
        t('Data infrastructure', 'البنية التحتية للبيانات'),
        t('KPI dashboards', 'لوحات قياس الأداء الرئيسية'),
        t('Process standardization', 'توحيد المعايير والعمليات'),
      ],
    },
  ];

  return (
    <section id="services" className="bg-white section-padding">
      <ScrollReveal>
        <div className="container mx-auto px-6">
          {/* Top Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F3] text-[#2E7D6E] text-[12px] font-semibold tracking-wide uppercase mb-4">
              <span className="text-[10px]">✦</span>
              {t('SERVICES', 'الخدمات')}
            </div>
            <h2 className="text-[32px] sm:text-[44px] md:text-[52px] leading-[1.15] font-semibold text-foreground tracking-tight">
              {t('How to Develop Your Business with Modern Technologies', 'كيف اطوّر اعمالك بالتقنيات الحديثة')}
            </h2>
          </div>

          {/* 3 Service Cards */}
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, idx) => (
              <ScrollReveal key={s.title} delay={idx * 160}>
                <article className="group bg-[#FAFAFA] rounded-3xl p-8 flex flex-col justify-between border border-transparent hover:border-[#35BFFB] hover:shadow-[0_8px_30px_rgba(53,191,251,0.15)] transition-all duration-300 ease-in-out cursor-pointer h-full">
                  <div>
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-[14px] bg-[#36BFFB] text-white flex items-center justify-center mb-7">
                      <s.icon className="w-6 h-6 stroke-2" />
                    </div>

                    {/* Title */}
                    <h3 className="text-[20px] font-bold text-foreground mb-3">{s.title}</h3>

                    {/* Body Description */}
                    <p className="text-[16px] leading-relaxed text-[#52606D] mb-8">{s.body}</p>
                  </div>

                  {/* Checklist Points */}
                  <ul className="space-y-3 pt-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-[14px] text-[#52606D]">
                        <CheckCircle2 className="w-4 h-4 text-[#36BFFB] shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
