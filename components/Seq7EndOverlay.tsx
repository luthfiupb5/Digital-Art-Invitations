"use client";

import { useEffect, useRef } from "react";

interface Seq7EndOverlayProps {
  isVisible: boolean;
  progress: number; // 0 -> 1 during seq7 pin phase / early reveal
  fadeOut?: number;
}

export default function Seq7EndOverlay({
  isVisible,
  progress,
  fadeOut = 1,
}: Seq7EndOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const skyGradRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // ── Visibility & Opacity Handling ─────────────────────────────────────
  useEffect(() => {
    if (!overlayRef.current) return;
    const baseOpacity = isVisible ? 1 : 0;
    const finalOpacity = baseOpacity * fadeOut;
    overlayRef.current.style.opacity = String(finalOpacity);
    overlayRef.current.style.pointerEvents = finalOpacity > 0.1 ? "auto" : "none";
  }, [isVisible, fadeOut]);

  useEffect(() => {
    if (skyGradRef.current) {
      const shadeOpacity = Math.min(progress / 0.15, 1);
      skyGradRef.current.style.opacity = String(shadeOpacity);
    }
    if (contentRef.current) {
      const contentOpacity = Math.min(Math.max(0, (progress - 0.04) / 0.15), 1);
      contentRef.current.style.opacity = String(contentOpacity);
      contentRef.current.style.transform = `translateY(${(1 - contentOpacity) * 14}px)`;
    }
  }, [progress]);

  return (
    <div
      ref={overlayRef}
      id="seq7-end-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // Top-aligned content layout
        paddingTop: "clamp(60px, 10vh, 95px)",
        paddingLeft: "20px",
        paddingRight: "20px",
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* ── Soft White Sky Gradient Overlay (Top Shade) ────────────────── */}
      <div
        ref={skyGradRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "80%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          zIndex: -1,
          opacity: 0,
        }}
      />

      {/* ── Main Content Container ─────────────────────────────────── */}
      <div
        ref={contentRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "360px",
          width: "100%",
          opacity: 0,
          transform: "translateY(14px)",
          transition: "transform 0.4s ease, opacity 0.4s ease",
        }}
      >
        {/* Minimal Gold Top Tag */}
        <div
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.58rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "#b5831e",
            marginBottom: "8px",
          }}
        >
          ✦ With Gratitude ✦
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(2rem, 7.5vw, 2.8rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "#1f1816",
            letterSpacing: "0.02em",
            margin: "0 0 4px 0",
          }}
        >
          Thank You
        </h2>

        {/* Sub-headline */}
        <div
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
            color: "#6b5443",
            marginBottom: "12px",
          }}
        >
          For Being Part of Our Story
        </div>

        {/* Gold Divider Line */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(181,131,30,0.7), transparent)",
            marginBottom: "14px",
          }}
        />

        {/* Personal Message */}
        <p
          style={{
            fontFamily: "var(--font-crimson)",
            fontWeight: 400,
            fontSize: "0.85rem",
            lineHeight: 1.7,
            letterSpacing: "0.02em",
            color: "#4a3b30",
            marginBottom: "16px",
          }}
        >
          Your presence and blessings mean the world to us as we step into this beautiful new chapter of togetherness.
        </p>

        {/* Couple Signatures */}
        <div
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(1.6rem, 5.5vw, 2.1rem)",
            fontWeight: 400,
            color: "#8c6214",
            letterSpacing: "0.04em",
            marginBottom: "4px",
          }}
        >
          Aisha &amp; Zayd
        </div>

        {/* Date & Location */}
        <div
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#8a7362",
            marginBottom: "12px",
          }}
        >
          14 February 2026 · Mumbai
        </div>

        {/* Minimal Ornament Bottom */}
        <div
          style={{
            fontSize: "0.85rem",
            letterSpacing: "0.4em",
            color: "#b5831e",
            opacity: 0.7,
          }}
        >
          ✦ ✦ ✦
        </div>
      </div>
    </div>
  );
}
