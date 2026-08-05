import { useState } from 'react';
import { useLocale } from '../../context/LocaleContext';
import { publicApi } from '../../lib/api';
import { ScrollReveal } from './ScrollReveal';

export function Contact() {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await publicApi.subscribe(email.trim());
      setStatus('ok');
      setEmail('');
    } catch {
      setStatus('err');
    }
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
                  'اشترك في النشرة البريدية لتصلك رؤى عملية حول الشركات الناشئة، بناء المنتجات، والتحول الرقمي، مع دروس وأفكار قابلة للتطبيق'
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
                {status === 'ok' && (
                  <p className="mt-2 text-xs font-semibold text-emerald-600">
                    {t('You are on the list! Thanks for subscribing.', 'أنت على القائمة! شكراً لفي اشتراكك.')}
                  </p>
                )}
                {status === 'err' && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    {t('Something went wrong. Please try again.', 'حدث خطأ. يرجى المحاولة مرة أخرى.')}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
