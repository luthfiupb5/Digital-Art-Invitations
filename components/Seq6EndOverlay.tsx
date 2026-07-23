"use client";

import { useEffect, useRef } from "react";

interface Seq6EndOverlayProps {
  isVisible: boolean;
  progress: number; // 0 -> 1 during seq6 pin phase
  fadeOut?: number;
}

export default function Seq6EndOverlay({
  isVisible,
  progress,
  fadeOut = 1,
}: Seq6EndOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const radialShadeRef = useRef<HTMLDivElement>(null);
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
    if (radialShadeRef.current) {
      const shadeOpacity = Math.min(progress / 0.15, 1);
      radialShadeRef.current.style.opacity = String(shadeOpacity);
    }
    if (contentRef.current) {
      const contentOpacity = Math.min(Math.max(0, (progress - 0.04) / 0.15), 1);
      contentRef.current.style.opacity = String(contentOpacity);
      contentRef.current.style.transform = `translateY(${(1 - contentOpacity) * 12}px)`;
    }
  }, [progress]);

  return (
    <div
      ref={overlayRef}
      id="seq6-end-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // Centered vertically & horizontally
        paddingLeft: "16px",
        paddingRight: "16px",
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* ── Compact Soft Radial White Shade Background Overlay ──────────── */}
      <div
        ref={radialShadeRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 45%, rgba(255,255,255,0) 80%)",
          pointerEvents: "none",
          zIndex: -1,
          opacity: 0,
        }}
      />

      {/* ── Compact Main Content Block (Centered) ─────────────────────────── */}
      <div
        ref={contentRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "340px",
          width: "100%",
          opacity: 0,
          transform: "translateY(12px)",
          transition: "transform 0.4s ease, opacity 0.4s ease",
        }}
      >
        {/* Minimal Gold Top Label */}
        <div
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.58rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "#b5831e",
            marginBottom: "6px",
          }}
        >
          ✦ Event Location ✦
        </div>

        {/* Location Name */}
        <h2
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(1.7rem, 6vw, 2.3rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "#1f1816",
            letterSpacing: "0.02em",
            margin: "0 0 4px 0",
          }}
        >
          The Grand Palace Garden
        </h2>

        {/* Address */}
        <div
          style={{
            fontFamily: "var(--font-crimson)",
            fontWeight: 400,
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            color: "#6b5443",
            marginBottom: "12px",
          }}
        >
          Marine Drive, Mumbai, Maharashtra 400002
        </div>

        {/* Gold Line Divider */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(181,131,30,0.7), transparent)",
            marginBottom: "14px",
          }}
        />

        {/* Compact Embedded Google Map */}
        <div
          style={{
            width: "100%",
            maxWidth: "320px",
            height: "150px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(181,131,30,0.35)",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
            marginBottom: "14px",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.8!2d72.8236!3d18.9439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c73a0c4de7%3A0x123456!2sMarine+Drive%2C+Mumbai!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "contrast(0.95) saturate(0.9)" }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Venue Location — Marine Drive, Mumbai"
          />
        </div>

        {/* Compact Get Directions Button */}
        <div>
          <a
            href="https://maps.google.com/?q=Marine+Drive+Mumbai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-crimson)",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#5e4514",
              textDecoration: "none",
              border: "1px solid rgba(181,131,30,0.5)",
              borderRadius: "50px",
              padding: "7px 18px",
              background: "rgba(255, 255, 255, 0.85)",
              boxShadow: "0 3px 10px rgba(181,131,30,0.12)",
              transition: "all 0.3s ease",
            }}
          >
            <span>↗</span> Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
