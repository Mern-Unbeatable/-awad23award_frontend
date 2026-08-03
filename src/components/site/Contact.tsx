import { useState } from 'react';
import { useLocale } from '../../context/LocaleContext';
import { ScrollReveal } from './ScrollReveal';

export function Contact() {
  const { t } = useLocale();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert(t("Thanks for subscribing! I'll be in touch.", 'شكراً لفي اشتراكك! سأتواصل معك قريباً.'));
    setEmail('');
  };

  return (
    <section id="contact" className="bg-white section-padding">
      <ScrollReveal>
        <div className="container mx-auto px-6 border-t border-gray-200/80 pt-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {/* Left Column: Heading and description */}
            <div>
              <h2 className="text-[32px] sm:text-[44px] md:text-[52px] font-bold text-foreground tracking-tight leading-tight">
                {t('Get In Touch', 'تواصل معي')}
              </h2>
              <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#52606D]">
                {t(
                  'Insights on startups, business strategy, digital transformation, and building products in the Middle East. Real experiences, practical lessons, and ideas you can apply.',
                  'ارؤى حول الشركات الناشئة، استراتيجية الأعمال، التحول الرقمي، وبناء المنتجات في الشرق الأوسط. تجارب واقعية، دروس عملية، وأفكار يمكنك تطبيقها.'
                )}
              </p>
            </div>

            {/* Right Column: Newsletter Subscription Form */}
            <div className="w-full max-w-lg md:ml-auto">
              <form onSubmit={handleSubmit}>
                <label htmlFor="newsletter-email" className="block text-[13px] font-semibold text-foreground mb-3">
                  {t('Newsletter', 'النشرة البريدية')}
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('Email address', 'عنوان البريد الإلكتروني')}
                    className="w-full rounded-full border border-gray-300/90 bg-white px-6 py-3.5 text-[14px] text-foreground placeholder:text-gray-400 outline-none focus:border-[#36BFFB] transition-all shadow-sm"
                  />
                  <button
                    type="submit"
                    className="bg-[#36BFFB] hover:bg-[#20B0F0] text-white font-medium rounded-full px-8 py-3.5 text-[14px] transition-colors shrink-0 cursor-pointer shadow-sm text-center"
                  >
                    {t('Submit', 'إرسال')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
