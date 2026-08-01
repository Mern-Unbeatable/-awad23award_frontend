const steps = [
  {
    num: "01",
    title: "Discover",
    body: "We map your operations, tools, and goals to find where the real friction lives.",
  },
  {
    num: "02",
    title: "Strategize",
    body: "You get a prioritized roadmap: what to build, what to buy, and what to ignore.",
  },
  {
    num: "03",
    title: "Transform",
    body: "We implement alongside your team and measure the outcomes that matter.",
  },
];

export function Process() {
  return (
    <section className="bg-canvas pb-24">
      <div className="container-x">
        <div className="text-center">
          <p className="eyebrow text-muted-foreground">Working Together</p>
          <h2 className="mt-3 text-[1.75rem] font-medium">Here&apos;s how it works</h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <article
              key={s.num}
              className={`rounded-2xl border border-border bg-card p-7 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)] ${
                i === 1 ? "md:-mt-8" : ""
              }`}
            >
              <span className="font-display text-[1.4rem] text-muted-foreground/70">{s.num}</span>
              <h3 className="mt-16 text-[16px] font-semibold">{s.title}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
