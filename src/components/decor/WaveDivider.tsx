type WaveDividerProps = {
  variant?: "curve" | "zigzag";
  color: string;
  flip?: boolean;
  className?: string;
};

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
        {variant === "curve" ? (
          <path
            d="M0,55 C420,-15 1020,125 1440,45 L1440,100 L0,100 Z"
            fill={color}
          />
        ) : (
          <path
            d="M0,100 L0,55 L80,25 L160,65 L240,25 L320,65 L400,25 L480,65 L560,25 L640,65 L720,25 L800,65 L880,25 L960,65 L1040,25 L1120,65 L1200,25 L1280,65 L1360,25 L1440,55 L1440,100 Z"
            fill={color}
          />
        )}
      </svg>
    </div>
  );
}
