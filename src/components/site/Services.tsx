import { Brain, Cpu, BarChart3, CheckCircle2, type LucideIcon } from 'lucide-react';
import { useLocale } from '../../hooks/LocaleContext';
import { useSite } from '../../hooks/SiteContext';
import { pick } from '../../types';
import { ScrollReveal } from './ScrollReveal';

const SERVICE_ICONS: LucideIcon[] = [Brain, Cpu, BarChart3];

export function Services() {
  const { locale, t } = useLocale();
  const { services } = useSite();

  const publishedServices = services
    .filter((service) => service.published)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="services" className="bg-white section-padding">
      <ScrollReveal>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F3] text-[#2E7D6E] text-[12px] font-semibold tracking-wide uppercase mb-4">
              <span className="text-[10px]">✦</span>
              {t('SERVICES', 'الخدمات')}
            </div>
            <h2 className="text-[32px] sm:text-[44px] md:text-[52px] leading-[1.15] font-semibold text-foreground tracking-tight">
              {t(
                'How to Develop Your Business with Modern Technologies',
                'كيف اطوّر اعمالك بالتقنيات الحديثة',
              )}
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {publishedServices.map((service, idx) => {
              const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];
              const features =
                locale === 'ar' ? service.featuresAr : service.featuresEn;

              return (
                <ScrollReveal key={service.id} delay={idx * 160}>
                  <article
                    className="group bg-[#FAFAFA] rounded-3xl p-8 flex flex-col justify-between border border-transparent hover:border-[#35BFFB] hover:shadow-[0_8px_30px_rgba(53,191,251,0.15)] transition-all duration-300 ease-in-out cursor-pointer h-full"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-[14px] bg-[#36BFFB] text-white flex items-center justify-center mb-7">
                        <Icon className="w-6 h-6 stroke-2" />
                      </div>
                      <h3 className="text-[20px] font-bold text-foreground mb-3">
                        {pick(service, locale, 'title')}
                      </h3>
                      <p className="text-[16px] leading-relaxed text-[#52606D] mb-8">
                        {pick(service, locale, 'excerpt')}
                      </p>
                    </div>
                    {features.length > 0 && (
                      <ul className="space-y-3 pt-2">
                        {features.map((point) => (
                          <li
                            key={point}
                            className="flex items-center gap-2.5 text-[14px] text-[#52606D]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#36BFFB] shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
