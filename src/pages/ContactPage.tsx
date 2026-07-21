import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { publicApi } from '../lib/api';

export function ContactPage() {
  const { locale, pathFor, t } = useLocale();
  const { settings } = useSite();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await publicApi.contact(form);
      setStatus('ok');
      setForm({ name: '', email: '', subject: '', message: '', website: '' });
    } catch {
      setStatus('err');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Seo
        title={`${t('Contact', 'تواصل')} | ${settings.brandName}`}
        description={t('Book a consultation or send a message.', 'احجز استشارة أو أرسل رسالة.')}
        path={pathFor('/contact')}
      />
      <section className="pt-32 pb-20 container-site grid lg:grid-cols-2 gap-14">
        <div>
          <p className="eyebrow mb-4">{t('Contact', 'تواصل')}</p>
          <h1 className="font-display font-extrabold text-[clamp(2.4rem,6vw,4rem)] leading-none mb-6">
            {t('Let’s build your brand presence.', 'لنبنِ حضور علامتك.')}
          </h1>
          <p className="text-cream/65 text-lg leading-relaxed mb-8 max-w-lg">
            {t(
              'Prefer a call? Book a time on our scheduling page. Or send a note — every message is read.',
              'تفضل مكالمة؟ احجز موعداً من صفحة الحجز. أو أرسل ملاحظة — تُقرأ كل رسالة.'
            )}
          </p>
          <Link to={pathFor('/book')} className="btn btn-accent mb-10 inline-flex">
            {t('Book a Call', 'احجز مكالمة')}
          </Link>
          <div className="space-y-3 text-cream/70">
            <p>
              <span className="text-cream/40 text-xs tracking-widest uppercase block mb-1">Email</span>
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-accent">
                {settings.contactEmail}
              </a>
            </p>
            {settings.contactPhone && (
              <p>
                <span className="text-cream/40 text-xs tracking-widest uppercase block mb-1">Phone</span>
                {settings.contactPhone}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-ink-soft border border-cream/10 p-8 md:p-10 space-y-5 h-fit">
          <div className="field">
            <label htmlFor="name">{t('Name', 'الاسم')}</label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="email">{t('Email', 'البريد')}</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="subject">{t('Subject', 'الموضوع')}</label>
            <input
              id="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="message">{t('Message', 'الرسالة')}</label>
            <textarea
              id="message"
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="sr-only"
            tabIndex={-1}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-accent w-full" disabled={sending}>
            {sending ? t('Sending…', 'جاري الإرسال…') : t('Send message', 'أرسل الرسالة')}
          </button>
          {status === 'ok' && (
            <p className="text-accent text-sm">{t('Message sent. Thank you!', 'تم إرسال الرسالة. شكراً!')}</p>
          )}
          {status === 'err' && (
            <p className="text-red-300 text-sm">
              {t(
                'Could not send. Please try again or email directly.',
                'تعذر الإرسال. حاول مجدداً أو راسل مباشرة.'
              )}
            </p>
          )}
          <p className="text-cream/35 text-xs">
            {locale === 'en'
              ? 'Spam protection enabled. Your details are never sold.'
              : 'حماية من البريد المزعج مفعّلة. لن تُباع بياناتك.'}
          </p>
        </form>
      </section>
    </>
  );
}
