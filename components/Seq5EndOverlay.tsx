"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Seq5EndOverlayProps {
  isVisible: boolean;
  progress: number; // 0 -> 1 during seq5 pin phase
  fadeOut?: number;
}

const WEDDING_DATE = new Date("2026-02-14T11:00:00+05:30").getTime();

export default function Seq5EndOverlay({
  isVisible,
  progress,
  fadeOut = 1,
}: Seq5EndOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const skyGradRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRevealed, setIsRevealed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isScratchingRef = useRef(false);

  // ── 1. Live Countdown Calculation ───────────────────────────────────────
  useEffect(() => {
    function updateTimer() {
      const now = Date.now();
      const diff = Math.max(0, WEDDING_DATE - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── 2. Visibility & Opacity Handling ─────────────────────────────────────
  useEffect(() => {
    if (!overlayRef.current) return;
    const baseOpacity = isVisible ? 1 : 0;
    const finalOpacity = baseOpacity * fadeOut;
    overlayRef.current.style.opacity = String(finalOpacity);
    overlayRef.current.style.pointerEvents = finalOpacity > 0.1 ? "auto" : "none";
  }, [isVisible, fadeOut]);

  useEffect(() => {
    if (skyGradRef.current) {
      const gradOpacity = Math.min(progress / 0.12, 1);
      skyGradRef.current.style.opacity = String(gradOpacity);
    }
    if (contentRef.current) {
      const contentOpacity = Math.min(Math.max(0, (progress - 0.03) / 0.15), 1);
      contentRef.current.style.opacity = String(contentOpacity);
      contentRef.current.style.transform = `translateY(${(1 - contentOpacity) * 20}px)`;
    }
  }, [progress]);

  // ── 3. Initialize Scratch Canvas ─────────────────────────────────────────
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth || 360;
    const height = canvas.offsetHeight || 140;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Draw gold luxury foil cover
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#d4a853");
    grad.addColorStop(0.3, "#fbf3d5");
    grad.addColorStop(0.6, "#b5831e");
    grad.addColorStop(1, "#e6c374");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle texture noise / patterns
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Border inner line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // Scratch text guidance
    ctx.fillStyle = "#2c1d09";
    ctx.font = "italic 600 15px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ Scratch or Hold to Reveal Countdown ✨", width / 2, height / 2 + 5);
  }, []);

  useEffect(() => {
    initCanvas();
    window.addEventListener("resize", initCanvas);
    return () => window.removeEventListener("resize", initCanvas);
  }, [initCanvas]);

  // Check how much has been scratched
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let clearPixels = 0;
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) clearPixels++;
      }
      const totalSampled = pixels.length / 16;
      if (clearPixels / totalSampled > 0.28) {
        setIsRevealed(true);
      }
    } catch {
      // Fallback
    }
  }, [isRevealed]);

  // Scratch action handler
  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealed) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2, false);
      ctx.fill();

      checkScratchPercentage();
    },
    [isRevealed, checkScratchPercentage]
  );

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    isScratchingRef.current = true;
    scratchAt(e.clientX, e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratchingRef.current) return;
    scratchAt(e.clientX, e.clientY);
  };
  const handleMouseUp = () => {
    isScratchingRef.current = false;
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      isScratchingRef.current = true;
      scratchAt(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScratchingRef.current || e.touches.length === 0) return;
    scratchAt(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchEnd = () => {
    isScratchingRef.current = false;
  };

  // ── 4. Hold to Reveal Wax Seal ───────────────────────────────────────────
  const startHold = () => {
    if (isRevealed) return;
    let curr = 0;
    holdIntervalRef.current = setInterval(() => {
      curr += 4;
      setHoldProgress(Math.min(curr, 100));
      if (curr >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setIsRevealed(true);
      }
    }, 30);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (!isRevealed) {
      setHoldProgress(0);
    }
  };

  return (
    <div
      ref={overlayRef}
      id="seq5-end-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "clamp(55px, 9vh, 90px)",
        paddingLeft: "20px",
        paddingRight: "20px",
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* ── Soft White / Dark Gold Atmosphere Gradient ──────────────────────── */}
      <div
        ref={skyGradRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "90%",
          background:
            "linear-gradient(to bottom, rgba(12,8,16,0.95) 0%, rgba(20,13,24,0.85) 60%, rgba(12,8,16,0) 100%)",
          pointerEvents: "none",
          zIndex: -1,
          opacity: 0,
        }}
      />

      {/* ── Main Content Container ─────────────────────────────────────────── */}
      <div
        ref={contentRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "480px",
          width: "100%",
          opacity: 0,
          transform: "translateY(20px)",
          transition: "transform 0.4s ease, opacity 0.4s ease",
        }}
      >
        {/* Top Tag */}
        <div
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.62rem",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "#d4a853",
            marginBottom: "10px",
          }}
        >
          ✦ Save The Date ✦
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(2.2rem, 7.5vw, 3.2rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "#f7eedf",
            margin: "0 0 16px 0",
          }}
        >
          Wedding Celebration &amp; Countdown
        </h2>

        {/* Gold Divider */}
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.8), transparent)",
            marginBottom: "20px",
          }}
        />

        {/* Wedding Key Details Card */}
        <div
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(212, 168, 83, 0.25)",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.2rem" }}>📅</span>
            <span
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.3rem",
                color: "#f7eedf",
                letterSpacing: "0.03em",
              }}
            >
              Saturday, 14th February 2026
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.1rem" }}>⏰</span>
            <span
              style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "0.95rem",
                color: "rgba(247, 238, 223, 0.85)",
                letterSpacing: "0.05em",
              }}
            >
              11:00 AM Onwards
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.1rem" }}>📍</span>
            <span
              style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "0.9rem",
                color: "rgba(212, 168, 83, 0.9)",
                letterSpacing: "0.04em",
              }}
            >
              The Grand Palace Garden, Marine Drive, Mumbai
            </span>
          </div>
        </div>

        {/* ── Interactive Countdown Container ────────────────────────────── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: "140px",
            background: "rgba(18, 12, 22, 0.75)",
            border: "1px solid rgba(212, 168, 83, 0.3)",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px 14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          {/* Live Countdown Display (Underneath) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
              width: "100%",
              maxWidth: "380px",
            }}
          >
            {[
              { label: "Days", val: timeLeft.days },
              { label: "Hours", val: timeLeft.hours },
              { label: "Mins", val: timeLeft.minutes },
              { label: "Secs", val: timeLeft.seconds },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(212, 168, 83, 0.08)",
                  border: "1px solid rgba(212, 168, 83, 0.25)",
                  borderRadius: "12px",
                  padding: "12px 6px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
                    fontWeight: 600,
                    color: "#fbf3d5",
                    lineHeight: 1,
                  }}
                >
                  {String(item.val).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-crimson)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(212, 168, 83, 0.8)",
                    marginTop: "6px",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Interactive Canvas Scratch Layer */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              cursor: "crosshair",
              touchAction: "none",
              opacity: isRevealed ? 0 : 1,
              pointerEvents: isRevealed ? "none" : "auto",
              transition: "opacity 0.7s ease",
              borderRadius: "16px",
            }}
          />
        </div>

        {/* ── Hold / Quick Reveal Seal Button ──────────────────────────────── */}
        {!isRevealed && (
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <button
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              onClick={() => setIsRevealed(true)}
              style={{
                position: "relative",
                background: "linear-gradient(135deg, #d4a853, #b5831e)",
                color: "#181006",
                border: "none",
                borderRadius: "50px",
                padding: "10px 24px",
                fontFamily: "var(--font-crimson)",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(212, 168, 83, 0.3)",
                overflow: "hidden",
                transition: "transform 0.2s ease, boxShadow 0.2s ease",
              }}
            >
              {/* Charge fill animation */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${holdProgress}%`,
                  background: "rgba(255, 255, 255, 0.4)",
                  transition: "width 0.05s linear",
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>
                ✨ Hold / Tap to Reveal Countdown
              </span>
            </button>
          </div>
        )}

        {/* Scroll indicator hint */}
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "24px",
              background: "linear-gradient(to bottom, rgba(212,168,83,0.8), transparent)",
              animation: "pulseLine5 2s ease-in-out infinite",
            }}
          />
          <style>{`
            @keyframes pulseLine5 {
              0%, 100% { opacity: 0.4; transform: scaleY(1); }
              50% { opacity: 1; transform: scaleY(1.1); }
            }
          `}</style>
          <span
            style={{
              fontFamily: "var(--font-crimson)",
              fontSize: "0.55rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(212,168,83,0.75)",
            }}
          >
            Scroll to view venue map &amp; location
          </span>
        </div>
      </div>
    </div>
  );
}
