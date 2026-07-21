import { type FormEvent, useState } from 'react';
import { Seo } from '../components/Seo';
import { ConnectButton, GlassCard, TechButton } from '../components/tech';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { useCalendly } from '../hooks/useCalendly';
import { publicApi } from '../lib/api';

export function ContactPage() {
  const { pathFor, t } = useLocale();
  const { settings } = useSite();
  const { isConfigured, openCalendar } = useCalendly();
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
      <section className="contact-page">
        <div className="container-site">
          <header className="contact-page__hero">
            <p className="eyebrow mb-4">{t('Contact', 'تواصل')}</p>
            <h1 className="page-hero__title">{t("Let's build something", 'لنبنِ شيئًا معًا')}</h1>
            <p className="page-hero__lead">
              {t(
                "Have a project or idea in mind? I'd love to hear about it.",
                'هل لديك مشروع أو فكرة؟ يسعدني سماعها.'
              )}
            </p>
          </header>

          <div className="contact-split contact-page__body">
            <div>
              <div className="flex flex-wrap gap-3 mb-10">
                {isConfigured ? (
                  <TechButton variant="cyan" onClick={() => void openCalendar()}>
                    {t('Pick a time on Calendly', 'اختر موعداً على كالندلي')}
                  </TechButton>
                ) : (
                  <ConnectButton variant="cyan" fallbackTo="/book">
                    {t('Book a Call', 'احجز مكالمة')}
                  </ConnectButton>
                )}
                <TechButton to={pathFor('/book')} variant="outline">
                  {t("Let's Connect", 'لنتواصل')}
                </TechButton>
              </div>

              <div className="space-y-4 text-cream-dim mb-8">
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

            <GlassCard hover={false} className="p-8 md:p-10">
              <p className="eyebrow mb-2">{t('Send a message', 'أرسل رسالة')}</p>
              <p className="text-cream-dim text-sm mb-6">
                {t('Prefer email? Every message is read.', 'تفضل البريد؟ تُقرأ كل رسالة.')}
              </p>
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="field">
                  <label htmlFor="name">{t('Name', 'الاسم')}</label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="tech-input"
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
                    className="tech-input"
                  />
                </div>
                <div className="field">
                  <label htmlFor="subject">{t('Subject', 'الموضوع')}</label>
                  <input
                    id="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="tech-input"
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
                    className="tech-input"
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
                <TechButton type="submit" variant="primary" className="w-full">
                  {sending ? t('Sending…', 'جاري الإرسال…') : t('Send message', 'أرسل الرسالة')}
                </TechButton>
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
              </form>
            </GlassCard>
          </div>
        </div>
      </section>
    </>
  );
}
