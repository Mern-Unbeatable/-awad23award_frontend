import { Seo } from '../components/Seo';
import { ConnectButton, TechButton } from '../components/tech';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { useCalendly } from '../hooks/useCalendly';

export function BookCallPage() {
  const { pathFor, t } = useLocale();
  const { settings } = useSite();
  const { isConfigured, openCalendar } = useCalendly();

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
      body: t('We will leave with a clear next move for your technology roadmap.', 'سنغادر بخطة واضحة لخارطة التقنية.'),
    },
  ];

  return (
    <>
      <Seo
        title={`${t("Let's Connect", 'لنتواصل')} | ${settings.brandName}`}
        description={t(
          'Book a consultation — CRM, automation, AI agents, or keynote opportunities.',
          'احجز استشارة — CRM والأتمتة ووكلاء الذكاء الاصطناعي أو فرص التحدث.'
        )}
        path={pathFor('/book')}
      />

      <section className="book-page">
        <div className="container-site book-page-inner relative z-10">
          <div className="book-layout">
            <div className="book-copy">
              <p className="eyebrow mb-4">{t("Let's Connect", 'لنتواصل')}</p>
              <h1 className="book-title">{t("Let's build something", 'لنبنِ شيئًا معًا')}</h1>
              <p className="book-lead">
                {t(
                  'Have a project or idea in mind? Book a focused conversation about CRM, automation, AI, or keynote opportunities.',
                  'هل لديك مشروع أو فكرة؟ احجز محادثة مركّزة حول CRM والأتمتة والذكاء الاصطناعي أو التحدث في المؤتمرات.'
                )}
              </p>

              <div className="book-actions">
                {isConfigured ? (
                  <TechButton variant="cyan" onClick={() => void openCalendar()}>
                    {t('Pick a time', 'اختر موعداً')}
                  </TechButton>
                ) : (
                  <ConnectButton variant="cyan">{t('Get In Touch', 'تواصل الآن')}</ConnectButton>
                )}
                <TechButton to={pathFor('/contact')} variant="outline">
                  {t('Send a message', 'أرسل رسالة')}
                </TechButton>
              </div>

              {!isConfigured && (
                <p className="book-warn">
                  {t(
                    'Scheduling link is not set yet. Connect Calendly in Admin → Settings, or use the contact form.',
                    'رابط الحجز غير مضبوط بعد. اربط كالندلي من لوحة التحكم → الإعدادات، أو استخدم نموذج التواصل.'
                  )}
                </p>
              )}
            </div>

            <div className="book-panel glass-card p-6!">
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
              {isConfigured && (
                <TechButton variant="cyan" className="w-full" onClick={() => void openCalendar()}>
                  {t('Open Calendly', 'افتح كالندلي')}
                </TechButton>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
