"use client";

import { useEffect, useRef } from "react";

interface AmbientLayerProps {
  isActive: boolean;
}

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 8) % 90}%`,
  delay: `${i * 1.1}s`,
  duration: `${10 + (i % 4) * 3}s`,
  color: i % 3 === 0
    ? "rgba(212,168,83,0.45)"
    : i % 3 === 1
    ? "rgba(232,184,168,0.4)"
    : "rgba(143,168,143,0.35)",
  size: `${6 + (i % 3) * 3}px`,
  driftX: `${-30 + (i % 5) * 15}px`,
  rot: `${120 + i * 30}deg`,
  width: `${5 + (i % 3) * 4}px`,
  height: `${7 + (i % 3) * 5}px`,
}));

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 5.5) % 95}%`,
  top: `${10 + (i * 7) % 80}%`,
  size: `${2 + (i % 3)}px`,
  delay: `${i * 0.7}s`,
  duration: `${5 + (i % 4) * 2}s`,
  color: i % 2 === 0 ? "rgba(212,168,83,0.3)" : "rgba(247,238,223,0.2)",
}));

export default function AmbientLayer({ isActive }: AmbientLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.style.opacity = isActive ? "1" : "0";
    containerRef.current.style.transition = "opacity 1.5s ease";
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      id="ambient-layer"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: 0,
      }}
    >
      {/* Floating petals */}
      {PETALS.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            background: p.color,
            width: p.width,
            height: p.height,
            borderRadius: "50% 0 50% 0",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ["--drift-x" as any]: p.driftX,
            ["--rot" as any]: p.rot,
          }}
        />
      ))}

      {/* Floating particle dots */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="particle-dot"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

    </div>
  );
}
