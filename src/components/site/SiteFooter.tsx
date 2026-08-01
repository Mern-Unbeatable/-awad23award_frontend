import { useLocale } from '../../context/LocaleContext';
import { ConnectButton } from '../tech';

const links = [
  { key: 'Home', en: 'Home', ar: 'الرئيسية', href: '#top' },
  { key: 'About', en: 'About', ar: 'عني', href: '#about' },
  { key: 'Services', en: 'Services', ar: 'الخدمات', href: '#services' },
  { key: 'Work', en: 'Work', ar: 'الأعمال', href: '#work' },
  { key: 'Blog', en: 'Blog', ar: 'مدونة', href: '#blog' },
];

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="bg-white overflow-hidden">
      {/* Top CTA with rich green gradient */}
      <div
        className="w-full pt-24 pb-16 text-center px-6"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, #3D6E5E 0%, rgba(111, 160, 145, 0.4) 45%, #ffffff 100%)',
        }}
      >
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-[30px] sm:text-[40px] md:text-[54px] font-serif font-semibold text-foreground tracking-tight leading-[1.15]">
            {t("Let’s Build Something Meaningful Together", 'فلنبنِ شيئاً ذي قيمة معاً')}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[#52606D]">
            {t(
              "Always open to new opportunities, collaborations, and creative challenges. Let’s work together to bring your ideas to life",
              'منفتح دائماً على أفكار وشراكات وتحديات إبداعية جديدة. معاً، نحوّل أفكارك إلى واقع'
            )}
          </p>

          <div className="mt-8 flex justify-center">
            <ConnectButton
              variant="blue"
              className="!bg-[#36BFFB] hover:!bg-[#20B0F0] !text-white !rounded-lg !px-6 !py-3 !text-[14px] !font-semibold transition-colors shadow-sm cursor-pointer"
            >
              {t('Book a consultation', 'احجز استشارة')}
            </ConnectButton>
          </div>
        </div>
      </div>

      {/* Nav Links & Copyright */}
      <div className="container mx-auto px-6 max-w-7xl border-t border-gray-100/90 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <nav className="flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="text-[13.5px] font-semibold text-slate-800 hover:text-[#36BFFB] transition-colors"
            >
              {t(l.en, l.ar)}
            </a>
          ))}
        </nav>

        <p className="text-[13px] text-gray-500 font-normal">
          © 2026 Ahmed Ibrahim. All rights reserved.
        </p>
      </div>

      {/* Giant Brand Name Watermark (Scaled to fit full name without clipping) */}
      <div className="w-full overflow-hidden leading-none text-center select-none pt-2 pb-4 px-2">
        <p className="font-serif italic font-semibold text-[9.5vw] sm:text-[10vw] md:text-[10.5vw] leading-[0.85] text-[#0A1619] tracking-tighter whitespace-nowrap inline-block">
          Ahmed Ibrahim
        </p>
      </div>
    </footer>
  );
}
