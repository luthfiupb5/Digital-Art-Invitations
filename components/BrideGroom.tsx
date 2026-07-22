"use client";

import { useEffect, useRef } from "react";

export default function BrideGroom() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("visible");
            observer.unobserve(el);
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
      aria-label="Bride and Groom"
      style={{
        background: "linear-gradient(160deg, #1a0d12 0%, #2e1220 50%, #150a10 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blush glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 75% 55% at 50% 25%, rgba(180,60,100,0.10) 0%, transparent 70%)",
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
          gap: "0",
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
            marginBottom: "28px",
          }}
        >
          ✦ The Couple ✦
        </div>

        {/* Bride */}
        <div
          ref={(el) => { itemsRef.current[1] = el; }}
          className="reveal-item glass-panel"
          style={{
            width: "100%",
            maxWidth: "380px",
            padding: "32px 24px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          {/* Illustrated portrait placeholder with initials */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(232,184,168,0.3) 0%, rgba(143,168,143,0.15) 100%)",
              border: "1px solid rgba(212,168,83,0.3)",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "rgba(212,168,83,0.8)",
            }}
          >
            P
          </div>
          <div
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "2rem",
              fontWeight: 300,
              color: "var(--cream-100)",
              marginBottom: "6px",
            }}
          >
            Priya Sharma
          </div>
          <div
            style={{
              fontFamily: "var(--font-crimson)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(212,168,83,0.6)",
              marginBottom: "16px",
            }}
          >
            The Bride
          </div>
          <div className="divider-gold" style={{ marginBottom: "16px" }} />
          <p
            className="body-elegant"
            style={{ fontSize: "0.95rem", textAlign: "center" }}
          >
            A dreamer with a gentle heart, she brings warmth and grace to
            every room she enters. She has always believed that love is
            the most beautiful art form.
          </p>
        </div>

        {/* Central ornament */}
        <div
          ref={(el) => { itemsRef.current[2] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "2.2rem",
            color: "rgba(212,168,83,0.7)",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          &amp;
        </div>

        {/* Groom */}
        <div
          ref={(el) => { itemsRef.current[3] = el; }}
          className="reveal-item glass-panel"
          style={{
            width: "100%",
            maxWidth: "380px",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(109,143,109,0.25) 0%, rgba(30,52,32,0.2) 100%)",
              border: "1px solid rgba(212,168,83,0.3)",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "rgba(212,168,83,0.8)",
            }}
          >
            A
          </div>
          <div
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "2rem",
              fontWeight: 300,
              color: "var(--cream-100)",
              marginBottom: "6px",
            }}
          >
            Arjun Mehta
          </div>
          <div
            style={{
              fontFamily: "var(--font-crimson)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(212,168,83,0.6)",
              marginBottom: "16px",
            }}
          >
            The Groom
          </div>
          <div className="divider-gold" style={{ marginBottom: "16px" }} />
          <p
            className="body-elegant"
            style={{ fontSize: "0.95rem", textAlign: "center" }}
          >
            Steady, thoughtful, and deeply kind — he found in Priya not just
            a partner, but the quiet place where his soul finally felt at home.
          </p>
        </div>
      </div>
    </section>
  );
}
