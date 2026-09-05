type WaveDividerProps = {
  variant?: "curve" | "waves";
  color: string;
  flip?: boolean;
  className?: string;
};

/**
 * A run of even, rounded waves across the full width — the same repeating
 * rhythm a zigzag gives, but every peak and trough is a quadratic curve, so
 * there are no sharp corners anywhere along the seam.
 *
 * Each segment is a half-period bump and they alternate direction, which keeps
 * the curve continuous where one segment hands over to the next.
 */
const WAVES_PATH = (() => {
  const width = 1440;
  const segments = 22;
  const step = width / segments;
  const amplitude = 32;
  const midline = 50;

  let d = `M 0,${midline}`;
  for (let i = 0; i < segments; i++) {
    const lift = i % 2 === 0 ? -amplitude : amplitude;
    d += ` q ${step / 2},${lift} ${step},0`;
  }
  return `${d} L ${width},100 L 0,100 Z`;
})();

/**
 * Full-width SVG seam used to transition between two flat-color sections
 * instead of a hard edge. `color` should match the section the divider
 * visually belongs to (the one it overlaps into).
 */
export default function WaveDivider({
  variant = "curve",
  color,
  flip = false,
  className = "",
}: WaveDividerProps) {
  return (
    <div
      aria-hidden
      className={`absolute left-0 w-full h-10 sm:h-14 lg:h-20 pointer-events-none z-[5] ${
        flip ? "top-0 -translate-y-[calc(100%-1px)]" : "bottom-0 translate-y-px"
      } ${className}`}
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d={
            variant === "curve"
              ? "M0,55 C420,-15 1020,125 1440,45 L1440,100 L0,100 Z"
              : WAVES_PATH
          }
          fill={color}
        />
      </svg>
    </div>
  );
}
