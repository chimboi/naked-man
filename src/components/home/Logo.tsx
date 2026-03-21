'use client';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="120" cy="125" r="105" stroke="white" strokeWidth="1" opacity="0.25" />

      {/* Square */}
      <rect x="30" y="38" width="180" height="192" stroke="white" strokeWidth="1" opacity="0.15" />

      {/* Head */}
      <ellipse cx="120" cy="42" rx="16" ry="18" stroke="white" strokeWidth="2" />
      {/* Face hint - eyes */}
      <circle cx="114" cy="40" r="1.5" fill="white" opacity="0.6" />
      <circle cx="126" cy="40" r="1.5" fill="white" opacity="0.6" />

      {/* Neck */}
      <line x1="120" y1="60" x2="120" y2="68" stroke="white" strokeWidth="2" strokeLinecap="round" />

      {/* Torso */}
      <path d="M 108 68 L 105 130 L 120 135 L 135 130 L 132 68 Z" stroke="white" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      {/* Center line */}
      <line x1="120" y1="68" x2="120" y2="132" stroke="white" strokeWidth="0.8" opacity="0.3" />

      {/* Shoulders */}
      <path d="M 108 68 Q 100 66 90 72" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 132 68 Q 140 66 150 72" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Primary arms - raised up (Vitruvian pose) */}
      {/* Left arm up */}
      <path d="M 90 72 L 58 48 L 38 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Left hand */}
      <line x1="38" y1="30" x2="33" y2="28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="30" x2="35" y2="25" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="30" x2="38" y2="24" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

      {/* Right arm up */}
      <path d="M 150 72 L 182 48 L 202 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right hand */}
      <line x1="202" y1="30" x2="207" y2="28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="202" y1="30" x2="205" y2="25" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="202" y1="30" x2="202" y2="24" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

      {/* Secondary arms - horizontal (Vitruvian second pose) */}
      <path d="M 90 72 L 55 82 L 22 88" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M 150 72 L 185 82 L 218 88" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Hips */}
      <path d="M 105 130 Q 112 138 120 140 Q 128 138 135 130" stroke="white" strokeWidth="1.8" fill="none" />

      {/* Primary legs - straight */}
      {/* Left leg */}
      <path d="M 112 140 L 100 175 L 92 210" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Left foot */}
      <path d="M 92 210 L 82 212" stroke="white" strokeWidth="1.8" strokeLinecap="round" />

      {/* Right leg */}
      <path d="M 128 140 L 140 175 L 148 210" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right foot */}
      <path d="M 148 210 L 158 212" stroke="white" strokeWidth="1.8" strokeLinecap="round" />

      {/* Secondary legs - spread (Vitruvian second pose) */}
      <path d="M 112 140 L 78 178 L 55 205" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M 128 140 L 162 178 L 185 205" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Belly button hint */}
      <circle cx="120" cy="115" r="1.5" stroke="white" strokeWidth="0.8" fill="none" opacity="0.4" />

      {/* THE COVER - Question mark circle over genitals */}
      <circle cx="120" cy="148" r="18" fill="#D77C24" stroke="white" strokeWidth="2.5" />
      <text
        x="120"
        y="155"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        ?
      </text>
    </svg>
  );
}
