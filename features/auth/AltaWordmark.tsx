interface AltaWordmarkProps {
  className?: string;
}

/** The ALTA wordmark with the sunrise arc, drawn in code so it stays crisp and recolourable. */
export const AltaWordmark = ({ className = '' }: AltaWordmarkProps) => (
  <div
    role="img"
    aria-label="Alta Health & Wellness"
    className={`flex w-fit flex-col items-center gap-px ${className}`.trim()}
  >
    <svg width="50" height="12" viewBox="0 0 50 12" aria-hidden="true">
      <path
        d="M3 10 Q25 -4 47 10"
        fill="none"
        stroke="var(--color-alta-sunshine)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
    <span
      aria-hidden="true"
      className="pl-[0.42em] font-serif text-[22px] font-medium tracking-[0.42em] text-alta-plum"
    >
      ALTA
    </span>
  </div>
);
