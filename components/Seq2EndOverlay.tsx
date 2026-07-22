"use client";

import { useEffect, useRef } from "react";

interface Seq2EndOverlayProps {
  isVisible: boolean;
  progress: number; // 0 -> 1 during seq2 pin phase
  fadeOut?: number; // 1 -> 0 fade out after seq3 starts
}

const REVEAL_STAGES = [
  { threshold: 0.02 }, // White sky gradient
  { threshold: 0.04 }, // Full names
  { threshold: 0.09 }, // Divider
  { threshold: 0.14 }, // Date
  { threshold: 0.19 }, // Venue & Time
  { threshold: 0.25 }, // Scroll indicator
];

export default function Seq2EndOverlay({ isVisible, progress, fadeOut = 1 }: Seq2EndOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const skyGradRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const venueRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const elementsRef = [namesRef, dividerRef, dateRef, venueRef, scrollHintRef];

  useEffect(() => {
    if (!overlayRef.current) return;
    const baseOpacity = isVisible ? 1 : 0;
    const finalOpacity = baseOpacity * fadeOut;
    overlayRef.current.style.opacity = String(finalOpacity);
    overlayRef.current.style.pointerEvents = finalOpacity > 0 ? "auto" : "none";
  }, [isVisible, fadeOut]);

  useEffect(() => {
    // 1. Soft white sky gradient fade in (fast)
    if (skyGradRef.current) {
      const gradOpacity = Math.min(progress / 0.15, 1);
      skyGradRef.current.style.opacity = String(gradOpacity);
    }

    // 2. Minimal text elements reveal (all finished by progress = 0.28)
    elementsRef.forEach((ref, i) => {
      if (!ref.current) return;
      const stage = REVEAL_STAGES[i + 1];
      const el = ref.current;

      if (progress >= stage.threshold) {
        const local = Math.min((progress - stage.threshold) / 0.08, 1);
        el.style.opacity = String(local);
        el.style.transform = `translateY(${(1 - local) * 12}px)`;
      } else {
        el.style.opacity = "0";
        el.style.transform = "translateY(12px)";
      }
    });
  }, [progress]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={overlayRef}
      id="seq2-end-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "max(8vh, 52px)",
        paddingLeft: "24px",
        paddingRight: "24px",
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* ── Soft White Sky Gradient Fade ────────────────────────────────────── */}
      <div
        ref={skyGradRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "65%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.78) 55%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          zIndex: -1,
          opacity: 0,
          transition: "none",
        }}
      />

      {/* ── Full Names ──────────────────────────────────────────────────────── */}
      <div
        ref={namesRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 0,
          transform: "translateY(14px)",
          transition: "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(2.4rem, 9.5vw, 3.4rem)",
            lineHeight: 1.05,
            color: "#1a2e1c",
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          Priya Sharma
        </div>

        <div
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.4rem, 5vw, 1.8rem)",
            lineHeight: 1,
            margin: "4px 0",
            color: "#b5831e",
          }}
        >
          &amp;
        </div>

        <div
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(2.4rem, 9.5vw, 3.4rem)",
            lineHeight: 1.05,
            color: "#1a2e1c",
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          Arjun Mehta
        </div>
      </div>

      {/* ── Minimal Divider ─────────────────────────────────────────────────── */}
      <div
        ref={dividerRef}
        style={{
          width: "50px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(181,131,30,0.7), transparent)",
          margin: "16px auto",
          opacity: 0,
          transform: "translateY(14px)",
          transition: "none",
        }}
      />

      {/* ── Minimal Date ────────────────────────────────────────────────────── */}
      <div
        ref={dateRef}
        style={{
          fontFamily: "var(--font-crimson)",
          fontWeight: 400,
          fontSize: "0.72rem",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "#2d4a2d",
          marginBottom: "6px",
          opacity: 0,
          transform: "translateY(14px)",
          transition: "none",
          textAlign: "center",
        }}
      >
        Saturday, 14th February 2026
      </div>

      {/* ── Minimal Venue & Time ────────────────────────────────────────────── */}
      <div
        ref={venueRef}
        style={{
          fontFamily: "var(--font-crimson)",
          fontWeight: 300,
          fontSize: "0.68rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(45,74,45,0.85)",
          opacity: 0,
          transform: "translateY(14px)",
          transition: "none",
          textAlign: "center",
        }}
      >
        The Grand Palace Garden, Mumbai · 11:00 AM
      </div>

      {/* ── Minimal Scroll Indicator ────────────────────────────────────────── */}
      <div
        ref={scrollHintRef}
        style={{
          marginTop: "auto",
          marginBottom: "max(6vh, 40px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          opacity: 0,
          transform: "translateY(14px)",
          transition: "none",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "28px",
            background: "linear-gradient(to bottom, rgba(181,131,30,0.8), transparent)",
            animation: "pulseLine 2s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes pulseLine {
            0%, 100% { opacity: 0.4; transform: scaleY(1); }
            50% { opacity: 1; transform: scaleY(1.1); }
          }
        `}</style>
        <span
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(181,131,30,0.8)",
          }}
        >
          Scroll to explore
        </span>
      </div>
    </div>
  );
}
