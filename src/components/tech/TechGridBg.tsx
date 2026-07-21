export function TechGridBg({ full = false }: { full?: boolean }) {
  return (
    <div className={`tech-grid-bg${full ? ' tech-grid-bg--full' : ''}`} aria-hidden>
      <div className="tech-grid-bg__grid" />
      <div className="tech-grid-bg__orb tech-grid-bg__orb--1" />
      <div className="tech-grid-bg__orb tech-grid-bg__orb--2" />
      {full ? <div className="tech-grid-bg__orb tech-grid-bg__orb--3" /> : null}
    </div>
  );
}
