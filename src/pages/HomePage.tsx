import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Seo } from '../components/Seo';
import {
  ArrowIcon,
  HeroParticles,
  MissionBlock,
  StatCard,
} from '../components/tech';
import { useLocale } from '../context/LocaleContext';
import { useSite } from '../context/SiteContext';
import { useReveal } from '../hooks/useReveal';
import { pick, type GalleryItem, type Product, type Service } from '../types';

gsap.registerPlugin(ScrollTrigger);

const WORK_STYLES = [
  { tint: 'ref-proj--blue', logo: 'eksb' as const },
  { tint: 'ref-proj--green', logo: 'wa' as const },
  { tint: 'ref-proj--cyan', logo: 'bayt' as const },
];

export function HomePage() {
  const { locale, pathFor, t } = useLocale();
  const { settings, services, products, gallery, sectionByKey } = useSite();
  const hero = sectionByKey('hero');
  const heroRef = useRef<HTMLElement>(null);
  const servicesRef = useReveal<HTMLElement>([services.length]);
  const workRef = useReveal<HTMLElement>([gallery.length]);

  const product = products[0];
  const cards: Array<{ type: 'service'; item: Service } | { type: 'product'; item: Product }> = [
    ...services.slice(0, 3).map((item) => ({ type: 'service' as const, item })),
    ...(product ? [{ type: 'product' as const, item: product }] : []),
  ];

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Never hide CTAs — they must stay visible
      gsap.set(['[data-hero-eyebrow]', '[data-hero-line]', '[data-hero-sub]', '[data-hero-stats]', '[data-hero-photo]'], {
        opacity: 0,
        y: 24,
      });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to('[data-hero-photo]', { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' }, 0)
        .to('[data-hero-eyebrow]', { opacity: 1, y: 0, duration: 0.6 }, 0.15)
        .to('[data-hero-line]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.25)
        .to('[data-hero-sub]', { opacity: 1, y: 0, duration: 0.7 }, 0.45)
        .to('[data-hero-stats]', { opacity: 1, y: 0, duration: 0.8 }, 0.5);

      gsap.to('[data-hero-stats]', {
        y: '+=8',
        duration: 2.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.2,
      });
    }, root);

    return () => ctx.revert();
  }, [locale]);

  const missionText = t(
    'Empower organizations through technology, data, and automation — so they can focus on building a better future.',
    'تمكين المؤسسات من خلال التقنية والبيانات والأتمتة — لتتفرغ لبناء مستقبل أفضل.'
  );

  return (
    <>
      <Seo path={pathFor('/')} />

      <section ref={heroRef} className="ref-hero">
        <HeroParticles />

        <div className="container-site ref-wrap">
          <div className="ref-hero-stage">
            <div className="ref-hero-copy">
              <p className="ref-eyebrow" data-hero-eyebrow>
                <span className="ref-pulse" />
                {t('Technology Strategist & Entrepreneur', 'استراتيجي تقنية ورائد أعمال')}
              </p>
              <h1 className="ref-hero-title">
                <span className="ref-hero-line" data-hero-line>
                  {t('I help organizations', 'أساعد المؤسسات على')}
                </span>
                <span className="ref-hero-line" data-hero-line>
                  {t('build', 'بناء')}{' '}
                  <span className="ref-accent">{t('smarter systems', 'أنظمة أذكى')}</span>
                </span>
                <span className="ref-hero-line" data-hero-line>
                  {t('and scale what matters.', 'والتوسّع فيما يهم.')}
                </span>
              </h1>
              <p className="ref-hero-sub" data-hero-sub>
                {t(
                  'From CRM and automation to AI and digital solutions, I work with businesses and government entities in KSA to modernize operations and drive real impact.',
                  'من أنظمة CRM والأتمتة إلى الذكاء الاصطناعي والحلول الرقمية، أعمل مع الشركات والجهات الحكومية في المملكة العربية السعودية لتحديث العمليات وصناعة أثر حقيقي.'
                )}
              </p>
              <div className="ref-hero-cta" data-hero-cta>
                <Link className="tech-btn tech-btn--blue" to={pathFor('/work')}>
                  {t('Explore My Work', 'استعرض أعمالي')}
                  <ArrowIcon />
                </Link>
                <Link className="tech-btn tech-btn--ghost" to={pathFor('/about')}>
                  {t('About Me', 'من أنا')}
                </Link>
              </div>
            </div>

            {/* Figure: soft man + stats beside him (Image 2 layout) */}
            <div className="ref-hero-figure" data-hero-photo>
              <div className="ref-hero-photo">
                {(hero?.imageUrl || settings.aboutImageUrl) ? (
                  <img
                    src={hero?.imageUrl || settings.aboutImageUrl}
                    alt={settings.brandName || 'Ahmed Awad'}
                    fetchPriority="high"
                  />
                ) : (
                  <div className="ref-hero-photo-ph" aria-hidden />
                )}
                {/* Edge fades into page bg — same soft cutout as Image 2 */}
                <span className="ref-hero-fade ref-hero-fade--l" aria-hidden />
                <span className="ref-hero-fade ref-hero-fade--r" aria-hidden />
                <span className="ref-hero-fade ref-hero-fade--t" aria-hidden />
                <span className="ref-hero-fade ref-hero-fade--b" aria-hidden />
              </div>
              <StatCard />
            </div>
          </div>

          <div data-reveal>
            <MissionBlock missionText={missionText} />
          </div>
        </div>
      </section>

      <section ref={servicesRef} className="ref-section" id="services">
        <div className="container-site ref-wrap">
          <div className="ref-sec-head">
            <div>
              <p className="ref-sec-eyebrow" data-reveal>
                {t('What I Do', 'ماذا أقدم')}
              </p>
              <h2 data-reveal>{t('Solutions that drive growth', 'حلول تصنع النمو')}</h2>
            </div>
          </div>
          <div className="ref-svc-grid">
            {cards.map(({ type, item }, i) => {
              const href =
                type === 'service'
                  ? pathFor(`/services/${item.slug}`)
                  : pathFor(`/product/${item.slug}`);
              return (
                <Link
                  key={item.id}
                  to={href}
                  data-reveal
                  className="ref-svc"
                >
                  <div className="ref-svc-img">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={pick(item, locale, 'title')}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.visibility = 'hidden';
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="ref-svc-body">
                    <div className="ref-svc-icon">{String(i + 1).padStart(2, '0')}</div>
                    <h3>{pick(item, locale, 'title')}</h3>
                    <p>{pick(item, locale, 'excerpt')}</p>
                    <span className="ref-link-blue">
                      {t('Learn more', 'اعرف المزيد')}
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={workRef} className="ref-section" id="work">
        <div className="container-site ref-wrap">
          <div className="ref-sec-head">
            <div>
              <p className="ref-sec-eyebrow" data-reveal>
                {t('Selected Work', 'أعمال مختارة')}
              </p>
              <h2 data-reveal>{t('Projects that create impact', 'مشاريع تصنع الأثر')}</h2>
            </div>
            <Link to={pathFor('/work')} className="ref-link-blue" data-reveal>
              {t('View all work', 'عرض جميع الأعمال')}
              <ArrowIcon />
            </Link>
          </div>

          <div className="ref-proj-grid">
            {gallery.slice(0, 3).map((item, i) => (
              <WorkCard key={item.id} item={item} style={WORK_STYLES[i] || WORK_STYLES[0]} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function WorkCard({
  item,
  style,
}: {
  item: GalleryItem;
  style: (typeof WORK_STYLES)[number];
}) {
  const { locale, pathFor, t } = useLocale();

  return (
    <Link to={pathFor(`/work/${item.slug}`)} data-reveal className={`ref-proj ${style.tint}`}>
      <div className="ref-proj-bg">
        <img
          className="ref-proj-photo"
          src={item.media.url}
          alt={pick(item, locale, 'title')}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
        />
        <div className="ref-proj-tint" />
      </div>
      <div className="ref-proj-fade" />
      <div className="ref-proj-top">
        {style.logo === 'eksb' && <span className="ref-eksb-logo">EKSB</span>}
        {style.logo === 'wa' && (
          <span className="ref-wa-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.1 2.1 2.5 3.5 4.6 4.6l1.6-1.6c.2-.2.5-.3.8-.2 1 .3 2 .5 3 .5.5 0 .9.4.9.9V18c0 .5-.4.9-.9.9C9.4 18.9 5.1 14.6 5.1 7.4c0-.5.4-.9.9-.9h3c.5 0 .9.4.9.9 0 1.1.2 2.1.5 3 .1.3 0 .6-.2.8l-1.6 1.6z" />
            </svg>
          </span>
        )}
        {style.logo === 'bayt' && (
          <span className="ref-bayt-logo">
            <b>Bayt</b>Stay
          </span>
        )}
      </div>
      <div className="ref-proj-body">
        <h3>{pick(item, locale, 'title')}</h3>
        <p>{t('Enterprise project delivered for measurable impact.', 'مشروع مؤسسي حقق أثراً ملموساً.')}</p>
        <span className="ref-link-blue">
          {t('Case Study', 'دراسة حالة')}
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}
