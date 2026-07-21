import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Seo } from '../components/Seo';
import { JournalCard } from '../components/JournalCard';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { useReveal } from '../hooks/useReveal';
import { pick } from '../types';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const { locale, pathFor, t } = useLocale();
  const { settings, services, posts, testimonials, sectionByKey } = useSite();
  const hero = sectionByKey('hero');
  const mission = sectionByKey('mission');
  const about = sectionByKey('about');
  const servicesIntro = sectionByKey('services_intro');
  const showreel = sectionByKey('showreel');
  const heroRef = useRef<HTMLElement>(null);
  const missionRef = useReveal<HTMLElement>([mission?.id]);
  const aboutRef = useReveal<HTMLElement>([about?.id]);
  const servicesRef = useReveal<HTMLElement>([services.length]);
  const showreelRef = useReveal<HTMLElement>([showreel?.id]);
  const testimonialsRef = useReveal<HTMLElement>([testimonials.length]);
  const journalRef = useReveal<HTMLElement>([posts.length]);
  const ctaRef = useReveal<HTMLElement>([]);

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const title = root.querySelector('[data-hero-title]');
      const media = root.querySelector('[data-hero-media]');

      gsap.set(
        ['[data-hero-eyebrow]', '[data-hero-title]', '[data-hero-sub]', '[data-hero-cta]', '[data-hero-brand]'],
        { opacity: 0, y: 24 }
      );
      gsap.set(media, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.to(media, { opacity: 1, duration: 0.9 }, 0)
        .to('[data-hero-eyebrow]', { opacity: 1, y: 0, duration: 0.45 }, 0.15)
        .to(title, { opacity: 1, y: 0, duration: 0.7 }, 0.25)
        .to('[data-hero-sub]', { opacity: 1, y: 0, duration: 0.5 }, 0.4)
        .to('[data-hero-cta]', { opacity: 1, y: 0, duration: 0.45 }, 0.5)
        .to('[data-hero-brand]', { opacity: 1, y: 0, duration: 0.45 }, 0.6);

      // No scrub/parallax — that was making scroll feel stuck
    }, root);

    return () => ctx.revert();
  }, [locale, hero?.titleEn]);

  return (
    <>
      <Seo path={pathFor('/')} />

      {/* HERO — one composition */}
      <section ref={heroRef} className="relative min-h-[100svh] h-auto overflow-hidden bg-ink">
        <div data-hero-media className="hero-media">
          <div className="hero-media-inner">
            <img
              src={hero?.imageUrl || settings.aboutImageUrl || ''}
              alt={settings.brandName}
              className="hero-portrait h-full w-full"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero-media-shadow-left" aria-hidden />
          <div className="hero-media-shadow-right" aria-hidden />
        </div>
        <div className="hero-veil-side" aria-hidden />
        <div className="hero-veil-bottom" aria-hidden />

        <div data-hero-content className="relative container-wide min-h-[100svh] flex flex-col justify-end pb-16 pt-32 md:pb-24">
          <div className="hero-copy">
          <p data-hero-eyebrow className="eyebrow mb-5">
            {hero ? pick(hero, locale, 'subtitle') : t('MY METHOD', 'منهجي')}
          </p>
          <h1 data-hero-title className="hero-title">
            {hero ? pick(hero, locale, 'title') : settings.brandName}
          </h1>
          <p data-hero-sub className="hero-sub">
            {hero ? pick(hero, locale, 'body') : locale === 'ar' ? settings.taglineAr : settings.taglineEn}
          </p>
          <div data-hero-cta className="mt-8 flex flex-wrap gap-3">
            <Link to={pathFor('/book')} className="btn btn-accent">
              {hero ? pick(hero, locale, 'ctaLabel') : t('Book a Consultation', 'احجز استشارة')}
            </Link>
            <Link to={pathFor('/journal')} className="btn btn-light">
              {t('Read the Journal', 'اقرأ المجلة')}
            </Link>
          </div>
          <p data-hero-brand className="mt-10 font-display text-2xl md:text-3xl font-bold tracking-wide text-cream/90">
            {settings.brandName}
          </p>
          </div>
        </div>
      </section>

      {mission && (
        <section ref={missionRef} className="border-y border-cream/10 bg-ink-soft">
          <div className="container-site py-16 md:py-24 text-center">
            <p data-reveal className="eyebrow mb-4">{pick(mission, locale, 'subtitle')}</p>
            <h2 data-reveal className="font-display font-bold text-[clamp(1.6rem,4vw,3rem)] leading-tight max-w-4xl mx-auto">
              {pick(mission, locale, 'title')}
            </h2>
          </div>
        </section>
      )}

      {about && (
        <section ref={aboutRef} className="container-site py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div data-reveal-scale className="relative overflow-hidden aspect-[4/5]">
            <img
              src={about.imageUrl || settings.aboutImageUrl || ''}
              alt={pick(about, locale, 'title')}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-cream/10" />
          </div>
          <div data-reveal-right>
            <p className="eyebrow mb-4">{pick(about, locale, 'subtitle')}</p>
            <h2 className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] mb-6">
              {pick(about, locale, 'title')}
            </h2>
            <p className="text-cream/70 text-lg leading-relaxed mb-8">{pick(about, locale, 'body')}</p>
            <div className="flex flex-wrap gap-3">
              <Link to={pathFor(about.ctaLink || '/contact')} className="btn btn-accent">
                {pick(about, locale, 'ctaLabel') || t('Get in Touch', 'تواصل معي')}
              </Link>
              <Link to={pathFor('/book')} className="btn btn-light">
                {t('Book a Call', 'احجز مكالمة')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section ref={servicesRef} className="bg-cream text-ink py-20 md:py-28">
        <div className="container-site">
          <div data-reveal className="max-w-3xl mb-14">
            <p className="eyebrow !text-ink/50 mb-4">
              {servicesIntro ? pick(servicesIntro, locale, 'subtitle') : t('WORK WITH ME', 'اعمل معي')}
            </p>
            <h2 className="font-display font-bold text-[clamp(1.7rem,4vw,2.8rem)] leading-tight">
              {servicesIntro
                ? pick(servicesIntro, locale, 'title')
                : t('Ready to amplify your personal brand?', 'هل أنت مستعد لتعزيز علامتك الشخصية؟')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-ink/10">
            {services.map((service) => (
              <Link
                key={service.id}
                to={pathFor(`/services/${service.slug}`)}
                data-reveal
                className="service-card bg-cream group relative overflow-hidden block cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={service.imageUrl || ''}
                    alt={pick(service, locale, 'title')}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-7 md:p-8">
                  <p className="text-[0.7rem] tracking-[0.2em] uppercase font-display font-semibold text-ink/45 mb-3">
                    {pick(service, locale, 'subtitle')}
                  </p>
                  <h3 className="font-display font-bold text-2xl mb-3">{pick(service, locale, 'title')}</h3>
                  <p className="text-ink/65 leading-relaxed mb-6 text-[0.95rem]">
                    {pick(service, locale, 'excerpt')}
                  </p>
                  <span className="font-display text-xs tracking-[0.18em] uppercase font-bold border-b border-ink/30 pb-1 group-hover:border-ink transition-colors">
                    {t('Find out more', 'اعرف المزيد')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showreel && (
        <section ref={showreelRef} className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={showreel.imageUrl || settings.showreelPoster || ''}
              alt=""
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-ink/80" />
          </div>
          <div className="relative container-site grid lg:grid-cols-2 gap-12 items-center">
            <div data-reveal-left>
              <p className="eyebrow mb-4">{pick(showreel, locale, 'subtitle')}</p>
              <h2 className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] leading-tight mb-5">
                {pick(showreel, locale, 'title')}
              </h2>
              <p className="text-cream/70 text-lg leading-relaxed mb-8 max-w-xl">
                {pick(showreel, locale, 'body')}
              </p>
              <Link to={pathFor(showreel.ctaLink || '/book')} className="btn btn-accent">
                {pick(showreel, locale, 'ctaLabel')}
              </Link>
            </div>
            <div data-reveal-scale className="aspect-video bg-ink-muted border border-cream/10 overflow-hidden">
              {settings.showreelUrl ? (
                <iframe
                  title="Showreel"
                  src={settings.showreelUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={settings.showreelPoster || showreel.imageUrl || ''}
                  alt="Showreel"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section ref={testimonialsRef} className="container-site py-20 md:py-28">
          <p data-reveal className="eyebrow mb-4">{t('Success stories', 'قصص نجاح')}</p>
          <h2 data-reveal className="font-display font-bold text-3xl md:text-4xl mb-12 max-w-2xl">
            {t('What clients say after the work begins.', 'ماذا يقول العملاء بعد بدء العمل.')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((item) => (
              <blockquote key={item.id} data-reveal className="border-t border-cream/15 pt-8">
                <p className="font-serif text-xl md:text-2xl leading-snug text-cream/90 mb-8">
                  “{pick(item, locale, 'quote')}”
                </p>
                <div className="flex items-center gap-4">
                  {item.avatarUrl && (
                    <img
                      src={item.avatarUrl}
                      alt={pick(item, locale, 'name')}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-display font-semibold">{pick(item, locale, 'name')}</p>
                    <p className="text-cream/50 text-sm">{pick(item, locale, 'role')}</p>
                  </div>
                </div>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Journal preview */}
      <section ref={journalRef} className="border-t border-cream/10 py-20 md:py-28 journal-home">
        <div className="container-site">
          <div data-reveal className="flex items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow mb-3">{t('Insights', 'رؤى')}</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl">
                {t('From the journal', 'من المجلة')}
              </h2>
            </div>
            <Link to={pathFor('/journal')} className="hidden sm:inline-flex btn btn-light">
              {t('View all', 'عرض الكل')}
            </Link>
          </div>
          <div className="journal-grid">
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} data-reveal>
                <JournalCard post={post} compact />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="bg-accent text-ink py-16 md:py-20">
        <div className="container-site flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <h2 data-reveal className="font-display font-bold text-2xl md:text-4xl max-w-xl leading-tight">
            {t(
              'Ready to stop playing small and build a brand that speaks first?',
              'هل أنت مستعد للتوقف عن التقليل من شأنك وبناء علامة تتحدث أولاً؟'
            )}
          </h2>
          <div data-reveal className="flex flex-wrap gap-3">
            <Link to={pathFor('/book')} className="btn btn-dark">
              {t('Book a Call', 'احجز مكالمة')}
            </Link>
            <Link to={pathFor('/contact')} className="btn btn-light">
              {t('Contact', 'تواصل')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
