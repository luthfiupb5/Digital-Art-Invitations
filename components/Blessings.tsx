"use client";

import { useEffect, useRef } from "react";

const BLESSINGS = [
  {
    text: "May your love be modern enough to survive the times, and old-fashioned enough to last forever.",
    attribution: "With all our love",
  },
  {
    text: "A great marriage is not when the perfect couple comes together, but when an imperfect couple learns to enjoy their differences.",
    attribution: "A blessing from the heart",
  },
  {
    text: "May your home be filled with the fragrance of flowers, the warmth of sunlight, and the music of laughter.",
    attribution: "In joy and prayer",
  },
];

export default function Blessings() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const goTo = (index: number) => {
    if (!carouselRef.current) return;
    const children = carouselRef.current.querySelectorAll(".blessing-card");
    children.forEach((el, i) => {
      const card = el as HTMLElement;
      card.style.opacity = i === index ? "1" : "0";
      card.style.transform = i === index ? "translateY(0)" : "translateY(10px)";
    });
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      dot.style.opacity = i === index ? "1" : "0.3";
      dot.style.transform = i === index ? "scaleX(2)" : "scaleX(1)";
    });
    currentRef.current = index;
  };

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
      el.style.transitionDelay = `${i * 0.15}s`;
      observer.observe(el);
    });

    // Auto-rotate blessings
    goTo(0);
    intervalRef.current = setInterval(() => {
      const next = (currentRef.current + 1) % BLESSINGS.length;
      goTo(next);
    }, 5000);

    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      className="content-section"
      aria-label="Blessings"
      style={{
        background: "linear-gradient(160deg, #0e0814 0%, #1c1025 50%, #090610 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Violet glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(120,60,200,0.09) 0%, transparent 70%)",
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
            marginBottom: "28px",
          }}
        >
          ✦ Blessings ✦
        </div>

        {/* Headline */}
        <div
          ref={(el) => { itemsRef.current[1] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(2rem, 8vw, 2.8rem)",
            fontWeight: 300,
            color: "var(--cream-100)",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "12px",
          }}
        >
          Words of Wisdom<br />&amp; Love
        </div>

        <div className="divider-gold" style={{ margin: "20px auto 40px" }} />

        {/* Blessings carousel */}
        <div
          ref={(el) => { itemsRef.current[2] = el; }}
          className="reveal-item"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <div
            ref={carouselRef}
            style={{ position: "relative", width: "100%" }}
          >
            {BLESSINGS.map((blessing, i) => (
              <div
                key={i}
                className="blessing-card glass-panel"
                style={{
                  padding: "36px 28px",
                  textAlign: "center",
                  opacity: 0,
                  transform: "translateY(10px)",
                  transition: "opacity 1s ease, transform 1s ease",
                  ...(i > 0 ? { position: "absolute", top: 0, left: 0, right: 0 } : {}),
                }}
              >
                {/* Opening quote */}
                <div
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "3rem",
                    color: "rgba(212,168,83,0.4)",
                    lineHeight: 0.8,
                    marginBottom: "16px",
                    fontStyle: "italic",
                  }}
                >
                  "
                </div>
                <p
                  className="body-elegant"
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.85,
                    marginBottom: "24px",
                    fontStyle: "italic",
                  }}
                >
                  {blessing.text}
                </p>
                <div
                  style={{
                    fontFamily: "var(--font-crimson)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(212,168,83,0.6)",
                  }}
                >
                  — {blessing.attribution}
                </div>
              </div>
            ))}
          </div>

          {/* Dots navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "250px",
            }}
          >
            {BLESSINGS.map((_, i) => (
              <button
                key={i}
                ref={(el) => { dotsRef.current[i] = el; }}
                onClick={() => {
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  goTo(i);
                  intervalRef.current = setInterval(() => {
                    const next = (currentRef.current + 1) % BLESSINGS.length;
                    goTo(next);
                  }, 5000);
                }}
                style={{
                  width: "20px",
                  height: "3px",
                  borderRadius: "2px",
                  background: "rgba(212,168,83,0.7)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  opacity: 0.3,
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  transformOrigin: "center",
                }}
                aria-label={`Blessing ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
