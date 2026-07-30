import { Globe } from "lucide-react";

const links = ["About", "Services", "Work", "Blog", "Contact"];

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-sky to-[#7c5cff] text-[11px] font-bold text-forest-foreground">
            AI
          </span>
          <span className="text-sm font-medium text-forest-foreground">Ahmed Ibrahim</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-[13px] text-forest-foreground/85 transition-colors hover:text-forest-foreground"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden items-center gap-1.5 rounded-md border border-forest-foreground/25 px-3 py-2 text-[12px] text-forest-foreground/90 transition-colors hover:bg-forest-foreground/10 sm:flex">
            <Globe className="h-3.5 w-3.5" />
            English
          </button>
          <a
            href="#contact"
            className="rounded-md bg-sky px-4 py-2 text-[12px] font-medium text-sky-foreground transition-opacity hover:opacity-90"
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </header>
  );
}
