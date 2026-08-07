interface WheelDiagramProps {
  className?: string;
}

// The actual math (x = r(θ-sinθ), y = r(1-cosθ), r = 45), scaled up from the
// same formula physics.ts uses — this is the real curve, not a decorative
// stand-in for it. Spans one full arch: width 2πr ≈ 283, height 2r = 90.
const CYCLOID_ARCH =
  "0,0 1.08,-6.03 8.15,-22.5 25.7,-45 55.26,-67.5 95.31,-83.97 141.37,-90 187.43,-83.97 227.48,-67.5 257.04,-45 274.59,-22.5 281.7,-6.03 282.74,0";

const WHEEL_CX = 141.37;
const WHEEL_CY = -45;
const WHEEL_R = 45;

/**
 * The centerpiece "art" for this step: a spinning wheel with a marked point
 * on its rim, next to the exact cycloid arch that point traces over one
 * full roll. The math is real (reused from physics.ts's cycloid formula) —
 * the curve itself is the illustration, drawn in the site's flat,
 * chunky-outline style.
 */
export function WheelDiagram({ className }: WheelDiagramProps) {
  return (
    <svg viewBox="-25 -105 330 120" className={className} aria-hidden focusable="false">
      <line
        x1="-25"
        y1="0"
        x2="300"
        y2="0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <polyline
        points={CYCLOID_ARCH}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${WHEEL_CX} ${WHEEL_CY}`}
          to={`360 ${WHEEL_CX} ${WHEEL_CY}`}
          dur="6s"
          repeatCount="indefinite"
        />
        <circle
          cx={WHEEL_CX}
          cy={WHEEL_CY}
          r={WHEEL_R}
          fill="var(--tile-1)"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <line
          x1={WHEEL_CX - WHEEL_R}
          y1={WHEEL_CY}
          x2={WHEEL_CX + WHEEL_R}
          y2={WHEEL_CY}
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.5"
        />
        <line
          x1={WHEEL_CX}
          y1={WHEEL_CY - WHEEL_R}
          x2={WHEEL_CX}
          y2={WHEEL_CY + WHEEL_R}
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.5"
        />
        <circle
          cx={WHEEL_CX}
          cy={WHEEL_CY - WHEEL_R}
          r="6.5"
          fill="var(--brand)"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
