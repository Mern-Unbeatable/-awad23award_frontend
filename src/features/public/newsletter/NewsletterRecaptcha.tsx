import { forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useLocale } from '../../../hooks/LocaleContext';
import { RECAPTCHA_SITE_KEY } from '../../../lib/env';

type NewsletterRecaptchaProps = {
  onChange: (token: string | null) => void;
};

export const NewsletterRecaptcha = forwardRef<ReCAPTCHA, NewsletterRecaptchaProps>(
  function NewsletterRecaptcha({ onChange }, ref) {
    const { locale } = useLocale();

    if (!RECAPTCHA_SITE_KEY) return null;

    return (
      <ReCAPTCHA
        ref={ref}
        sitekey={RECAPTCHA_SITE_KEY}
        hl={locale === 'ar' ? 'ar' : 'en'}
        onChange={onChange}
        onExpired={() => onChange(null)}
        onErrored={() => onChange(null)}
      />
    );
  },
);
