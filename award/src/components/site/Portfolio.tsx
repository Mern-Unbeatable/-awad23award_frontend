import { ArrowUpRight } from "lucide-react";
import w1 from "@/assets/work-1.jpg";
import w2 from "@/assets/work-2.jpg";
import w3 from "@/assets/work-3.jpg";
import w4 from "@/assets/work-4.jpg";
import w5 from "@/assets/work-5.jpg";
import w6 from "@/assets/work-6.jpg";

const projects = [
  { img: w1, tag: "Startup", title: "Enterprise Dataflow Platform", sub: "Product Strategy" },
  { img: w2, tag: "Product", title: "CRM Strategy", sub: "Systems Consulting" },
  { img: w3, tag: "Advisory", title: "AI Squared", sub: "Research" },
  { img: w4, tag: "Speaking", title: "Public Speaking", sub: "Global Conferences" },
  { img: w5, tag: "Venture", title: "75,000 SAR Startup Grant", sub: "Founder Program" },
  { img: w6, tag: "Product", title: "Product Management", sub: "Roadmap Design" },
];

export function Portfolio() {
  return (
    <section id="work" className="bg-ink py-20 text-ink-foreground">
      <div className="container-x">
        <h2 className="text-center text-[3.5rem] leading-none font-medium sm:text-[5rem]">
          My Portfolio
        </h2>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl text-[12px] leading-relaxed text-ink-foreground/60">
            Over the years I&apos;ve had the privilege of partnering with founders, executives, and
            teams across industries. Each project below reflects a real problem, a deliberate
            strategy, and a measurable outcome.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 self-start rounded-full border border-ink-foreground/20 px-4 py-2 text-[11px] text-ink-foreground/80 transition-colors hover:bg-ink-foreground/10 sm:self-auto"
          >
            Let&apos;s work together
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.title}>
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={960}
                  height={640}
                  className="h-52 w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-sky px-2.5 py-1 text-[10px] font-medium text-sky-foreground">
                  {p.tag}
                </span>
              </div>
              <h3 className="mt-4 text-[14px] font-semibold">{p.title}</h3>
              <p className="mt-1 text-[11px] text-ink-foreground/50">{p.sub}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
