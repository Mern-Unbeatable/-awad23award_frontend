const LOGO_IMAGES = [
  { name: 'Partner 1', src: '/p1.png' },
  { name: 'Partner 2', src: '/p2.png' },
  { name: 'Partner 3', src: '/p3.png' },
  { name: 'Partner 4', src: '/p4.png' },
  { name: 'Partner 5', src: '/p5.png' },
  {name: 'Partner 6', src: '/p6.png'},
  { name: 'Partner 7', src: '/p7.png' },
  {name: 'Partner 8', src: '/p8.png'},
  {name: 'Partner 9', src: '/p9.png'}
];

export function TechMarquee() {
  const items = [
    ...LOGO_IMAGES,
    ...LOGO_IMAGES,
    ...LOGO_IMAGES,
    ...LOGO_IMAGES,
    ...LOGO_IMAGES,
    ...LOGO_IMAGES,
  ];

  return (
    <div className="relative w-full overflow-hidden whitespace-nowrap py-2" dir="ltr" aria-hidden>
      <div className="flex items-center animate-marquee">
        {items.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="mx-8 sm:mx-12 md:mx-16 shrink-0 flex items-center justify-center"
          >
            <img
              src={logo.src}
              alt={logo.name}
              className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
