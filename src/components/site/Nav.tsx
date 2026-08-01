import { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { ConnectButton } from '../tech';

interface NavProps {
  dark?: boolean;
}

export function Nav({ dark = false }: NavProps) {
  const { locale, toggleLocale, t, pathFor } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

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
            className={`hidden items-center gap-1.5 rounded-lg border px-3.5 py-2 text-base ${langBtnStyle} transition-colors sm:flex cursor-pointer`}
            aria-label={t('Switch language', 'تبديل اللغة')}
          >
            <Globe className={`h-4 w-4 ${globeColor}`} />
            <span>{locale === 'en' ? 'English' : 'العربية'}</span>
          </button>

          <ConnectButton
            variant="cyan"
            className="hidden sm:inline-flex rounded-lg! bg-[#35BFFB]! hover:bg-[#3F7D6E]! px-4! py-2.5! text-base! font-semibold! text-white! transition-all duration-300 cursor-pointer shadow-sm"
          >
            {t('Book a Consultation', 'احجز استشارة')}
          </ConnectButton>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg ${dark ? 'text-slate-800' : 'text-white'} hover:bg-white/10 transition-colors`}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#064738] text-white flex flex-col justify-between p-6 sm:px-10 overflow-y-auto animate-in fade-in duration-200 md:hidden">
          {/* Top Bar inside Mobile Drawer */}
          <div className="flex items-center justify-between h-14 border-b border-white/15 pb-4">
            <a href={pathFor('/')} onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#35BFFB] text-xs font-bold text-[#064738]">
                AI
              </span>
              <span className="text-base font-semibold text-white">Ahmed Ibrahim</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-3 my-auto py-6">
            {links.map((l) => (
              <a
                key={l.name}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-semibold text-white hover:text-[#35BFFB] py-2.5 transition-colors border-b border-white/10"
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

          {/* Bottom Language & Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-white/15">
            <button
              type="button"
              onClick={() => {
                toggleLocale();
                setMobileOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-white/30 text-white font-medium text-base hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Globe className="w-5 h-5 text-[#35BFFB]" />
              <span>{locale === 'en' ? 'Switch to العربية' : 'Switch to English'}</span>
            </button>

            <ConnectButton
              variant="cyan"
              className="w-full justify-center rounded-lg! bg-[#35BFFB]! py-3.5! text-base! font-semibold! text-[#064738]!"
            >
              {t('Book a Consultation', 'احجز استشارة')}
            </ConnectButton>
          </div>
        </div>
      )}
    </header>
  );
}
