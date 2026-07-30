const links = ["Home", "About", "Services", "Work", "Blog"];

export function SiteFooter() {
  return (
    <footer className="bg-canvas">
      <div className="bg-gradient-to-b from-canvas via-[oklch(0.93_0.03_163)] to-[oklch(0.88_0.05_163)] py-16 text-center">
        <div className="container-x">
          <h2 className="text-[1.7rem] font-medium">
            Let&apos;s Build Something Meaningful Together
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[12px] leading-relaxed text-muted-foreground">
            Always open to new approaches, collaborations, and questions that make you think.
            Together, let&apos;s bring your ideas to life.
          </p>
          <a
            href="#contact"
            className="mt-6 inline-block rounded-md bg-sky px-5 py-2.5 text-[12px] font-medium text-sky-foreground transition-opacity hover:opacity-90"
          >
            Book a consultation
          </a>
        </div>
      </div>

      <div className="bg-[oklch(0.88_0.05_163)]">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 border-t border-foreground/10 py-6">
          <nav className="flex gap-5">
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-[11px] text-foreground/70 transition-colors hover:text-foreground"
              >
                {l}
              </a>
            ))}
          </nav>
          <p className="text-[11px] text-foreground/60">
            © 2026 Ahmed Ibrahim. All rights reserved.
          </p>
        </div>

        <div className="overflow-hidden">
          <p className="font-display translate-y-[0.1em] whitespace-nowrap px-4 text-center text-[11.5vw] leading-[0.9] font-medium italic">
            Ahmed Ibrahim
          </p>
        </div>
      </div>
    </footer>
  );
}
