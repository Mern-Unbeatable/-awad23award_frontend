import { Star } from "lucide-react";
import a1 from "@/assets/avatar-1.jpg";
import a2 from "@/assets/avatar-2.jpg";
import a3 from "@/assets/avatar-3.jpg";
import a4 from "@/assets/avatar-4.jpg";

const items = [
  {
    quote:
      "Ahmed helped us untangle years of manual process into a system our team actually enjoys using. The impact showed up in the first quarter.",
    name: "Sarah Whitmore",
    role: "COO, Northline Group",
    img: a1,
  },
  {
    quote:
      "He translates AI from buzzword into a concrete roadmap. We knew exactly what to build, what to postpone, and why.",
    name: "Daniel Osei",
    role: "Founder, Kova Labs",
    img: a2,
  },
  {
    quote:
      "One of the sharpest strategic minds we've worked with. Practical, direct, and genuinely invested in the outcome.",
    name: "Mei Tanaka",
    role: "VP Product, Arcline",
    img: a3,
  },
  {
    quote:
      "His keynote reframed how our leadership team thinks about automation. Still referenced in meetings a year later.",
    name: "Robert Klein",
    role: "CEO, Meridian Partners",
    img: a4,
  },
];

export function Testimonials() {
  return (
    <section className="bg-canvas py-20">
      <div className="container-x">
        <h2 className="text-[1.75rem] font-medium">Testimonials</h2>
        <p className="mt-2 max-w-sm text-[12px] leading-relaxed text-muted-foreground">
          Explore customer feedback on my service and its impact on my experiences.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#f5b544] text-[#f5b544]" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[12px] leading-relaxed text-muted-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span>
                  <span className="block text-[12px] font-semibold">{t.name}</span>
                  <span className="block text-[10.5px] text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
