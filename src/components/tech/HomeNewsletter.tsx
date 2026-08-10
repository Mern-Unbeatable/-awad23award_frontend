import { type FormEvent, useState } from 'react';
import { useLocale } from '../../hooks/LocaleContext';
import { subscribeRequest } from '../../features/public/newsletter/newsletterApi';
import { ArrowIcon } from './ArrowIcon';

export function HomeNewsletter() {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await subscribeRequest(email);
      setStatus('ok');
      setEmail('');
    } catch {
      setStatus('err');
    }
  }

  return (
    <div className="ref-newsletter" id="insights">
      <div className="ref-nl-left">
        <div className="ref-nl-icon" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="M3 8l9 6 9-6" />
          </svg>
        </div>
        <div className="ref-nl-copy">
          <h3>{t('Subscribe to the newsletter for practical insights on startups, product building, and digital transformation', 'اشترك في النشرة البريدية لتصلك رؤى عملية حول الشركات الناشئة، بناء المنتجات، والتحول الرقمي')}</h3>
          <p>
            {t(
              "Let's turn your idea into reality. Whether you're launching a new product or scaling your current business, I help transform ideas into actionable solutions.",
              'نحوّل فكرتك إلى واقع سواء كنت تطلق منتجًا جديدًا أو تطور عملك الحالي، أساعدك على تحويل الأفكار إلى حلول قابلة للتنفيذ'
            )}
          </p>
        </div>
      </div>

      <form className="ref-nl-form" onSubmit={onSubmit}>
        <div className="ref-nl-field">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('Enter your email', 'أدخل بريدك الإلكتروني')}
            aria-label={t('Email address', 'البريد الإلكتروني')}
          />
          <button type="submit" className="ref-nl-submit">
            {t('Subscribe', 'اشترك')}
            <ArrowIcon />
          </button>
        </div>
        <input type="text" name="website" className="sr-only" tabIndex={-1} autoComplete="off" />
        {status === 'ok' && <p className="ref-nl-status is-ok">{t('You are on the list.', 'أنت على القائمة.')}</p>}
        {status === 'err' && <p className="ref-nl-status is-err">{t('Something went wrong.', 'حدث خطأ.')}</p>}
      </form>
    </div>
  );
}
