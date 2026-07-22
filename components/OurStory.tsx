"use client";

import { useEffect, useRef } from "react";

export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.15}s`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="content-section"
      aria-label="Our Story"
      style={{
        background: "linear-gradient(160deg, #1a0e0a 0%, #2d1a10 45%, #180c08 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative warm glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(180,90,40,0.12) 0%, transparent 70%)",
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
        {/* Section label */}
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
          ✦ Our Story ✦
        </div>

        {/* Headline */}
        <div
          ref={(el) => { itemsRef.current[1] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(2.2rem, 9vw, 3rem)",
            color: "var(--cream-100)",
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: "32px",
          }}
        >
          A Love Written<br />in the Stars
        </div>

        {/* Divider */}
        <div
          ref={(el) => { itemsRef.current[2] = el; }}
          className="reveal-item divider-gold"
          style={{ marginBottom: "32px" }}
        />

        {/* Story text */}
        <div
          ref={(el) => { itemsRef.current[3] = el; }}
          className="reveal-item glass-panel"
          style={{ padding: "32px 28px", maxWidth: "420px", width: "100%" }}
        >
          <p
            className="body-elegant"
            style={{
              textAlign: "center",
              fontSize: "1.05rem",
              lineHeight: 1.9,
              marginBottom: "20px",
            }}
          >
            Two souls from different worlds, drawn together by the quiet magic
            of an ordinary evening — a shared glance across a moonlit garden
            that changed everything.
          </p>
          <p
            className="body-elegant"
            style={{
              textAlign: "center",
              fontSize: "1.05rem",
              lineHeight: 1.9,
              marginBottom: "20px",
            }}
          >
            Through seasons of laughter, long conversations, and the gentle
            unfolding of trust, Fathima and Muhammed discovered what it means to
            truly belong — not to a place, but to each other.
          </p>
          <p
            className="body-elegant"
            style={{
              textAlign: "center",
              fontSize: "1.05rem",
              lineHeight: 1.9,
            }}
          >
            Today, they invite their dearest family and friends to witness as
            their story enters its most beautiful chapter.
          </p>
        </div>

        {/* Ornament */}
        <div
          ref={(el) => { itemsRef.current[4] = el; }}
          className="reveal-item ornament"
          style={{ marginTop: "36px", fontSize: "1.1rem", letterSpacing: "0.5em" }}
        >
          ✦ ✦ ✦
        </div>
      </div>
    </section>
  );
}
