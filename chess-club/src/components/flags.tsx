interface FlagProps {
  className?: string;
}

export function GbFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <path d="M0,0 v30 h60 v-30 z" fill="#00247d" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L27,13.5 h6 L0,0 M60,0 L33,13.5 h-6 L60,0 M0,30 L27,16.5 h6 L0,30 M60,30 L33,16.5 h-6 L60,30"
        fill="#cf142b"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  );
}

export function VnFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#da251d" />
      <polygon
        points="15,3 16.57,7.84 21.66,7.84 17.54,10.83 19.12,15.66 15,12.67 10.88,15.66 12.46,10.83 8.34,7.84 13.43,7.84"
        fill="#ff0"
      />
    </svg>
  );
}

export function FrFlag({ className }: FlagProps) {
  return (
    // Square viewBox: vertical stripes must not be side-cropped by `slice`,
    // which would otherwise render the white band twice as wide as the others.
    <svg viewBox="0 0 30 30" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <rect width="10" height="30" fill="#002395" />
      <rect x="10" width="10" height="30" fill="#fff" />
      <rect x="20" width="10" height="30" fill="#ed2939" />
    </svg>
  );
}

export function DeFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <rect width="30" height="6.667" fill="#000" />
      <rect y="6.667" width="30" height="6.667" fill="#dd0000" />
      <rect y="13.333" width="30" height="6.667" fill="#ffce00" />
    </svg>
  );
}

export function EsFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#aa151b" />
      <rect y="5" width="30" height="10" fill="#f1bf00" />
    </svg>
  );
}
