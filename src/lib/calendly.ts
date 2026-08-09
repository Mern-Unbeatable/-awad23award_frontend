declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
      closePopupWidget?: () => void;
    };
  }
}

/** Reject bare calendly.com homepage — that embeds the marketing site. */
export function normalizeCalendlyUrl(raw: string) {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  try {
    const u = new URL(trimmed);
    if (!u.hostname.includes('calendly.com')) return '';
    const path = u.pathname.replace(/\/+$/, '');
    if (!path) return '';
    return `${u.origin}${path}`;
  } catch {
    return '';
  }
}

export function bookingUrl(base: string) {
  if (!base) return '';
  return `${base}?hide_gdpr_banner=1&hide_landing_page_details=1&background_color=ffffff&text_color=1a1a1a&primary_color=0b1220`;
}

export function resolveCalendlyUrl(raw: string) {
  return bookingUrl(normalizeCalendlyUrl(raw));
}

/** Non-Calendly http(s) booking links stored in the same settings field. */
export function resolveExternalBookingUrl(raw: string) {
  const trimmed = (raw || '').trim();
  if (!trimmed || normalizeCalendlyUrl(trimmed)) return '';
  try {
    const u = new URL(trimmed);
    if (u.protocol === 'http:' || u.protocol === 'https:') return trimmed;
  } catch {
    /* invalid URL */
  }
  return '';
}

export function loadCalendlyAssets() {
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

export async function openCalendlyPopup(url: string) {
  if (!url) return false;
  await loadCalendlyAssets();
  window.Calendly?.initPopupWidget({ url });
  return true;
}

export function closeCalendlyPopup() {
  window.Calendly?.closePopupWidget?.();
}
