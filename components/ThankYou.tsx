"use client";

import { useEffect, useRef } from "react";

export default function ThankYou() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.2}s`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="content-section"
      aria-label="Thank You"
      style={{
        background: "linear-gradient(160deg, #0e0c06 0%, #1c1a08 50%, #0a0804 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gold glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(212,168,40,0.08) 0%, transparent 70%)",
      }} />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
          paddingBottom: "max(80px, env(safe-area-inset-bottom) + 60px)",
          paddingLeft: "28px",
          paddingRight: "28px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Ornament top */}
        <div
          ref={(el) => { itemsRef.current[0] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "2.5rem",
            color: "rgba(212,168,83,0.5)",
            marginBottom: "32px",
            lineHeight: 1,
          }}
        >
          🌿
        </div>

        {/* Label */}
        <div
          ref={(el) => { itemsRef.current[1] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.65rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(212,168,83,0.7)",
            marginBottom: "28px",
          }}
        >
          ✦ From Our Hearts ✦
        </div>

        {/* Main message */}
        <div
          ref={(el) => { itemsRef.current[2] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(2.4rem, 10vw, 3.2rem)",
            fontWeight: 300,
            color: "var(--cream-100)",
            lineHeight: 1.15,
            marginBottom: "36px",
          }}
        >
          Thank You<br />for Being<br />Part of Our Story
        </div>

        <div className="divider-gold" style={{ marginBottom: "36px" }} />

        {/* Personal message */}
        <div
          ref={(el) => { itemsRef.current[3] = el; }}
          className="reveal-item glass-panel"
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "32px 28px",
            marginBottom: "40px",
          }}
        >
          <p className="body-elegant" style={{ fontSize: "1rem", lineHeight: 1.9 }}>
            Your presence at our wedding would be the greatest gift we could
            ask for. Whether near or far, your love and blessings have always
            been the wind beneath our wings.
          </p>
          <br />
          <p className="body-elegant" style={{ fontSize: "1rem", lineHeight: 1.9 }}>
            We look forward to celebrating this beautiful beginning with you —
            surrounded by the people who make our lives whole.
          </p>
        </div>

        {/* Couple signature */}
        <div
          ref={(el) => { itemsRef.current[4] = el; }}
          className="reveal-item"
          style={{ marginBottom: "16px" }}
        >
          <div
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "2.2rem",
              fontWeight: 300,
              color: "var(--cream-100)",
              letterSpacing: "0.04em",
            }}
          >
            Priya &amp; Arjun
          </div>
        </div>

        {/* Date reminder */}
        <div
          ref={(el) => { itemsRef.current[5] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(212,168,83,0.55)",
            marginBottom: "48px",
          }}
        >
          14 February 2026 · Mumbai
        </div>

        {/* Gold ornament footer */}
        <div
          ref={(el) => { itemsRef.current[6] = el; }}
          className="reveal-item"
          style={{ marginBottom: "20px" }}
        >
          <div className="divider-gold" style={{ marginBottom: "20px" }} />
          <div
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "0.8rem",
              color: "rgba(212,168,83,0.4)",
              letterSpacing: "0.08em",
            }}
          >
            With love &amp; gratitude
          </div>
        </div>

        {/* Decorative footer petals */}
        <div
          ref={(el) => { itemsRef.current[7] = el; }}
          className="reveal-item"
          style={{
            fontSize: "1.5rem",
            letterSpacing: "0.8rem",
            opacity: 0.4,
            marginTop: "12px",
          }}
        >
          🌸 🌿 🌸
        </div>
      </div>
    </section>
  );
}
