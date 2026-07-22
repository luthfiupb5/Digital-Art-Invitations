"use client";

import { useEffect, useRef } from "react";

interface Seq4EndOverlayProps {
  isVisible: boolean;
  progress: number; // 0 -> 1 during seq4 pin phase
  fadeOut?: number;
}

const REVEAL_STAGES = [
  { threshold: 0.02 }, // White sky gradient
  { threshold: 0.04 }, // Label (✦ The Couple ✦)
  { threshold: 0.08 }, // Bride name
  { threshold: 0.13 }, // Bride parents
  { threshold: 0.17 }, // Ampersand (&)
  { threshold: 0.21 }, // Groom name
  { threshold: 0.26 }, // Groom parents
  { threshold: 0.32 }, // Minimal gold divider
  { threshold: 0.38 }, // Scroll indicator
];

export default function Seq4EndOverlay({
  isVisible,
  progress,
  fadeOut = 1,
}: Seq4EndOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const skyGradRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const brideNameRef = useRef<HTMLDivElement>(null);
  const brideParentsRef = useRef<HTMLDivElement>(null);
  const ampersandRef = useRef<HTMLDivElement>(null);
  const groomNameRef = useRef<HTMLDivElement>(null);
  const groomParentsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const elementsRef = [
    labelRef,
    brideNameRef,
    brideParentsRef,
    ampersandRef,
    groomNameRef,
    groomParentsRef,
    dividerRef,
    scrollHintRef,
  ];

  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current.style.opacity = isVisible ? String(fadeOut) : "0";
    overlayRef.current.style.pointerEvents = isVisible && fadeOut > 0.1 ? "auto" : "none";
  }, [isVisible, fadeOut]);

  useEffect(() => {
    // 1. Soft white/champagne sky gradient fade in
    if (skyGradRef.current) {
      const gradOpacity = Math.min(progress / 0.15, 1);
      skyGradRef.current.style.opacity = String(gradOpacity);
    }

    // 2. Minimal text elements reveal (staggered up to progress = 0.38)
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
      id="seq4-end-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "clamp(75px, 13vh, 120px)",
        paddingLeft: "24px",
        paddingRight: "24px",
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.5s ease",
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
          height: "85%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          zIndex: -1,
          opacity: 0,
          transition: "none",
        }}
      />

      {/* ── Minimal Top Tag ─────────────────────────────────────────────────── */}
      <div
        ref={labelRef}
        style={{
          fontFamily: "var(--font-crimson)",
          fontSize: "0.62rem",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: "#b5831e",
          marginBottom: "16px",
          opacity: 0,
          transform: "translateY(12px)",
          transition: "none",
        }}
      >
        ✦ The Bride &amp; Groom ✦
      </div>

      {/* ── Couple Container ────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "12px",
          maxWidth: "460px",
          width: "100%",
        }}
      >
        {/* Bride Block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            ref={brideNameRef}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2.4rem, 8vw, 3.4rem)",
              lineHeight: 1.1,
              color: "#1f1816",
              letterSpacing: "0.02em",
              opacity: 0,
              transform: "translateY(12px)",
              transition: "none",
            }}
          >
            Fathima Beevi
          </div>
          <div
            ref={brideParentsRef}
            style={{
              fontFamily: "var(--font-crimson)",
              fontWeight: 400,
              fontSize: "0.88rem",
              letterSpacing: "0.08em",
              color: "#6b5443",
              marginTop: "4px",
              opacity: 0,
              transform: "translateY(12px)",
              transition: "none",
            }}
          >
            Daughter of <span style={{ color: "#3d2e24", fontWeight: 600 }}>Mr. Rajesh Sharma</span> &amp; <span style={{ color: "#3d2e24", fontWeight: 600 }}>Mrs. Sunita Sharma</span>
          </div>
        </div>

        {/* Minimal Gold Ampersand */}
        <div
          ref={ampersandRef}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "1.8rem",
            color: "#b5831e",
            margin: "2px 0",
            opacity: 0,
            transform: "translateY(12px)",
            transition: "none",
          }}
        >
          &amp;
        </div>

        {/* Groom Block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            ref={groomNameRef}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2.4rem, 8vw, 3.4rem)",
              lineHeight: 1.1,
              color: "#1f1816",
              letterSpacing: "0.02em",
              opacity: 0,
              transform: "translateY(12px)",
              transition: "none",
            }}
          >
            Muhammed PP
          </div>
          <div
            ref={groomParentsRef}
            style={{
              fontFamily: "var(--font-crimson)",
              fontWeight: 400,
              fontSize: "0.88rem",
              letterSpacing: "0.08em",
              color: "#6b5443",
              marginTop: "4px",
              opacity: 0,
              transform: "translateY(12px)",
              transition: "none",
            }}
          >
            Son of <span style={{ color: "#3d2e24", fontWeight: 600 }}>Mr. Suresh Mehta</span> &amp; <span style={{ color: "#3d2e24", fontWeight: 600 }}>Mrs. Kavita Mehta</span>
          </div>
        </div>
      </div>

      {/* ── Minimal Gold Divider ────────────────────────────────────────────── */}
      <div
        ref={dividerRef}
        style={{
          width: "60px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(181,131,30,0.7), transparent)",
          margin: "20px auto 0",
          opacity: 0,
          transform: "translateY(12px)",
          transition: "none",
        }}
      />

      {/* ── Minimal Scroll Indicator ────────────────────────────────────────── */}
      <div
        ref={scrollHintRef}
        style={{
          marginTop: "auto",
          marginBottom: "max(4vh, 24px)",
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
            animation: "pulseLine4 2s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes pulseLine4 {
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
          Scroll for complete wedding schedule
        </span>
      </div>
    </div>
  );
}
