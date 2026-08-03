
interface BrandLogoProps {
  className?: string;
  name?: string;
  markOnly?: boolean;
}

/** Dual-tone “A” mark matching the Ahmed Ibrahim reference brand. */
export function BrandLogo({ className = '', name = 'Ahmed Ibrahim', markOnly = false }: BrandLogoProps) {
  return (
    <span className={`ref-brand flex items-center gap-2.5 ${className}`.trim()}>
      <span
        className="ref-brand-mark flex items-center justify-center w-8 h-8 rounded-full bg-[#35BFFB] text-[#064738] font-extrabold text-xs shadow-md shadow-[#35BFFB]/25 tracking-tight"
        aria-hidden
      >
        AI
      </span>
      {!markOnly && (
        <span className="ref-brand-name font-bold tracking-tight text-white text-base md:text-lg">
          {name}
        </span>
      )}
    </span>
  );
}
