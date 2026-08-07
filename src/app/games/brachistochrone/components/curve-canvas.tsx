"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { CURVE_STYLE } from "../curve-style";
import { VIEW_BOX_HEIGHT, VIEW_BOX_WIDTH, type Point, type TimedSample } from "../physics";
import type { CurveId, SimPhase } from "../use-brachistochrone-sim";

interface CurveCanvasProps {
  start: Point;
  end: Point;
  customPoints: Point[];
  curves: Record<CurveId, TimedSample[]>;
  activeCurveIds: CurveId[];
  ballPositions: Partial<Record<CurveId, Point>>;
  phase: SimPhase;
  guess: CurveId | null;
  onStartChange: (point: Point) => void;
  onEndChange: (point: Point) => void;
  onCustomPointChange: (index: number, point: Point) => void;
}

// Math-space (+y up) <-> SVG-space (+y down) flip. Self-inverse, so the same
// function converts either direction.
function flipY(point: Point): Point {
  return { x: point.x, y: VIEW_BOX_HEIGHT - point.y };
}

interface HandleProps {
  point: Point;
  label?: string;
  labelSide: "above" | "below";
  showPulse: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGCircleElement>) => void;
}

// A draggable endpoint/control point: a big, easy-to-hit dot, a hover halo,
// and (until the user's first drag anywhere) a gentle pulse so it's obvious
// at a glance that these are the things to grab — not just curve decoration.
function DragHandle({ point, label, labelSide, showPulse, onPointerDown }: HandleProps) {
  const labelY = labelSide === "above" ? point.y - 16 : point.y + 22;
  return (
    <g className="group">
      {showPulse && (
        <circle
          cx={point.x}
          cy={point.y}
          r={13}
          fill="var(--brand)"
          opacity={0.35}
          className="pointer-events-none animate-ping"
        />
      )}
      <circle
        cx={point.x}
        cy={point.y}
        r={15}
        fill="var(--brand)"
        opacity={0}
        className="pointer-events-none transition-opacity duration-150 group-hover:opacity-15"
      />
      <circle
        cx={point.x}
        cy={point.y}
        r={9}
        fill="var(--foreground)"
        stroke="var(--background)"
        strokeWidth={2}
        className="cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
      />
      {label && (
        <text
          x={point.x}
          y={labelY}
          textAnchor="middle"
          className="fill-foreground font-heading pointer-events-none text-[13px] font-medium select-none"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export function CurveCanvas({
  start,
  end,
  customPoints,
  curves,
  activeCurveIds,
  ballPositions,
  phase,
  guess,
  onStartChange,
  onEndChange,
  onCustomPointChange,
}: CurveCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hasDragged, setHasDragged] = useState(false);

  function clientToMathPoint(clientX: number, clientY: number): Point {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    // Clamp to the visible track (with a small margin so a handle's own
    // radius never clips past the edge) — otherwise a fast drag can carry a
    // point past the SVG's bounds entirely, since pointer capture keeps
    // delivering move events anywhere on screen while dragging.
    const rawX = ((clientX - rect.left) * VIEW_BOX_WIDTH) / rect.width;
    const rawY = ((clientY - rect.top) * VIEW_BOX_HEIGHT) / rect.height;
    const margin = 12;
    const svgPoint: Point = {
      x: Math.min(Math.max(rawX, margin), VIEW_BOX_WIDTH - margin),
      y: Math.min(Math.max(rawY, margin), VIEW_BOX_HEIGHT - margin),
    };
    return flipY(svgPoint);
  }

  function startDrag(id: string) {
    return (event: ReactPointerEvent<SVGCircleElement>) => {
      if (phase === "racing") return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDraggingId(id);
      setHasDragged(true);
    };
  }

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!draggingId) return;
    const point = clientToMathPoint(event.clientX, event.clientY);

    if (draggingId === "start") {
      onStartChange(point);
    } else if (draggingId === "end") {
      onEndChange(point);
    } else if (draggingId.startsWith("custom-")) {
      const index = Number(draggingId.slice("custom-".length));
      onCustomPointChange(index, point);
    }
  }

  function endDrag() {
    setDraggingId(null);
  }

  const startSvg = flipY(start);
  const endSvg = flipY(end);

  return (
    <div className="space-y-2">
      <p className="text-foreground/60 flex items-center gap-1.5 text-xs">
        <span aria-hidden>↕</span> Drag the dots to reshape the track
      </p>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
        role="img"
        aria-label="Brachistochrone race track — drag the two dots to reshape it"
        className="bg-tile-6/40 border-foreground/80 h-auto w-full touch-none rounded-xl border-2 select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        {activeCurveIds.map((id) => {
          const style = CURVE_STYLE[id];
          const points = curves[id]
            .map((sample) => flipY(sample.point))
            .map((p) => `${p.x},${p.y}`)
            .join(" ");
          return (
            <polyline
              key={id}
              points={points}
              fill="none"
              stroke={style.stroke}
              strokeDasharray={style.dash}
              strokeWidth={guess === id ? 4 : 2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {activeCurveIds.map((id) => {
          const ballPoint = ballPositions[id];
          if (!ballPoint) return null;
          const svgBall = flipY(ballPoint);
          return (
            <circle
              key={`ball-${id}`}
              cx={svgBall.x}
              cy={svgBall.y}
              r={7}
              fill={CURVE_STYLE[id].stroke}
              stroke="var(--background)"
              strokeWidth={1.5}
            />
          );
        })}

        {customPoints.map((point, index) => (
          <DragHandle
            key={`custom-point-${index}`}
            point={flipY(point)}
            labelSide="below"
            showPulse={false}
            onPointerDown={startDrag(`custom-${index}`)}
          />
        ))}

        <DragHandle
          point={startSvg}
          label="Start"
          labelSide={startSvg.y <= endSvg.y ? "above" : "below"}
          showPulse={!hasDragged}
          onPointerDown={startDrag("start")}
        />
        <DragHandle
          point={endSvg}
          label="End"
          labelSide={endSvg.y <= startSvg.y ? "above" : "below"}
          showPulse={!hasDragged}
          onPointerDown={startDrag("end")}
        />
      </svg>

      <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {activeCurveIds.map((id) => (
          <span key={id} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: CURVE_STYLE[id].stroke }}
            />
            {CURVE_STYLE[id].label}
          </span>
        ))}
      </div>
    </div>
  );
}
