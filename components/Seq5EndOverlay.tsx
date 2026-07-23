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
      const gradOpacity = Math.min(progress / 0.15, 1);
      skyGradRef.current.style.opacity = String(gradOpacity);
    }
    if (contentRef.current) {
      const contentOpacity = Math.min(Math.max(0, (progress - 0.03) / 0.15), 1);
      contentRef.current.style.opacity = String(contentOpacity);
      contentRef.current.style.transform = `translateY(${(1 - contentOpacity) * 16}px)`;
    }
  }, [progress]);

  // ── 3. Initialize Scratch Canvas ─────────────────────────────────────────
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth || 340;
    const height = canvas.offsetHeight || 90;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Soft champagne gold foil cover
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#e8d098");
    grad.addColorStop(0.5, "#fbf3d5");
    grad.addColorStop(1, "#cfa244");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle grain texture
    ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
    for (let i = 0; i < 300; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Border line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(5, 5, width - 10, height - 10);

    // Scratch guidance text
    ctx.fillStyle = "#3d2b0f";
    ctx.font = "normal 500 12px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ Drag or Hold to Reveal Countdown ✦", width / 2, height / 2 + 4);
  }, []);

  useEffect(() => {
    initCanvas();
    window.addEventListener("resize", initCanvas);
    return () => window.removeEventListener("resize", initCanvas);
  }, [initCanvas]);

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
      if (clearPixels / totalSampled > 0.25) {
        setIsRevealed(true);
      }
    } catch {
      // Fallback
    }
  }, [isRevealed]);

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
      ctx.arc(x, y, 22, 0, Math.PI * 2, false);
      ctx.fill();

      checkScratchPercentage();
    },
    [isRevealed, checkScratchPercentage]
  );

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

  // ── 4. Hold to Reveal Action ───────────────────────────────────────────────
  const startHold = () => {
    if (isRevealed) return;
    let curr = 0;
    holdIntervalRef.current = setInterval(() => {
      curr += 5;
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
        paddingTop: "clamp(65px, 11vh, 105px)",
        paddingLeft: "24px",
        paddingRight: "24px",
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* ── Soft White Sky Gradient Fade (Matches Seq2/3/4 overlays) ───────── */}
      <div
        ref={skyGradRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "85%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          zIndex: -1,
          opacity: 0,
        }}
      />

      {/* ── Main Minimal Content Container ─────────────────────────────────── */}
      <div
        ref={contentRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "460px",
          width: "100%",
          opacity: 0,
          transform: "translateY(16px)",
          transition: "transform 0.4s ease, opacity 0.4s ease",
        }}
      >
        {/* Minimal Tag */}
        <div
          style={{
            fontFamily: "var(--font-crimson)",
            fontSize: "0.62rem",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "#b5831e",
            marginBottom: "20px",
          }}
        >
          ✦ Save The Date ✦
        </div>

        {/* ── Wedding Details (Box-Free, Minimal, Icon Line Art) ──────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          {/* Date */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b5831e"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(1.5rem, 5.5vw, 2.1rem)",
                color: "#1f1816",
                letterSpacing: "0.02em",
                lineHeight: 1.1,
              }}
            >
              Saturday, 14th February 2026
            </span>
          </div>

          {/* Time */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b5831e"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "0.82rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#4a3b32",
              }}
            >
              11:00 AM Onwards
            </span>
          </div>

          {/* Venue */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b5831e"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-crimson)",
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8c6517",
              }}
            >
              The Grand Palace Garden, Mumbai
            </span>
          </div>
        </div>

        {/* Minimal Divider */}
        <div
          style={{
            width: "50px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(181,131,30,0.7), transparent)",
            marginBottom: "24px",
          }}
        />

        {/* ── Interactive Countdown (Box-Free, Minimal Serif Typography) ──── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "360px",
            minHeight: "90px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Floating Minimal Numbers */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "18px",
              width: "100%",
            }}
          >
            {[
              { label: "Days", val: timeLeft.days },
              { label: "Hours", val: timeLeft.hours },
              { label: "Mins", val: timeLeft.minutes },
              { label: "Secs", val: timeLeft.seconds },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
                      fontWeight: 400,
                      color: "#1f1816",
                      lineHeight: 1,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {String(item.val).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-crimson)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "#8c6517",
                      marginTop: "4px",
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                {i < 3 && (
                  <div
                    style={{
                      width: "1px",
                      height: "22px",
                      background: "rgba(181,131,30,0.3)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Seamless Interactive Scratch Canvas */}
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
              transition: "opacity 0.6s ease",
              borderRadius: "8px",
            }}
          />
        </div>

        {/* ── Minimal Hold / Tap Button ────────────────────────────────────── */}
        {!isRevealed && (
          <div style={{ marginTop: "18px" }}>
            <button
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              onClick={() => setIsRevealed(true)}
              style={{
                position: "relative",
                background: "rgba(255, 255, 255, 0.8)",
                color: "#5e4514",
                border: "1px solid rgba(181, 131, 30, 0.4)",
                borderRadius: "50px",
                padding: "8px 20px",
                fontFamily: "var(--font-crimson)",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: "pointer",
                overflow: "hidden",
                transition: "all 0.25s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${holdProgress}%`,
                  background: "rgba(212, 168, 83, 0.25)",
                  transition: "width 0.05s linear",
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>
                ✦ Hold / Tap to Reveal Countdown
              </span>
            </button>
          </div>
        )}

        {/* Minimal Scroll Indicator */}
        <div
          style={{
            marginTop: "auto",
            marginBottom: "max(4vh, 24px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "linear-gradient(to bottom, rgba(181,131,30,0.8), transparent)",
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
              color: "rgba(181,131,30,0.8)",
            }}
          >
            Scroll to view venue location
          </span>
        </div>
      </div>
    </div>
  );
}
