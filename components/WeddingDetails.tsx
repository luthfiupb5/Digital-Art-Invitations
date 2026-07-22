"use client";

import { useEffect, useRef } from "react";

const DETAILS = [
  {
    icon: "📅",
    label: "Date",
    value: "Saturday, 14th February",
    sub: "2026",
  },
  {
    icon: "⏰",
    label: "Time",
    value: "11:00 AM onwards",
    sub: "Reception begins at 7:00 PM",
  },
  {
    icon: "📍",
    label: "Venue",
    value: "The Grand Palace Garden",
    sub: "Marine Drive, Mumbai, Maharashtra",
  },
  {
    icon: "🌿",
    label: "Dress Code",
    value: "Festive Traditional",
    sub: "Pastels & Jewel tones welcome",
  },
];

export default function WeddingDetails() {
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
      el.style.transitionDelay = `${i * 0.15}s`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="content-section"
      aria-label="Wedding Details"
      style={{
        background: "linear-gradient(160deg, #070d1a 0%, #0e1d30 50%, #060c16 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Indigo glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(60,100,200,0.09) 0%, transparent 70%)",
      }} />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
          paddingBottom: "80px",
          paddingLeft: "28px",
          paddingRight: "28px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Label */}
        <div
          ref={(el) => { itemsRef.current[0] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.65rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(212,168,83,0.7)",
            marginBottom: "24px",
          }}
        >
          ✦ Wedding Details ✦
        </div>

        {/* Headline */}
        <div
          ref={(el) => { itemsRef.current[1] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(2rem, 8vw, 2.6rem)",
            fontWeight: 300,
            color: "var(--cream-100)",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "12px",
          }}
        >
          Save the Moment
        </div>

        {/* Subtitle */}
        <div
          ref={(el) => { itemsRef.current[2] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.85rem",
            color: "rgba(247,238,223,0.6)",
            letterSpacing: "0.08em",
            marginBottom: "36px",
            textAlign: "center",
          }}
        >
          Every detail, curated with love
        </div>

        <div className="divider-gold" style={{ marginBottom: "36px" }} />

        {/* Detail cards */}
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {DETAILS.map((detail, i) => (
            <div
              key={detail.label}
              ref={(el) => { itemsRef.current[3 + i] = el; }}
              className="reveal-item glass-panel"
              style={{
                padding: "20px 24px",
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(212,168,83,0.1)",
                  border: "1px solid rgba(212,168,83,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  flexShrink: 0,
                }}
              >
                {detail.icon}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-crimson)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(212,168,83,0.65)",
                    marginBottom: "4px",
                  }}
                >
                  {detail.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.15rem",
                    fontWeight: 300,
                    color: "var(--cream-100)",
                    marginBottom: "2px",
                    lineHeight: 1.3,
                  }}
                >
                  {detail.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-crimson)",
                    fontSize: "0.8rem",
                    color: "rgba(247,238,223,0.55)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {detail.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gold ornament */}
        <div
          ref={(el) => { itemsRef.current[7] = el; }}
          className="reveal-item"
          style={{
            marginTop: "40px",
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "1rem",
            color: "rgba(212,168,83,0.5)",
            letterSpacing: "0.4em",
          }}
        >
          ✦ ✦ ✦
        </div>
      </div>
    </section>
  );
}
