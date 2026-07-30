import about from "@/assets/about-conference.jpg";

const topics = [
  { title: "AI & Automation", body: "Practical AI adoption, workflow automation, and tooling." },
  { title: "Business Strategy", body: "Aligning technology decisions with commercial outcomes." },
  {
    title: "Digital Transformation",
    body: "Modernizing legacy operations without breaking the business.",
  },
  { title: "Keynote Speaking", body: "Talks on AI, leadership, and future-ready systems." },
];

export function About() {
  return (
    <section id="about" className="bg-canvas py-20">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow text-muted-foreground">Company</p>
          <h2 className="mt-4 max-w-sm text-[1.9rem] leading-tight font-medium">
            A Deep Dive into My Life&apos;s Experiences and Lessons Learned
          </h2>

          <div className="mt-8 space-y-3">
            {topics.map((t) => (
              <div key={t.title} className="rounded-lg border border-border bg-card px-5 py-4">
                <h3 className="text-[13.5px] font-semibold">{t.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <img
            src={about}
            alt="Ahmed Ibrahim at a technology conference"
            loading="lazy"
            width={1200}
            height={800}
            className="w-full rounded-xl object-cover"
          />
          <div className="mt-6 space-y-4 text-[12.5px] leading-relaxed text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Hello, I&apos;m Ahmed Ibrahim</span> —
              a technology consultant, keynote speaker, and advisor to founders and executives
              building the next decade of their business.
            </p>
            <p>
              For the last 8+ years I have worked with organizations across industries to help them
              simplify operations, adopt artificial intelligence, and turn scattered tools into
              systems that actually scale. My work sits at the intersection of strategy and
              execution: I don&apos;t just recommend a direction, I help teams ship it.
            </p>
            <p>
              I&apos;ve founded two technology ventures, led transformation programs inside
              fast-growing companies, and spent more than 10,000 hours in the room with teams
              solving hard business problems. That experience shaped a simple belief — technology
              only matters when it produces measurable outcomes.
            </p>
            <p>
              Along the way I&apos;ve spoken on stages about AI adoption, delivered workshops for
              leadership teams, and mentored operators who are learning to make confident
              technology decisions under real-world constraints.
            </p>
            <p>
              If you&apos;re weighing an AI initiative, rethinking your operating model, or simply
              trying to understand what to build next, I&apos;d welcome the conversation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
