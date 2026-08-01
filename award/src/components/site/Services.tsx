import { Bot, Compass, Mic } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "AI & Automation",
    body: "Identify where AI genuinely creates leverage, then implement it responsibly.",
    points: [
      "AI readiness assessment",
      "Workflow automation",
      "Tooling and vendor selection",
      "Team enablement",
    ],
  },
  {
    icon: Compass,
    title: "Technology Consulting",
    body: "A clear technology roadmap tied to commercial goals, not trends.",
    points: [
      "Systems architecture review",
      "Digital transformation planning",
      "Data and reporting strategy",
      "Cost optimization",
    ],
  },
  {
    icon: Mic,
    title: "Keynote Speaking",
    body: "Talks and workshops that make complex technology feel practical.",
    points: [
      "Conference keynotes",
      "Executive workshops",
      "Panel moderation",
      "Private team sessions",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="bg-canvas pb-20">
      <div className="container-x">
        <div className="text-center">
          <p className="eyebrow text-muted-foreground">Services</p>
          <h2 className="mt-3 text-[1.75rem] font-medium">How I Help You Move Forward</h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="rounded-xl border border-border bg-card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky/15 text-sky-foreground">
                <s.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-4 text-[14px] font-semibold">{s.title}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{s.body}</p>
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-[11.5px] text-muted-foreground"
                  >
                    <span className="h-1 w-1 rounded-full bg-sky" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
