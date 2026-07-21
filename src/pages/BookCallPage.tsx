import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { PageReveal } from '../components/PageReveal';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
      closePopupWidget?: () => void;
    };
  }
}

/** Reject bare calendly.com homepage — that embeds the marketing site. */
function normalizeCalendlyUrl(raw: string) {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  try {
    const u = new URL(trimmed);
    if (!u.hostname.includes('calendly.com')) return '';
    const path = u.pathname.replace(/\/+$/, '');
    if (!path || path === '') return '';
    // Keep only scheduling-safe query params we add ourselves
    return `${u.origin}${path}`;
  } catch {
    return '';
  }
}

function bookingUrl(base: string) {
  if (!base) return '';
  // Dark primary keeps the white Calendly UI clean (brand yellow flooded every control)
  return `${base}?hide_gdpr_banner=1&hide_landing_page_details=1&background_color=ffffff&text_color=1a1a1a&primary_color=121212`;
}

function loadCalendlyAssets() {
  return new Promise<void>((resolve) => {
    if (window.Calendly) {
      resolve();
      return;
    }

    if (!document.querySelector('link[data-calendly-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.dataset.calendlyCss = '1';
      document.head.appendChild(link);
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-calendly-widget]');
    if (existing) {
      if (window.Calendly) resolve();
      else existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.dataset.calendlyWidget = '1';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export function BookCallPage() {
  const { pathFor, t } = useLocale();
  const { settings } = useSite();
  const base = normalizeCalendlyUrl(settings.calendlyUrl || '');
  const url = bookingUrl(base);

  useEffect(() => {
    if (!url) return;
    void loadCalendlyAssets();
    return () => {
      window.Calendly?.closePopupWidget?.();
    };
  }, [url]);

  const openCalendar = useCallback(async () => {
    if (!url) return;
    await loadCalendlyAssets();
    window.Calendly?.initPopupWidget({ url });
  }, [url]);

  const steps = [
    {
      n: '01',
      title: t('Choose a time', 'اختر وقتاً'),
      body: t('Open the calendar and pick a slot that fits your week.', 'افتح التقويم واختر موعداً يناسب أسبوعك.'),
    },
    {
      n: '02',
      title: t('Share context', 'شارك السياق'),
      body: t('Tell me briefly what you want to work on before we meet.', 'أخبرني باختصار بما تريد العمل عليه قبل اللقاء.'),
    },
    {
      n: '03',
      title: t('Show up ready', 'احضر مستعداً'),
      body: t('We will leave with a clear next move for your personal brand.', 'سنغادر بخطة واضحة لعلامتك الشخصية.'),
    },
  ];

  return (
    <>
      <Seo
        title={`${t('Book a Call', 'احجز مكالمة')} | ${settings.brandName}`}
        description={t(
          'Choose a time that works for you and book a consultation directly.',
          'اختر وقتاً يناسبك واحجز استشارة مباشرة.'
        )}
        path={pathFor('/book')}
      />

      <section className="book-page">
        <div className="container-site book-page-inner">
          <PageReveal>
            <div className="book-layout">
              <div className="book-copy">
                <p className="eyebrow mb-4">{t('Consultation', 'استشارة')}</p>
                <h1 className="book-title">{t('Book a Call', 'احجز مكالمة')}</h1>
                <p className="book-lead">
                  {t(
                    'A focused conversation about visibility, positioning, and the next move for your brand.',
                    'محادثة مركّزة حول الظهور والتموضع والخطوة التالية لعلامتك.'
                  )}
                </p>

                {!url && (
                  <>
                    <div className="book-actions">
                      <Link to={pathFor('/contact')} className="btn btn-accent">
                        {t('Contact instead', 'تواصل بدلاً من ذلك')}
                      </Link>
                    </div>
                    <p className="book-warn">
                      {t(
                        'Scheduling link is not set yet. Connect Calendly in Admin → Settings.',
                        'رابط الحجز غير مضبوط بعد. اربط كالندلي من لوحة التحكم → الإعدادات.'
                      )}
                    </p>
                  </>
                )}
              </div>

              <div className="book-panel">
                <p className="book-panel-kicker">{t('How it works', 'كيف يعمل')}</p>
                <ul className="book-steps">
                  {steps.map((step) => (
                    <li key={step.n} className="book-step">
                      <span className="book-step-n">{step.n}</span>
                      <div>
                        <h2>{step.title}</h2>
                        <p>{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                {url && (
                  <button type="button" className="btn btn-accent w-full" onClick={() => void openCalendar()}>
                    {t('Pick a time', 'اختر موعداً')}
                  </button>
                )}
              </div>
            </div>
          </PageReveal>
        </div>
      </section>
    </>
  );
}
