"use client";

import { useEffect, useRef } from "react";

export default function VenueSection() {
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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
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
      aria-label="Venue"
      style={{
        background: "linear-gradient(160deg, #150e04 0%, #261a08 50%, #120c03 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Amber glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(200,140,30,0.10) 0%, transparent 70%)",
      }} />
      <div
        style={{
          minHeight: "120vh",
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
          ✦ The Venue ✦
        </div>

        {/* Venue name */}
        <div
          ref={(el) => { itemsRef.current[1] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(2.2rem, 9vw, 3rem)",
            fontWeight: 300,
            color: "var(--cream-100)",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "10px",
          }}
        >
          The Grand Palace Garden
        </div>

        <div
          ref={(el) => { itemsRef.current[2] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.78rem",
            color: "rgba(247,238,223,0.6)",
            letterSpacing: "0.1em",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Marine Drive, Mumbai, Maharashtra 400002
        </div>

        <div className="divider-gold" style={{ margin: "24px auto 28px" }} />

        {/* Map */}
        <div
          ref={(el) => { itemsRef.current[3] = el; }}
          className="reveal-item map-container"
          style={{ width: "100%", maxWidth: "400px", marginBottom: "20px" }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.8!2d72.8236!3d18.9439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c73a0c4de7%3A0x123456!2sMarine+Drive%2C+Mumbai!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Venue location — Marine Drive, Mumbai"
            style={{ filter: "sepia(0.35) saturate(0.6) brightness(0.85)" }}
          />
        </div>

        {/* Get directions button */}
        <div
          ref={(el) => { itemsRef.current[4] = el; }}
          className="reveal-item"
          style={{ marginBottom: "32px" }}
        >
          <a
            href="https://maps.google.com/?q=Marine+Drive+Mumbai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-crimson)",
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(212,168,83,0.85)",
              textDecoration: "none",
              border: "1px solid rgba(212,168,83,0.3)",
              borderRadius: "50px",
              padding: "10px 22px",
              background: "rgba(212,168,83,0.05)",
              transition: "all 0.3s ease",
            }}
          >
            <span>↗</span> Get Directions
          </a>
        </div>

        {/* Venue description */}
        <div
          ref={(el) => { itemsRef.current[5] = el; }}
          className="reveal-item glass-panel"
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "24px 28px",
            textAlign: "center",
          }}
        >
          <p className="body-elegant" style={{ fontSize: "0.95rem" }}>
            Set amidst sweeping ocean views and fragrant garden paths, The Grand
            Palace Garden has hosted love stories for over a century. Its
            manicured lawns and elegant pavilions create the perfect canvas for
            a celebration as timeless as theirs.
          </p>
        </div>
      </div>
    </section>
  );
}
