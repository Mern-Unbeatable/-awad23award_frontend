const logos = [
  { name: 'Partner 1', src: '/p1.png' },
  { name: 'Partner 2', src: '/p2.png' },
  { name: 'Partner 3', src: '/p3.png' },
  { name: 'Partner 4', src: '/p4.png' },
  { name: 'Partner 5', src: '/p5.png' },
  {name: 'Partner 6', src: '/p6.png'}
];

export function LogoStrip() {
  return (
    <section className="border-b border-border bg-white py-8">
      <div className="container mx-auto px-6 flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
        {logos.map((logo, index) => (
          <img
            key={`${logo.name}-${index}`}
            src={logo.src}
            alt={logo.name}
            className="h-9 w-auto object-contain"
          />
        ))}
      </div>
    </section>
  );
}
