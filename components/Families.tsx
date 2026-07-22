"use client";

import { useEffect, useRef } from "react";

const FAMILIES = [
  {
    side: "Bride's Family",
    icon: "🌸",
    members: [
      { role: "Father of the Bride", name: "Rajesh Sharma" },
      { role: "Mother of the Bride", name: "Sunita Sharma" },
      { role: "Elder Brother", name: "Vikram Sharma" },
    ],
  },
  {
    side: "Groom's Family",
    icon: "🌿",
    members: [
      { role: "Father of the Groom", name: "Suresh Mehta" },
      { role: "Mother of the Groom", name: "Kavita Mehta" },
      { role: "Younger Sister", name: "Anjali Mehta" },
    ],
  },
];

export default function Families() {
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
      { threshold: 0.08 }
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
      aria-label="Our Families"
      style={{
        background: "linear-gradient(160deg, #081208 0%, #101f10 50%, #060f06 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Sage glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(70,140,70,0.09) 0%, transparent 70%)",
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
          ✦ Our Families ✦
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
            marginBottom: "10px",
          }}
        >
          Two Families,<br />One Heart
        </div>

        <div
          ref={(el) => { itemsRef.current[2] = el; }}
          className="reveal-item"
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.82rem",
            color: "rgba(247,238,223,0.55)",
            letterSpacing: "0.06em",
            textAlign: "center",
            marginBottom: "36px",
          }}
        >
          With the blessings of our beloved families
        </div>

        <div className="divider-gold" style={{ marginBottom: "36px" }} />

        {/* Family cards */}
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {FAMILIES.map((family, fi) => (
            <div
              key={family.side}
              ref={(el) => { itemsRef.current[3 + fi] = el; }}
              className="reveal-item glass-panel"
              style={{ padding: "28px 24px" }}
            >
              {/* Family header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "1.4rem" }}>{family.icon}</span>
                <div
                  style={{
                    fontFamily: "var(--font-crimson)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(212,168,83,0.8)",
                  }}
                >
                  {family.side}
                </div>
              </div>

              {/* Members */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {family.members.map((member) => (
                  <div
                    key={member.name}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      paddingBottom: "14px",
                      borderBottom: "1px solid rgba(212,168,83,0.1)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-crimson)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(212,168,83,0.55)",
                      }}
                    >
                      {member.role}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "1.2rem",
                        fontWeight: 300,
                        color: "var(--cream-100)",
                        fontStyle: "italic",
                      }}
                    >
                      {member.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
