interface ExperienceStripProps {
  mission: string;
  logos: string[];
}

export function ExperienceStrip({ mission, logos }: ExperienceStripProps) {
  return (
    <div className="experience-strip">
      <p className="experience-strip__mission">{mission}</p>
      <div className="experience-strip__logos">
        {logos.map((logo) => (
          <span key={logo} className="experience-strip__pill">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
