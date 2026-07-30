import { Globe } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { ConnectButton } from '../tech';

export function Nav() {
  const { locale, toggleLocale, t } = useLocale();

  const links = ['About', 'Services', 'Work', 'Blog', 'Contact'];

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container mx-auto px-6 flex h-20 items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#35BFFB] text-xs font-bold text-[#064738]">
            AI
          </span>
          <span className="text-base font-semibold text-white">Ahmed Ibrahim</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-base font-normal text-white hover:text-white/80 transition-colors"
            >
              {t(l, l === 'About' ? 'عني' : l === 'Services' ? 'الخدمات' : l === 'Work' ? 'الأعمال' : l === 'Blog' ? 'مدونة' : 'تواصل')}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLocale}
            className="hidden items-center gap-1.5 rounded-[4px] border border-white/40 px-3.5 py-2 text-base text-white hover:bg-white/10 transition-colors sm:flex cursor-pointer"
            aria-label={t('Switch language', 'تبديل اللغة')}
          >
            <Globe className="h-4 w-4 text-white" />
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
