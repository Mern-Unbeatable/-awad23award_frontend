const logos = [
  "Microsoft Partner",
  "Amazon",
  "PWC",
  "Nasdaq",
  "Deloitte",
  "Zoom",
  "Bitrix24",
  "Microsoft Azure",
];

export function LogoStrip() {
  return (
    <section className="border-b border-border bg-background">
      <div className="container-x flex flex-wrap items-center justify-between gap-x-10 gap-y-6 py-9">
        {logos.map((l) => (
          <span
            key={l}
            className="text-[13px] font-semibold tracking-tight text-muted-foreground/60"
          >
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}
