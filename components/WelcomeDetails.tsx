"use client";

import { useEffect, useRef } from "react";

export default function WelcomeDetails() {
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.18}s`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="content-section"
      aria-label="Wedding Details"
      style={{
        background: "linear-gradient(160deg, #0d1a0e 0%, #162b18 40%, #0a1309 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative radial glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(212,168,83,0.08) 0%, transparent 70%)",
      }} />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 28px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top ornament */}
        <div
          ref={(el) => { itemsRef.current[0] = el; }}
          className="reveal-item"
          style={{ fontSize: "1.6rem", marginBottom: "24px", opacity: 0.7 }}
        >
          🌿
        </div>

        {/* Together Forever label */}
        <div
          ref={(el) => { itemsRef.current[1] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.62rem",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "rgba(212,168,83,0.8)",
            marginBottom: "20px",
          }}
        >
          ✦ Together Forever ✦
        </div>

        {/* Full couple names */}
        <div
          ref={(el) => { itemsRef.current[2] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(2.6rem, 10vw, 3.4rem)",
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: "6px",
            letterSpacing: "0.03em",
          }}
        >
          Priya Sharma
        </div>

        <div
          ref={(el) => { itemsRef.current[3] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.4rem, 5.5vw, 1.8rem)",
            color: "rgba(212,168,83,0.85)",
            marginBottom: "6px",
            textAlign: "center",
          }}
        >
          &amp;
        </div>

        <div
          ref={(el) => { itemsRef.current[4] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(2.6rem, 10vw, 3.4rem)",
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "0.03em",
            marginBottom: "32px",
          }}
        >
          Arjun Mehta
        </div>

        {/* Gold divider */}
        <div
          ref={(el) => { itemsRef.current[5] = el; }}
          className="reveal-item divider-gold"
          style={{ marginBottom: "36px" }}
        />

        {/* Details grid */}
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {[
            { icon: "📅", label: "Date", value: "Saturday, 14th February 2026" },
            { icon: "⏰", label: "Time", value: "11:00 AM · Reception at 7:00 PM" },
            { icon: "📍", label: "Venue", value: "The Grand Palace Garden" },
            { icon: "🏙️", label: "Location", value: "Marine Drive, Mumbai, Maharashtra" },
          ].map((item, i) => (
            <div
              key={item.label}
              ref={(el) => { itemsRef.current[6 + i] = el; }}
              className="reveal-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(212,168,83,0.14)",
                borderRadius: "14px",
                padding: "16px 20px",
              }}
            >
              <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{
                  fontFamily: "var(--font-crimson)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(212,168,83,0.65)",
                  marginBottom: "3px",
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.05rem",
                  fontWeight: 300,
                  color: "rgba(247,238,223,0.95)",
                }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dress code note */}
        <div
          ref={(el) => { itemsRef.current[10] = el; }}
          className="reveal-item"
          style={{
            marginTop: "28px",
            fontFamily: "var(--font-crimson)",
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(212,168,83,0.55)",
            textAlign: "center",
          }}
        >
          Dress Code · Festive Traditional
        </div>

        {/* Ornament bottom */}
        <div
          ref={(el) => { itemsRef.current[11] = el; }}
          className="reveal-item ornament"
          style={{ marginTop: "36px", fontSize: "0.9rem", letterSpacing: "0.5em" }}
        >
          ✦ ✦ ✦
        </div>
      </div>
    </section>
  );
}
