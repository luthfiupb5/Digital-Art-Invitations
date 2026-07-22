"use client";

import { useEffect, useRef } from "react";

interface Seq3EndOverlayProps {
  isVisible: boolean;
  progress: number; // 0 -> 1 during seq3 pin phase
  fadeOut?: number;
}

const REVEAL_STAGES = [
  { threshold: 0.02 }, // White sky gradient
  { threshold: 0.04 }, // Label
  { threshold: 0.09 }, // Headline
  { threshold: 0.14 }, // Divider
  { threshold: 0.19 }, // Story paragraph
  { threshold: 0.25 }, // Signature
  { threshold: 0.32 }, // Scroll indicator
];

export default function Seq3EndOverlay({ isVisible, progress, fadeOut = 1 }: Seq3EndOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const skyGradRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const elementsRef = [labelRef, titleRef, dividerRef, storyRef, signatureRef, scrollHintRef];

  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current.style.opacity = isVisible ? String(fadeOut) : "0";
    overlayRef.current.style.pointerEvents = isVisible && fadeOut > 0.1 ? "auto" : "none";
  }, [isVisible, fadeOut]);

  useEffect(() => {
    // 1. Soft white sky gradient fade in
    if (skyGradRef.current) {
      const gradOpacity = Math.min(progress / 0.15, 1);
      skyGradRef.current.style.opacity = String(gradOpacity);
    }

    // 2. Minimal text elements reveal (all finished by progress = 0.32)
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
      id="seq3-end-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "max(7vh, 48px)",
        paddingLeft: "28px",
        paddingRight: "28px",
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
          height: "70%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.82) 58%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          zIndex: -1,
          opacity: 0,
          transition: "none",
        }}
      />

      {/* ── Label ───────────────────────────────────────────────────────────── */}
      <div
        ref={labelRef}
        style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "0.62rem",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: "#b5831e",
          marginBottom: "12px",
          opacity: 0,
          transform: "translateY(12px)",
          transition: "none",
        }}
      >
        ✦ Our Story ✦
      </div>

      {/* ── Title ───────────────────────────────────────────────────────────── */}
      <div
        ref={titleRef}
        style={{
          fontFamily: "var(--font-cormorant)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(2.2rem, 8.5vw, 3.2rem)",
          lineHeight: 1.1,
          color: "#1a2e1c",
          textAlign: "center",
          letterSpacing: "0.02em",
          opacity: 0,
          transform: "translateY(12px)",
          transition: "none",
        }}
      >
        A Love Written in the Stars
      </div>

      {/* ── Minimal Gold Divider ────────────────────────────────────────────── */}
      <div
        ref={dividerRef}
        style={{
          width: "50px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(181,131,30,0.7), transparent)",
          margin: "14px auto 18px",
          opacity: 0,
          transform: "translateY(12px)",
          transition: "none",
        }}
      />

      {/* ── Minimal Story Paragraph ──────────────────────────────────────────── */}
      <div
        ref={storyRef}
        style={{
          maxWidth: "360px",
          fontFamily: "var(--font-crimson)",
          fontWeight: 400,
          fontSize: "0.92rem",
          lineHeight: 1.8,
          color: "#2d4a2d",
          textAlign: "center",
          fontStyle: "italic",
          opacity: 0,
          transform: "translateY(12px)",
          transition: "none",
        }}
      >
        "Two paths crossed under a golden sky, turning simple moments into an
        everlasting journey. Every conversation and shared dream brought us
        closer to this beautiful day."
      </div>

      {/* ── Signature Accent ────────────────────────────────────────────────── */}
      <div
        ref={signatureRef}
        style={{
          fontFamily: "var(--font-cormorant)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "1.25rem",
          color: "#b5831e",
          marginTop: "16px",
          letterSpacing: "0.06em",
          opacity: 0,
          transform: "translateY(12px)",
          transition: "none",
        }}
      >
        — Priya &amp; Arjun
      </div>

      {/* ── Minimal Scroll Indicator ────────────────────────────────────────── */}
      <div
        ref={scrollHintRef}
        style={{
          marginTop: "auto",
          marginBottom: "max(5vh, 32px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          opacity: 0,
          transform: "translateY(12px)",
          transition: "none",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "28px",
            background: "linear-gradient(to bottom, rgba(181,131,30,0.8), transparent)",
            animation: "pulseLine3 2s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes pulseLine3 {
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
          Scroll to explore details
        </span>
      </div>
    </div>
  );
}
