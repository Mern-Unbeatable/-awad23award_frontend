import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

export function Portfolio() {
  const { t, pathFor } = useLocale();

  const projects = [
    {
      slug: 'enterprise-dealflow-platform',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      tag: t('Case Study', 'دراسة حالة'),
      tagStyle: 'bg-white text-black font-semibold',
      title: t('Enterprise Dealflow Platform', 'منصة تدفق البيانات المؤسسية'),
      sub: t('Product Owner • Investment Technology', 'مالك المنتج • تقنية الاستثمار'),
    },
    {
      slug: 'crm-strategy',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      tag: t('Project', 'مشروع'),
      tagStyle: 'bg-[#E0E7FF] text-[#3730A3] font-medium',
      title: t('CRM Strategy', 'استراتيجية إدارة علاقات العملاء'),
      sub: t('Enterprise Consulting', 'استشارات المؤسسات'),
    },
    {
      slug: 'ad-squared',
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      tag: t('Startup', 'شركة ناشئة'),
      tagStyle: 'bg-[#FCE7F3] text-[#9D174D] font-medium',
      title: t('AD Squared', 'إيه دي سكويرد'),
      sub: t('Founder', 'المؤسس'),
    },
    {
      slug: 'public-speaking',
      img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      tag: t('Expertise', 'خبرة'),
      tagStyle: 'bg-[#FCE7F3] text-[#9D174D] font-medium',
      title: t('Public Speaking', 'الحديث في المحافل العامة'),
      sub: t('Speaker & Communicator', 'متحدث ومحاضر'),
    },
    {
      slug: '75000-sar-startup-grant',
      img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
      tag: t('Recognition', 'تكريم'),
      tagStyle: 'bg-[#CFFAFE] text-[#0E7490] font-medium',
      title: t('75,000 SAR Startup Grant', 'منحة 75,000 ريال للشركات الناشئة'),
      sub: t('Startup Achievement', 'إنجاز ريادي'),
    },
    {
      slug: 'product-management',
      img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      tag: t('Expertise', 'خبرة'),
      tagStyle: 'bg-[#DCFCE7] text-[#15803D] font-medium',
      title: t('Product Management', 'إدارة المنتجات التقنية'),
      sub: t('Digital Transformation', 'التحول الرقمي'),
    },
  ];

  return (
    <section id="work" className="bg-black text-white py-28">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Title */}
        <h2 className="text-[72px] md:text-[96px] leading-[1.0] font-serif font-semibold text-white tracking-tight">
          {t('My Portfolio', 'معرض أعمالي')}
        </h2>

        {/* Subtitle description and top-right button */}
        <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <p className="max-w-xl text-[16px] leading-relaxed text-gray-200">
            {t(
              'From AI consulting and digital transformation to executive advisory, I work closely with organizations to understand their goals and deliver technology solutions that drive measurable growth.',
              'من استشارات الذكاء الاصطناعي والتحول الرقمي إلى تقديم المشورة التنفيذية، أعمل عن قرب مع المؤسسات لفهم أهدافها وتقديم حلول تقنية تحقق نمواً ملموساً.'
            )}
          </p>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-white/40 px-6 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-white hover:text-black shrink-0"
          >
            <span>{t('Access My Secret Work', 'الاطلاع على الأعمال الخاصة')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
        </div>

        {/* 6 Projects Grid */}
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.title}
              to={pathFor(`/work/${p.slug}`)}
              className="group cursor-pointer block"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-[4px] bg-[#1E1E1E] aspect-[16/10]">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={800}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge Overlay */}
                <span
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[12px] shadow-sm ${p.tagStyle}`}
                >
                  {p.tag}
                </span>
              </div>

              {/* Title & Category Subtitle */}
              <h3 className="mt-4 text-[18px] font-bold text-white group-hover:text-sky-300 transition-colors">
                {p.title}
              </h3>
              <p className="mt-1 text-[13.5px] text-gray-400 font-normal">{p.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
