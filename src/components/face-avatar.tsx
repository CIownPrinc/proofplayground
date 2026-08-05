"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Measured directly from the source artwork (pixel-scanned and verified with
// marker overlays), expressed as % of the image box so every overlay stays
// aligned at any display size.
const EYES = [
  { x: 25.29, y: 54.55, rx: 6.19, ry: 5.64 },
  { x: 55.88, y: 55.73, rx: 6.61, ry: 5.77 },
] as const;

const BROWS = [
  { src: "/brow-left.png", left: 12.24, top: 38.77, width: 18.99, height: 6.87 },
  { src: "/brow-right.png", left: 43.88, top: 39.63, width: 20.96, height: 7.73 },
] as const;

const MOUTH = { cx: 37.34, cy: 79.35 };
const MOUTH_COVER_COLOR = "#c48a55";
const MOUTH_OPEN_COLOR = "#966848";
const MOUTH_INNER_COLOR = "#5a2e22";

const PUPIL_COLOR = "#251b15";
const PUPIL_SIZE_PCT = 6.4; // diameter, as % of avatar width
const MAX_TRACK_PCT = 4.5; // how far a pupil may drift from its socket center
const HOVER_PUPIL_SCALE = 1.3;

const GRAVITY = 2200; // px/s^2
const BOUNCE_DAMPING = 0.55;
const SETTLE_VELOCITY = 60; // px/s
const FALL_HORIZONTAL_KICK = 140;

interface Offset {
  x: number;
  y: number;
}

interface FacePhysics {
  x: number;
  y: number;
  width: number;
  vx: number;
  vy: number;
  rotation: number;
  angularVelocity: number;
}

export function FaceAvatar() {
  const containerRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<number | null>(null);
  const [offsets, setOffsets] = useState<[Offset, Offset]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const [hovering, setHovering] = useState(false);
  const [physics, setPhysics] = useState<FacePhysics | null>(null);

  useEffect(() => {
    function handleMove(event: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();

      const next = EYES.map((eye) => {
        const eyeCenterX = rect.left + (eye.x / 100) * rect.width;
        const eyeCenterY = rect.top + (eye.y / 100) * rect.height;
        const dx = event.clientX - eyeCenterX;
        const dy = event.clientY - eyeCenterY;
        const distance = Math.hypot(dx, dy);
        const maxPx = (MAX_TRACK_PCT / 100) * rect.width;
        const scale = distance > 0 ? Math.min(1, maxPx / distance) : 0;
        return { x: dx * scale, y: dy * scale };
      }) as [Offset, Offset];

      setOffsets(next);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function startFalling() {
    const el = containerRef.current;
    if (!el || physics) return;
    const rect = el.getBoundingClientRect();

    const state: FacePhysics = {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      vx: (Math.random() - 0.5) * FALL_HORIZONTAL_KICK,
      vy: 0,
      rotation: 0,
      angularVelocity: (Math.random() - 0.5) * 200,
    };
    setPhysics(state);

    const floor = window.innerHeight - rect.height;
    let last = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;

      state.vy += GRAVITY * dt;
      state.x += state.vx * dt;
      state.y += state.vy * dt;
      state.rotation += state.angularVelocity * dt;

      let settled = false;
      if (state.y >= floor) {
        state.y = floor;
        state.vy = -state.vy * BOUNCE_DAMPING;
        state.vx *= 0.7;
        state.angularVelocity *= 0.6;
        if (Math.abs(state.vy) < SETTLE_VELOCITY) {
          state.vy = 0;
          settled = true;
        }
      }

      setPhysics({ ...state });
      frameRef.current = settled ? null : requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
  }

  function reset() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    setPhysics(null);
  }

  return (
    <button
      type="button"
      ref={containerRef}
      onClick={physics ? reset : startFalling}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-label={physics ? "Put the face back" : "Drop the face"}
      className="focus-visible:ring-ring relative block w-28 cursor-pointer appearance-none border-0 bg-transparent p-0 focus-visible:ring-2 focus-visible:outline-none"
      style={{
        aspectRatio: "711 / 815",
        ...(physics
          ? {
              position: "fixed",
              left: physics.x,
              top: physics.y,
              width: physics.width,
              transform: `rotate(${physics.rotation}deg)`,
              transition: "none",
              zIndex: 50,
            }
          : undefined),
      }}
    >
      <Image
        src="/aarit-face.png"
        alt="aarit's avatar"
        fill
        sizes="112px"
        priority
        className="pointer-events-none select-none"
      />

      {/* mouth: hidden by default, revealed as an "O" on hover.
          This cover is a near-rectangle (small radius, not an ellipse) sized
          with generous margin past the real smile's measured bounds — the
          smile's corners sit close to the TOP of its bounding box rather than
          its vertical center, so an elliptical cover tapers away exactly
          where it needs to be widest and leaves the corners peeking out. */}
      <span
        aria-hidden
        className={`absolute rounded-[18%] transition-all duration-200 ${hovering ? "opacity-100" : "opacity-0"}`}
        style={{
          left: `${MOUTH.cx}%`,
          top: `${MOUTH.cy}%`,
          width: "38%",
          height: "19%",
          transform: "translate(-50%, -50%)",
          backgroundColor: MOUTH_COVER_COLOR,
        }}
      />
      <span
        aria-hidden
        className={`absolute rounded-full transition-all duration-200 ${hovering ? "opacity-100" : "opacity-0"}`}
        style={{
          left: `${MOUTH.cx}%`,
          top: `${MOUTH.cy}%`,
          width: "12%",
          height: "11%",
          transform: "translate(-50%, -50%)",
          backgroundColor: MOUTH_OPEN_COLOR,
        }}
      />
      <span
        aria-hidden
        className={`absolute rounded-full transition-all duration-200 ${hovering ? "opacity-100" : "opacity-0"}`}
        style={{
          left: `${MOUTH.cx}%`,
          top: `${MOUTH.cy + 1}%`,
          width: "7%",
          height: "6.5%",
          transform: "translate(-50%, -50%)",
          backgroundColor: MOUTH_INNER_COLOR,
        }}
      />

      {/* eyebrows: real cropped art, always shown at rest position, rise on hover */}
      {BROWS.map((brow) => (
        <span
          key={brow.src}
          aria-hidden
          className={`absolute transition-transform duration-200 ${hovering ? "-translate-y-[160%]" : "translate-y-0"}`}
          style={{
            left: `${brow.left}%`,
            top: `${brow.top}%`,
            width: `${brow.width}%`,
            height: `${brow.height}%`,
          }}
        >
          <Image
            src={brow.src}
            alt=""
            fill
            sizes="40px"
            className="pointer-events-none select-none"
          />
        </span>
      ))}

      {/* pupils: always tracking the cursor, dilate on hover */}
      {EYES.map((eye, i) => {
        const offset = offsets[i]!;
        return (
          <span
            key={i}
            aria-hidden
            className="absolute rounded-full transition-transform duration-200"
            style={{
              left: `${eye.x}%`,
              top: `${eye.y}%`,
              width: `${PUPIL_SIZE_PCT}%`,
              aspectRatio: "1 / 1",
              backgroundColor: PUPIL_COLOR,
              // translate handles centering + cursor tracking, scale handles the
              // hover "wide eyed" reaction — both must live in this one
              // transform, since an inline style.transform fully overrides any
              // Tailwind transform-composing utility classes (e.g. scale-125)
              // applied via className on the same element.
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${hovering ? HOVER_PUPIL_SCALE : 1})`,
            }}
          />
        );
      })}
    </button>
  );
}
