/**
 * Azulejo — custom Portuguese-Nigerian fusion tile pattern.
 * Rendered in Affy's brand palette (gold + forest + ivory).
 *
 * Three exports:
 *  - <AzulejoTile/>   single decorative tile (used standalone or as defs)
 *  - <AzulejoStrip/>  horizontal repeating divider band
 *  - <AzulejoBlock/>  square decorative block (for hero/section accents)
 */

interface AzulejoProps {
  className?: string;
  size?: number;
  tone?: "ivory" | "forest" | "transparent";
}

/** A single seamlessly-tileable 80x80 motif. */
export function AzulejoTile({
  className = "",
  size = 80,
  tone = "ivory",
}: AzulejoProps) {
  const bg =
    tone === "forest"
      ? "var(--forest)"
      : tone === "transparent"
      ? "transparent"
      : "var(--ivory-warm)";

  const stroke =
    tone === "forest" ? "var(--gold)" : "var(--forest)";
  const dot = tone === "forest" ? "var(--ivory)" : "var(--gold)";
  const accent = tone === "forest" ? "var(--gold-soft)" : "var(--oxblood)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="80" height="80" fill={bg} />
      {/* Outer frame */}
      <rect
        x="2"
        y="2"
        width="76"
        height="76"
        fill="none"
        stroke={stroke}
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      {/* Diagonal frame inside */}
      <path
        d="M40 6 L74 40 L40 74 L6 40 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeOpacity="0.55"
      />
      {/* Quarter petals — fourfold symmetry */}
      <g stroke={stroke} strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M40 22 C 33 30, 33 36, 40 40 C 47 36, 47 30, 40 22 Z" />
        <path d="M40 58 C 33 50, 33 44, 40 40 C 47 44, 47 50, 40 58 Z" />
        <path d="M22 40 C 30 33, 36 33, 40 40 C 36 47, 30 47, 22 40 Z" />
        <path d="M58 40 C 50 33, 44 33, 40 40 C 44 47, 50 47, 58 40 Z" />
      </g>
      {/* Central rosette */}
      <circle cx="40" cy="40" r="4" fill={dot} />
      <circle cx="40" cy="40" r="7" fill="none" stroke={accent} strokeWidth="0.8" />
      {/* Corner suns */}
      <g fill={dot}>
        <circle cx="6" cy="6" r="1.6" />
        <circle cx="74" cy="6" r="1.6" />
        <circle cx="6" cy="74" r="1.6" />
        <circle cx="74" cy="74" r="1.6" />
      </g>
      {/* Mid-edge accents */}
      <g stroke={accent} strokeWidth="0.9" fill="none">
        <path d="M40 2 L40 8" />
        <path d="M40 72 L40 78" />
        <path d="M2 40 L8 40" />
        <path d="M72 40 L78 40" />
      </g>
    </svg>
  );
}

/** Horizontal band that tiles the motif seamlessly. */
export function AzulejoStrip({
  className = "",
  height = 60,
  tone = "ivory",
}: AzulejoProps & { height?: number }) {
  const fill =
    tone === "forest" ? "%2312372A" : tone === "transparent" ? "none" : "%23FBF8F1";
  const stroke = tone === "forest" ? "%23D4AF37" : "%2312372A";
  const dot = tone === "forest" ? "%23F7F3EA" : "%23D4AF37";
  const accent = tone === "forest" ? "%23E8CC6E" : "%236A1F1B";

  // Inline SVG tile encoded as data URL — same motif as AzulejoTile.
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' width='80' height='80'>` +
    `<rect width='80' height='80' fill='${fill}'/>` +
    `<rect x='2' y='2' width='76' height='76' fill='none' stroke='${stroke}' stroke-opacity='0.18' stroke-width='1'/>` +
    `<path d='M40 6 L74 40 L40 74 L6 40 Z' fill='none' stroke='${stroke}' stroke-width='1' stroke-opacity='0.55'/>` +
    `<g stroke='${stroke}' stroke-width='1.2' fill='none' stroke-linecap='round'>` +
    `<path d='M40 22 C 33 30, 33 36, 40 40 C 47 36, 47 30, 40 22 Z'/>` +
    `<path d='M40 58 C 33 50, 33 44, 40 40 C 47 44, 47 50, 40 58 Z'/>` +
    `<path d='M22 40 C 30 33, 36 33, 40 40 C 36 47, 30 47, 22 40 Z'/>` +
    `<path d='M58 40 C 50 33, 44 33, 40 40 C 44 47, 50 47, 58 40 Z'/>` +
    `</g>` +
    `<circle cx='40' cy='40' r='4' fill='${dot}'/>` +
    `<circle cx='40' cy='40' r='7' fill='none' stroke='${accent}' stroke-width='0.8'/>` +
    `<g fill='${dot}'>` +
    `<circle cx='6' cy='6' r='1.6'/><circle cx='74' cy='6' r='1.6'/>` +
    `<circle cx='6' cy='74' r='1.6'/><circle cx='74' cy='74' r='1.6'/>` +
    `</g>` +
    `<g stroke='${accent}' stroke-width='0.9' fill='none'>` +
    `<path d='M40 2 L40 8'/><path d='M40 72 L40 78'/>` +
    `<path d='M2 40 L8 40'/><path d='M72 40 L78 40'/>` +
    `</g>` +
    `</svg>`;

  const dataUrl = `url("data:image/svg+xml;utf8,${svg.replace(/#/g, "%23")}")`;

  return (
    <div
      className={className}
      role="presentation"
      style={{
        height,
        backgroundImage: dataUrl,
        backgroundRepeat: "repeat",
        backgroundSize: `${height}px ${height}px`,
        opacity: tone === "forest" ? 0.85 : 0.75,
      }}
    />
  );
}

/** Square block used for decorative corners and hero accents. */
export function AzulejoBlock({
  className = "",
  size = 240,
  tone = "ivory",
  cols = 3,
  rows = 3,
}: AzulejoProps & { cols?: number; rows?: number }) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: size,
        height: size,
      }}
      aria-hidden
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <AzulejoTile key={i} size={size / cols} tone={tone} />
      ))}
    </div>
  );
}
