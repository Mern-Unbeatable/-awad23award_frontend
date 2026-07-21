import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useSite } from '../../context/SiteContext';
import { publicApi } from '../../lib/api';

export function Footer() {
  const { pathFor, t, locale } = useLocale();
  const { settings, services } = useSite();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  async function onSubscribe(e: FormEvent) {
    e.preventDefault();
    try {
      await publicApi.subscribe(email, locale);
      setStatus('ok');
      setEmail('');
    } catch {
      setStatus('err');
    }
  }

  return (
    <footer className="border-t border-cream/10 bg-ink-soft">
      <div className="container-site py-16 grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold mb-3">{settings.brandName}</p>
          <p className="text-cream/60 max-w-sm leading-relaxed">
            {locale === 'ar' ? settings.taglineAr : settings.taglineEn}
          </p>
          <div className="flex gap-4 mt-6 text-xs tracking-[0.18em] uppercase font-display text-cream/50">
            {settings.socialInstagram && (
              <a href={settings.socialInstagram} target="_blank" rel="noreferrer" className="hover:text-accent">
                IG
              </a>
            )}
            {settings.socialLinkedin && (
              <a href={settings.socialLinkedin} target="_blank" rel="noreferrer" className="hover:text-accent">
                IN
              </a>
            )}
            {settings.socialYoutube && (
              <a href={settings.socialYoutube} target="_blank" rel="noreferrer" className="hover:text-accent">
                YT
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">{t('Explore', 'استكشف')}</p>
          <div className="flex flex-col gap-2 text-cream/70">
            <Link to={pathFor('/')} className="hover:text-accent">
              {t('Home', 'الرئيسية')}
            </Link>
            {services.slice(0, 3).map((s) => (
              <Link key={s.id} to={pathFor(`/services/${s.slug}`)} className="hover:text-accent">
                {locale === 'ar' ? s.titleAr : s.titleEn}
              </Link>
            ))}
            <Link to={pathFor('/journal')} className="hover:text-accent">
              {t('Journal', 'المجلة')}
            </Link>
            <Link to={pathFor('/gallery')} className="hover:text-accent">
              {t('Gallery', 'المعرض')}
            </Link>
            <Link to={pathFor('/book')} className="hover:text-accent">
              {t('Book a Call', 'احجز مكالمة')}
            </Link>
            <Link to={pathFor('/contact')} className="hover:text-accent">
              {t('Contact', 'تواصل')}
            </Link>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">{t('Newsletter', 'النشرة')}</p>
          <p className="text-cream/60 text-sm mb-4">
            {t('Insights on personal brand, visibility & stage presence.', 'رؤى حول العلامة الشخصية والظهور وحضور المنصة.')}
          </p>
          <form onSubmit={onSubscribe} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('Your email', 'بريدك الإلكتروني')}
              className="bg-ink border border-cream/15 px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <input type="text" name="website" className="sr-only" tabIndex={-1} autoComplete="off" />
            <button type="submit" className="btn btn-accent w-full">
              {t('Subscribe', 'اشترك')}
            </button>
            {status === 'ok' && (
              <p className="text-accent text-xs">{t('You are on the list.', 'أنت على القائمة.')}</p>
            )}
            {status === 'err' && (
              <p className="text-red-300 text-xs">{t('Something went wrong.', 'حدث خطأ ما.')}</p>
            )}
          </form>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-cream/40 text-xs tracking-wider">
        © {new Date().getFullYear()} {settings.brandName}. {t('All rights reserved.', 'جميع الحقوق محفوظة.')}
      </div>
    </footer>
  );
}
