import { ArrowRight } from "lucide-react";
import b1 from "@/assets/blog-1.jpg";
import b2 from "@/assets/blog-2.jpg";
import b3 from "@/assets/blog-3.jpg";
import b4 from "@/assets/blog-4.jpg";
import b5 from "@/assets/blog-5.jpg";
import b6 from "@/assets/blog-6.jpg";

const posts = [
  {
    img: b1,
    title: "Tackling Bureaucracy with AI Systems",
    excerpt: "Why public-sector workflows are the most underrated automation opportunity.",
    date: "12 Mar 2026",
  },
  {
    img: b2,
    title: "Leading Through Change and Uncertainty",
    excerpt: "A framework for keeping teams aligned while the tooling underneath them shifts.",
    date: "28 Feb 2026",
  },
  {
    img: b3,
    title: "Thinking Two Moves Ahead",
    excerpt: "Strategy is mostly about deciding what you will refuse to build.",
    date: "14 Feb 2026",
  },
  {
    img: b4,
    title: "The Quiet Work of an Advisor",
    excerpt: "What actually happens in the room when a company decides to modernize.",
    date: "30 Jan 2026",
  },
  {
    img: b5,
    title: "Systems That Survive Their Founders",
    excerpt: "Documentation, ownership, and the unglamorous habits that make scale possible.",
    date: "18 Jan 2026",
  },
  {
    img: b6,
    title: "The Economics of Trust in Business",
    excerpt: "Why the fastest deals are almost always the ones built on prior credibility.",
    date: "05 Jan 2026",
  },
];

export function Blog() {
  return (
    <section id="blog" className="bg-canvas pb-20">
      <div className="container-x">
        <div className="flex items-end justify-between">
          <h2 className="eyebrow text-[13px] tracking-[0.2em] text-foreground">Learn, Grow</h2>
          <a
            href="#blog"
            className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="group">
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                width={900}
                height={600}
                className="h-44 w-full rounded-sm object-cover"
              />
              <h3 className="mt-4 text-[14px] leading-snug font-semibold group-hover:text-forest">
                {p.title}
              </h3>
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
                {p.excerpt}
              </p>
              <p className="mt-3 text-[10.5px] text-muted-foreground/70">{p.date}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
