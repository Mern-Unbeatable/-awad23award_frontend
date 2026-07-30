import { useLocale } from '../../context/LocaleContext';

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
      {/* Top CTA with radial mint/green gradient */}
      <div className="bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-[#DDF0EC] via-[#F4F9F8] to-white pt-24 pb-16 text-center px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-[40px] md:text-[54px] font-serif font-semibold text-foreground tracking-tight leading-[1.15]">
            {t("Let’s Build Something Meaningful Together", 'فلنبنِ شيئاً ذي قيمة معاً')}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[#52606D]">
            {t(
              "Always open to new opportunities, collaborations, and creative challenges. Let’s work together to bring your ideas to life",
              'منفتح دائماً على أفكار وشراكات وتحديات إبداعية جديدة. معاً، نحوّل أفكارك إلى واقع'
            )}
          </p>

          <a
            href="#contact"
            className="mt-8 inline-block bg-[#36BFFB] hover:bg-[#20B0F0] text-white rounded-xl px-6 py-3 text-[14px] font-semibold transition-colors shadow-sm"
          >
            {t('Book a consultation', 'احجز استشارة')}
          </a>
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

      {/* Giant Brand Name Watermark */}
      <div className="w-full overflow-hidden leading-none text-center select-none pt-2">
        <p className="font-serif italic font-semibold text-[13.5vw] md:text-[14.5vw] leading-[0.85] text-[#0A1619] tracking-tight whitespace-nowrap">
          Ahmed Ibrahim
        </p>
      </div>
    </footer>
  );
}
