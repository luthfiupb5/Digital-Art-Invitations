"use client";

import { useEffect, useRef } from "react";

interface HeroOverlayProps {
  isVisible: boolean;
  progress: number;
  fadeOut?: number;
}

const REVEAL_STAGES = [
  { threshold: 0.08 },  // Bride name
  { threshold: 0.22 },  // ampersand
  { threshold: 0.36 },  // Groom name
  { threshold: 0.52 },  // thin gold line
  { threshold: 0.62 },  // Date
];

export default function HeroOverlay({ isVisible, progress, fadeOut = 1 }: HeroOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const brideRef = useRef<HTMLDivElement>(null);
  const ampRef = useRef<HTMLDivElement>(null);
  const groomRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const allRefs = [brideRef, ampRef, groomRef, lineRef, dateRef];

  useEffect(() => {
    allRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const stage = REVEAL_STAGES[i];
      const el = ref.current;
      if (progress >= stage.threshold) {
        const local = Math.min((progress - stage.threshold) / 0.16, 1);
        el.style.opacity = String(Math.min(local * 1.5, 1));
        el.style.transform = `translateY(${(1 - local) * 18}px)`;
      } else {
        el.style.opacity = "0";
        el.style.transform = "translateY(18px)";
      }
    });
  }, [progress]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!overlayRef.current) return;
    const baseOpacity = isVisible ? 1 : 0;
    overlayRef.current.style.opacity = String(baseOpacity * fadeOut);
  }, [isVisible, fadeOut]);

  return (
    <div
      ref={overlayRef}
      id="hero-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "max(9vh, 56px)",
        paddingLeft: "24px",
        paddingRight: "24px",
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.4s ease",
      }}
    >

      {/* Bride name */}
      <div
        ref={brideRef}
        style={{
          fontFamily: "var(--font-cormorant)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(3.2rem, 13vw, 4.2rem)",
          lineHeight: 1,
          color: "#ffffff",
          textShadow:
            "0 2px 0 rgba(0,0,0,0.55), 0 4px 20px rgba(0,0,0,0.85), 0 0 50px rgba(0,0,0,0.4)",
          letterSpacing: "0.04em",
          opacity: 0,
          transform: "translateY(18px)",
          transition: "none",
          textAlign: "center",
        }}
      >
        Aisha
      </div>

      {/* Ampersand */}
      <div
        ref={ampRef}
        style={{
          fontFamily: "var(--font-cormorant)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(2rem, 8vw, 2.8rem)",
          lineHeight: 1,
          marginTop: "12px",
          marginBottom: "12px",
          color: "#FFD97A",
          textShadow: "0 2px 14px rgba(0,0,0,0.9), 0 0 32px rgba(0,0,0,0.6)",
          opacity: 0,
          transform: "translateY(18px)",
          transition: "none",
        }}
      >
        &amp;
      </div>

      {/* Groom name */}
      <div
        ref={groomRef}
        style={{
          fontFamily: "var(--font-cormorant)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(3.2rem, 13vw, 4.2rem)",
          lineHeight: 1,
          color: "#ffffff",
          textShadow:
            "0 2px 0 rgba(0,0,0,0.55), 0 4px 20px rgba(0,0,0,0.85), 0 0 50px rgba(0,0,0,0.4)",
          letterSpacing: "0.04em",
          opacity: 0,
          transform: "translateY(18px)",
          transition: "none",
          textAlign: "center",
        }}
      >
        Zayd
      </div>

      {/* Thin gold separator */}
      <div
        ref={lineRef}
        style={{
          width: "60px",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,217,122,0.9), transparent)",
          margin: "18px auto",
          opacity: 0,
          transition: "none",
        }}
      />

      {/* Date only — clean and minimal */}
      <div
        ref={dateRef}
        style={{
          fontFamily: "var(--font-crimson)",
          fontWeight: 400,
          fontSize: "0.68rem",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "#ffffff",
          textShadow: "0 1px 4px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.85)",
          opacity: 0,
          transform: "translateY(18px)",
          transition: "none",
          textAlign: "center",
        }}
      >
        14 · 02 · 2026
      </div>
    </div>
  );
}
