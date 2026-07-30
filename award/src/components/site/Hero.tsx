import { Nav } from "./Nav";
import portrait from "@/assets/hero-portrait.png";
import a1 from "@/assets/avatar-1.jpg";
import a2 from "@/assets/avatar-2.jpg";
import a3 from "@/assets/avatar-3.jpg";
import a4 from "@/assets/avatar-4.jpg";

const avatars = [a1, a2, a3, a4];

const stats = [
  { value: "8+", label: "Years Experience" },
  { value: "10,000+", label: "Hours Solving Business Problems" },
  { value: "2+", label: "Technology Ventures Founded" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-forest text-forest-foreground">
      <Nav />

      <div className="container-x relative grid gap-10 pt-32 pb-12 lg:grid-cols-12 lg:gap-6 lg:pt-36 lg:pb-0">
        {/* Left column */}
        <div className="relative z-20 lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-foreground/10 whitespace-nowrap px-3.5 py-1.5 text-[10px] tracking-[0.16em] uppercase font-medium text-forest-foreground/85">
            <span className="h-1.5 w-1.5 rounded-full bg-sky" />
            Technology Consultant • AI Strategist • Keynote Speaker
          </span>

          <h1 className="mt-6 max-w-[560px] text-[2.5rem] leading-[1.1] font-medium sm:text-[3.2rem]">
            Helping Businesses Build Smarter Systems That Actually Scale.
          </h1>

          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-forest-foreground/80">
            I work with founders, executives, and growing businesses to simplify operations,
            embrace AI, and create technology strategies that deliver measurable results.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-md bg-forest-soft/70 px-6 py-3 text-[13px] font-medium text-forest-foreground ring-1 ring-forest-foreground/15 transition-colors hover:bg-forest-soft"
            >
              Book a consultation
            </a>
            <a
              href="#services"
              className="rounded-md bg-sky px-6 py-3 text-[13px] font-medium text-sky-foreground transition-opacity hover:opacity-90"
            >
              Explore my services
            </a>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-4 pb-14">
            {stats.map((s) => (
              <div key={s.value}>
                <dt className="font-display text-[2rem] leading-none font-medium">{s.value}</dt>
                <dd className="mt-3 text-[12px] text-forest-foreground/70">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait */}
        <div className="pointer-events-none relative z-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex lg:justify-center">
          <img
            src={portrait}
            alt="Ahmed Ibrahim, technology consultant and keynote speaker"
            width={1024}
            height={1280}
            className="mx-auto w-[340px] max-w-full object-contain object-bottom sm:w-[430px] lg:w-[480px]"
          />
        </div>

        {/* Right column */}
        <div className="relative z-20 lg:col-span-3 lg:col-start-10 lg:pt-2">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  loading="lazy"
                  width={512}
                  height={512}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-forest"
                />
              ))}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-soft text-lg ring-2 ring-forest">
                +
              </span>
            </div>
          </div>
          <p className="mt-4 max-w-[230px] text-[13.5px] leading-relaxed text-forest-foreground/85">
            18k+ satisfied customer all over World
          </p>

          <div className="relative mt-24 max-w-[250px]">
            <span className="font-display absolute -top-10 -left-1 text-6xl leading-none text-forest-foreground/25">
              &ldquo;
            </span>
            <p className="text-[13.5px] leading-relaxed text-forest-foreground/85">
              I&apos;m a technology consultant, keynote speaker, and trusted advisor helping
              businesses embrace AI, modernize operations, and build future-ready systems through
              practical strategies and real-world experience.
            </p>
            <span className="font-display absolute -right-2 -bottom-9 text-6xl leading-none text-forest-foreground/25">
              &rdquo;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
