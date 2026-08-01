import { Globe } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { ConnectButton } from '../tech';

interface NavProps {
  dark?: boolean;
}

export function Nav({ dark = false }: NavProps) {
  const { locale, toggleLocale, t, pathFor } = useLocale();

  const links = [
    { name: 'About', href: pathFor('/#about') },
    { name: 'Services', href: pathFor('/#services') },
    { name: 'Work', href: pathFor('/#work') },
    { name: 'Blog', href: pathFor('/#blog') },
    { name: 'Contact', href: pathFor('/#contact') },
  ];

  const textColor = dark ? 'text-slate-800 hover:text-[#36BFFB]' : 'text-white hover:text-white/80';
  const brandColor = dark ? 'text-slate-900' : 'text-white';
  const langBtnStyle = dark
    ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
    : 'border-white/40 text-white hover:bg-white/10';
  const globeColor = dark ? 'text-slate-600' : 'text-white';

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container mx-auto px-6 flex h-20 items-center justify-between gap-6">
        <a href={pathFor('/')} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#35BFFB] text-xs font-bold text-[#064738]">
            AI
          </span>
          <span className={`text-base font-semibold ${brandColor}`}>Ahmed Ibrahim</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              className={`text-base font-normal ${textColor} transition-colors`}
            >
              {t(
                l.name,
                l.name === 'About'
                  ? 'عني'
                  : l.name === 'Services'
                  ? 'الخدمات'
                  : l.name === 'Work'
                  ? 'الأعمال'
                  : l.name === 'Blog'
                  ? 'مدونة'
                  : 'تواصل'
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLocale}
            className={`hidden items-center gap-1.5 rounded-[4px] border px-3.5 py-2 text-base ${langBtnStyle} transition-colors sm:flex cursor-pointer`}
            aria-label={t('Switch language', 'تبديل اللغة')}
          >
            <Globe className={`h-4 w-4 ${globeColor}`} />
            <span>{locale === 'en' ? 'English' : 'العربية'}</span>
          </button>

          <ConnectButton
            variant="cyan"
            className="!rounded-[8px] !bg-[#35BFFB] hover:!bg-[#3F7D6E] !px-4 !py-2.5 !text-base !font-semibold !text-white transition-all duration-300 cursor-pointer shadow-sm"
          >
            {t('Book a Consultation', 'احجز استشارة')}
          </ConnectButton>
        </div>
      </div>
    </header>
  );
}
