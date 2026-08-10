import type { ReactNode } from 'react';
import { useLocale } from '../../hooks/LocaleContext';

interface MissionBlockProps {
  missionText: string;
}

type ExpItem = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
};

function LogoMicrosoft() {
  return (
    <svg viewBox="0 0 23 23" width="18" height="18" aria-hidden>
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

function LogoPowerPlatform() {
  return (
    <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden>
      <path fill="#742774" d="M16 2L4 8v8c0 7.2 5.2 13.9 12 15.5C22.8 29.9 28 23.2 28 16V8L16 2z" />
      <path fill="#B4A0FF" d="M16 6.2L8 10.2v5.6c0 4.8 3.4 9.3 8 10.5 4.6-1.2 8-5.7 8-10.5v-5.6L16 6.2z" />
      <circle cx="16" cy="16" r="4.2" fill="#FFFFFF" />
      <circle cx="16" cy="16" r="2.2" fill="#742774" />
    </svg>
  );
}

function LogoWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M17.5 14.3c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.8-.9 2s.9 2.3 1 2.5c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z"
      />
    </svg>
  );
}

function LogoAzure() {
  return (
    <svg viewBox="0 0 96 96" width="18" height="18" aria-hidden>
      <path fill="#0078D4" d="M33.9 11.6L11.6 70.8h18.9l4.8-12.3h25.5L48.6 11.6H33.9zm7.2 15.4l12.1 24.1H33.4l7.7-24.1z" />
      <path fill="#0078D4" d="M59.4 41.2L48.9 70.8h35.5L59.4 41.2z" opacity="0.85" />
    </svg>
  );
}

function LogoPowerBI() {
  return (
    <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden>
      <rect x="4" y="14" width="6" height="14" rx="1.5" fill="#F2C811" />
      <rect x="13" y="8" width="6" height="20" rx="1.5" fill="#F2C811" />
      <rect x="22" y="2" width="6" height="26" rx="1.5" fill="#F2C811" />
    </svg>
  );
}

function LogoAI() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path fill="#3B82F6" d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" />
    </svg>
  );
}

function LogoCRM() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <circle cx="9" cy="8" r="3.2" fill="#5B9BD5" />
      <circle cx="16.5" cy="9" r="2.5" fill="#2E75B6" />
      <path fill="#5B9BD5" d="M3.2 19c.7-3 3-4.6 5.8-4.6S14.1 16 14.8 19H3.2z" />
      <path fill="#2E75B6" d="M14.2 15.2c1.9.2 3.4 1.3 4.1 3.3h-4.2c-.2-.9-.7-1.7-1.5-2.3l1.6-1z" />
    </svg>
  );
}

function LogoAutomation() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <circle cx="12" cy="12" r="3" fill="#3B82F6" />
      <path
        fill="#60A5FA"
        d="M12 2.5l1.2 2.8 2.9.3-2.2 1.9.7 2.8L12 8.9l-2.6 1.4.7-2.8-2.2-1.9 2.9-.3L12 2.5zm0 14.2l1.2 2.8 2.9.3-2.2 1.9.7 2.8L12 23l-2.6-1.5.7-2.8-2.2-1.9 2.9-.3L12 16.7z"
      />
    </svg>
  );
}

function LogoDigital() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="#38BDF8" strokeWidth="1.8" />
      <ellipse cx="12" cy="12" rx="4" ry="9" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
      <path d="M3 12h18" stroke="#38BDF8" strokeWidth="1.5" />
    </svg>
  );
}

export function MissionBlock({ missionText }: MissionBlockProps) {
  const { t } = useLocale();

  const items: ExpItem[] = [
    { title: 'Microsoft', subtitle: 'Dynamics 365', icon: <LogoMicrosoft /> },
    { title: 'Power', subtitle: 'Platform', icon: <LogoPowerPlatform /> },
    { title: t('AI Solutions', 'حلول الذكاء الاصطناعي'), icon: <LogoAI /> },
    { title: 'WhatsApp', subtitle: 'Business API', icon: <LogoWhatsApp /> },
    { title: 'Azure', icon: <LogoAzure /> },
    { title: 'Power BI', icon: <LogoPowerBI /> },
    { title: 'CRM Systems', icon: <LogoCRM /> },
    { title: 'Automation', icon: <LogoAutomation /> },
    { title: 'Digital Transformation', icon: <LogoDigital /> },
  ];

  const track = [...items, ...items];

  return (
    <div className="ref-mission" id="about">
      <div className="ref-mission-left">
        <div className="ref-m-icon" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
          </svg>
        </div>
        <div>
          <h3>{t('My Mission', 'رسالتي')}</h3>
          <p>{missionText}</p>
        </div>
      </div>
      <div className="ref-exp">
        <div className="ref-exp-label">{t('Experience With', 'خبرة في')}</div>
        <div className="ref-exp-marquee" aria-hidden>
          <div className="ref-exp-track">
            {track.map((item, i) => (
              <div key={`${item.title}-${i}`} className="ref-exp-item">
                {item.icon}
                <span>
                  <b>{item.title}</b>
                  {item.subtitle ? <small>{item.subtitle}</small> : null}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
