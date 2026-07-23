"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  SEQ1_TOTAL,
  SEQ2_TOTAL,
  SEQ3_TOTAL,
  SEQ4_TOTAL,
  SEQ5_TOTAL,
  SEQ6_TOTAL,
  TOTAL_FRAMES,
  SEQ1_SCROLL_HEIGHT,
  SEQ2_SCROLL_HEIGHT,
  SEQ3_SCROLL_HEIGHT,
  SEQ4_SCROLL_HEIGHT,
  SEQ5_SCROLL_HEIGHT,
  SEQ6_SCROLL_HEIGHT,
  HERO_PIN_SCROLL_HEIGHT,
  SEQ2_PIN_SCROLL_HEIGHT,
  SEQ3_PIN_SCROLL_HEIGHT,
  SEQ4_PIN_SCROLL_HEIGHT,
  SEQ5_PIN_SCROLL_HEIGHT,
  SEQ6_PIN_SCROLL_HEIGHT,
  PX_PER_FRAME,
  getFrameUrl,
  preloadBatch,
  clamp,
} from "@/lib/frameUtils";

interface SequencePlayerProps {
  onHeroPhaseChange?: (inHeroPhase: boolean, progress: number, fadeOut?: number) => void;
  onSeq2PinChange?: (inPinPhase: boolean, progress: number, fadeOut?: number) => void;
  onSeq3PinChange?: (inPinPhase: boolean, progress: number, fadeOut?: number) => void;
  onSeq4PinChange?: (inPinPhase: boolean, progress: number, fadeOut?: number) => void;
  onSeq5PinChange?: (inPinPhase: boolean, progress: number, fadeOut?: number) => void;
  onSeq6PinChange?: (inPinPhase: boolean, progress: number, fadeOut?: number) => void;
  onSeq2Complete?: () => void;
}

const BATCH_SIZE = 30;
const PRIORITY_PRELOAD = 80; // preload first N frames immediately

export default function SequencePlayer({
  onHeroPhaseChange,
  onSeq2PinChange,
  onSeq3PinChange,
  onSeq4PinChange,
  onSeq5PinChange,
  onSeq6PinChange,
  onSeq2Complete,
}: SequencePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCache = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );
  const currentFrameRef = useRef(0);
  const isDrawingRef = useRef(false);
  const seq2CompleteCalledRef = useRef(false);
  const lastHeroProgressRef = useRef(-1);
  const preloadQueueRef = useRef(0); // tracks how far background preload has gone

  // ─── Draw a single frame to canvas ───────────────────────────────────────
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = imageCache.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    if (isDrawingRef.current) return;
    isDrawingRef.current = true;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      isDrawingRef.current = false;
      return;
    }

    // canvas.width/height are physical pixels (logical * dpr)
    // We draw directly in physical space — no transform needed
    const pw = canvas.width;   // physical width
    const ph = canvas.height;  // physical height
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover-fit: scale so image fills the physical canvas completely
    const scale = Math.max(pw / iw, ph / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (pw - dw) / 2;
    const dy = (ph - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
    isDrawingRef.current = false;
  }, []);

  // ─── Resize canvas to device pixel ratio ─────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const logicalW = window.innerWidth;
    const logicalH = window.innerHeight;

    // Physical buffer = logical * dpr for crisp rendering
    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;

    // CSS size stays at 100% of viewport — no stretching or cutoff
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // Redraw current frame after resize
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // ─── Background preloader: load all frames in batches ────────────────────
  const backgroundPreload = useCallback(() => {
    const startIdx = preloadQueueRef.current;
    if (startIdx >= TOTAL_FRAMES) return;

    preloadBatch(imageCache.current, startIdx, BATCH_SIZE);
    preloadQueueRef.current = startIdx + BATCH_SIZE;

    // Schedule next batch after a short delay to avoid blocking
    setTimeout(() => backgroundPreload(), 80);
  }, []);

  // ─── Initialize: load first frame immediately, then priority batch ────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    resizeCanvas();

    // Load frame 0 (seq1 frame 1) immediately
    const firstImg = new Image();
    firstImg.decoding = "sync";
    firstImg.src = getFrameUrl(0);
    imageCache.current[0] = firstImg;

    const onLoad = () => {
      drawFrame(0);
      // After first frame drawn, preload priority batch
      preloadBatch(imageCache.current, 1, PRIORITY_PRELOAD);
      preloadQueueRef.current = PRIORITY_PRELOAD + 1;
      // Then start background preload after a small delay
      setTimeout(() => backgroundPreload(), 500);
    };

    if (firstImg.complete) {
      onLoad();
    } else {
      firstImg.onload = onLoad;
    }

    // Resize observer
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(document.documentElement);

    return () => ro.disconnect();
  }, [resizeCanvas, drawFrame, backgroundPreload]);

  // ─── Scroll-driven frame updates ─────────────────────────────────────────
  useEffect(() => {
    let rafId: number;
    let targetFrame = 0;

    // Precompute phase boundaries
    const SEQ1_END = SEQ1_SCROLL_HEIGHT; // 3840px
    const SEQ2_START = SEQ1_END + HERO_PIN_SCROLL_HEIGHT; // 3840px (HERO_PIN = 0)
    const SEQ2_END = SEQ2_START + SEQ2_SCROLL_HEIGHT; // 7064px
    const SEQ2_PIN_END = SEQ2_END + SEQ2_PIN_SCROLL_HEIGHT; // 8864px
    const SEQ3_START = SEQ2_PIN_END; // 8864px
    const SEQ3_END = SEQ3_START + SEQ3_SCROLL_HEIGHT; // 10944px
    const SEQ3_PIN_END = SEQ3_END + SEQ3_PIN_SCROLL_HEIGHT; // 13344px
    const SEQ4_START = SEQ3_PIN_END; // 13344px
    const SEQ4_END = SEQ4_START + SEQ4_SCROLL_HEIGHT; // 17184px
    const SEQ4_PIN_END = SEQ4_END + SEQ4_PIN_SCROLL_HEIGHT; // 19584px
    const SEQ5_START = SEQ4_PIN_END; // 19584px
    const SEQ5_END = SEQ5_START + SEQ5_SCROLL_HEIGHT; // 21488px
    const SEQ5_PIN_END = SEQ5_END + SEQ5_PIN_SCROLL_HEIGHT; // 24288px
    const SEQ6_START = SEQ5_PIN_END; // 24288px
    const SEQ6_END = SEQ6_START + SEQ6_SCROLL_HEIGHT; // 26448px
    const SEQ6_PIN_END = SEQ6_END + SEQ6_PIN_SCROLL_HEIGHT; // 29648px

    // Hero text starts appearing at frame 300 of seq1 (2400px)
    const HERO_REVEAL_FRAME = 300;
    const HERO_REVEAL_SCROLL = HERO_REVEAL_FRAME * PX_PER_FRAME; // 2400px
    const HERO_REVEAL_TOTAL = SEQ1_END - HERO_REVEAL_SCROLL; // 1440px (reaches 100% at frame 480)

    function updateFromScroll() {
      const scrollY = window.scrollY;

      if (scrollY < HERO_REVEAL_SCROLL) {
        // ── Phase 1a: Sequence 1 before frame 300 — no hero text
        const frame = clamp(
          Math.floor(scrollY / PX_PER_FRAME),
          0,
          SEQ1_TOTAL - 1
        );
        targetFrame = frame;
        if (onHeroPhaseChange) onHeroPhaseChange(false, 0, 0);
        if (onSeq2PinChange) onSeq2PinChange(false, 0);
        if (onSeq3PinChange) onSeq3PinChange(false, 0);
        if (onSeq4PinChange) onSeq4PinChange(false, 0);
        if (onSeq5PinChange) onSeq5PinChange(false, 0);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

      } else if (scrollY < SEQ1_END) {
        // ── Phase 1b: Sequence 1 frames 300→480 — hero text completely reveals before frame 480
        const frame = clamp(
          Math.floor(scrollY / PX_PER_FRAME),
          0,
          SEQ1_TOTAL - 1
        );
        targetFrame = frame;
        const heroProgress = (scrollY - HERO_REVEAL_SCROLL) / HERO_REVEAL_TOTAL;
        if (onHeroPhaseChange) onHeroPhaseChange(true, clamp(heroProgress, 0, 1), 1);
        if (onSeq2PinChange) onSeq2PinChange(false, 0);
        if (onSeq3PinChange) onSeq3PinChange(false, 0);
        if (onSeq4PinChange) onSeq4PinChange(false, 0);
        if (onSeq5PinChange) onSeq5PinChange(false, 0);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

      } else if (scrollY < SEQ2_END) {
        // ── Phase 2: Sequence 2 scrubbing — starts IMMEDIATELY after Seq 1 final frame!
        const seq2Scroll = scrollY - SEQ2_START;
        const seq2Frame = clamp(
          Math.floor(seq2Scroll / PX_PER_FRAME),
          0,
          SEQ2_TOTAL - 1
        );
        targetFrame = SEQ1_TOTAL + seq2Frame;

        // Hero text fade out: stays visible for first 300px of Seq 2 (~38 frames), then smoothly fades out
        let heroFadeOut = 1;
        if (seq2Scroll > 300) {
          heroFadeOut = clamp(1 - (seq2Scroll - 300) / 400, 0, 1);
        }

        if (onHeroPhaseChange) {
          onHeroPhaseChange(heroFadeOut > 0, 1, heroFadeOut);
        }
        if (onSeq2PinChange) onSeq2PinChange(false, 0);
        if (onSeq3PinChange) onSeq3PinChange(false, 0);
        if (onSeq4PinChange) onSeq4PinChange(false, 0);
        if (onSeq5PinChange) onSeq5PinChange(false, 0);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

        // Proactively preload ahead
        const preloadAhead = Math.min(targetFrame + 40, TOTAL_FRAMES - 1);
        if (!imageCache.current[preloadAhead]) {
          preloadBatch(imageCache.current, targetFrame, 40);
        }

      } else if (scrollY < SEQ2_PIN_END) {
        // ── Phase 3: Sequence 2 PIN phase — hold final frame of sequence 2 (frame 882) & reveal minimal details
        targetFrame = SEQ1_TOTAL + SEQ2_TOTAL - 1; // 882
        const pinProgress = (scrollY - SEQ2_END) / SEQ2_PIN_SCROLL_HEIGHT;
        if (onHeroPhaseChange) onHeroPhaseChange(false, 1, 0);
        if (onSeq2PinChange) onSeq2PinChange(true, clamp(pinProgress, 0, 1), 1);
        if (onSeq3PinChange) onSeq3PinChange(false, 0);
        if (onSeq4PinChange) onSeq4PinChange(false, 0);
        if (onSeq5PinChange) onSeq5PinChange(false, 0);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

      } else if (scrollY < SEQ3_END) {
        // ── Phase 4: Sequence 3 scrubbing — frames 883 -> 1142
        const seq3Scroll = scrollY - SEQ3_START;
        const seq3Frame = clamp(
          Math.floor(seq3Scroll / PX_PER_FRAME),
          0,
          SEQ3_TOTAL - 1
        );
        targetFrame = SEQ1_TOTAL + SEQ2_TOTAL + seq3Frame;

        // Seq2 overlay fade out: stays 100% visible for first 400px of Seq 3 (~50 frames), then slowly fades out 400px -> 900px
        let seq2FadeOut = 1;
        if (seq3Scroll > 400) {
          seq2FadeOut = clamp(1 - (seq3Scroll - 400) / 500, 0, 1);
        }

        if (onHeroPhaseChange) onHeroPhaseChange(false, 1, 0);
        if (onSeq2PinChange) onSeq2PinChange(seq2FadeOut > 0, 1, seq2FadeOut);
        if (onSeq3PinChange) onSeq3PinChange(false, 0);
        if (onSeq4PinChange) onSeq4PinChange(false, 0);
        if (onSeq5PinChange) onSeq5PinChange(false, 0);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

        // Proactively preload ahead
        const preloadAhead = Math.min(targetFrame + 40, TOTAL_FRAMES - 1);
        if (!imageCache.current[preloadAhead]) {
          preloadBatch(imageCache.current, targetFrame, 40);
        }

      } else if (scrollY < SEQ3_PIN_END) {
        // ── Phase 5: Sequence 3 PIN phase — hold final frame of sequence 3 (frame 1142) & reveal Our Story
        targetFrame = SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL - 1; // 1142
        const pinProgress3 = (scrollY - SEQ3_END) / SEQ3_PIN_SCROLL_HEIGHT;
        if (onHeroPhaseChange) onHeroPhaseChange(false, 1, 0);
        if (onSeq2PinChange) onSeq2PinChange(false, 1);
        if (onSeq3PinChange) onSeq3PinChange(true, clamp(pinProgress3, 0, 1), 1);
        if (onSeq4PinChange) onSeq4PinChange(false, 0);
        if (onSeq5PinChange) onSeq5PinChange(false, 0);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

      } else if (scrollY < SEQ4_END) {
        // ── Phase 6: Sequence 4 scrubbing — frames 1143 -> 1622
        const seq4Scroll = scrollY - SEQ3_PIN_END;
        const seq4Frame = clamp(
          Math.floor(seq4Scroll / PX_PER_FRAME),
          0,
          SEQ4_TOTAL - 1
        );
        targetFrame = SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL + seq4Frame;

        // Seq3 overlay fade out: stays 100% visible for first 400px of Seq 4 (~50 frames), then slowly fades out 400px -> 900px
        let seq3FadeOut = 1;
        if (seq4Scroll > 400) {
          seq3FadeOut = clamp(1 - (seq4Scroll - 400) / 500, 0, 1);
        }

        // Couple overlay starts appearing at frame 360 of Sequence 4 (2880px scroll into Seq 4)
        const SEQ4_REVEAL_SCROLL = 360 * PX_PER_FRAME; // 2880px
        const SEQ4_REVEAL_TOTAL = SEQ4_SCROLL_HEIGHT - SEQ4_REVEAL_SCROLL; // 960px

        let seq4Progress = 0;
        let isSeq4Visible = false;
        if (seq4Scroll >= SEQ4_REVEAL_SCROLL) {
          isSeq4Visible = true;
          seq4Progress = clamp((seq4Scroll - SEQ4_REVEAL_SCROLL) / SEQ4_REVEAL_TOTAL, 0, 1);
        }

        if (onHeroPhaseChange) onHeroPhaseChange(false, 1, 0);
        if (onSeq2PinChange) onSeq2PinChange(false, 1);
        if (onSeq3PinChange) onSeq3PinChange(seq3FadeOut > 0, 1, seq3FadeOut);
        if (onSeq4PinChange) onSeq4PinChange(isSeq4Visible, seq4Progress, 1);
        if (onSeq5PinChange) onSeq5PinChange(false, 0);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

        // Proactively preload ahead
        const preloadAhead = Math.min(targetFrame + 40, TOTAL_FRAMES - 1);
        if (!imageCache.current[preloadAhead]) {
          preloadBatch(imageCache.current, targetFrame, 40);
        }

      } else if (scrollY < SEQ4_PIN_END) {
        // ── Phase 7: Sequence 4 PIN phase — hold final frame of sequence 4 (frame 1622) & keep Couple & Parents overlay 100% visible
        targetFrame = SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL + SEQ4_TOTAL - 1; // 1622
        const pinProgress4 = (scrollY - SEQ4_END) / SEQ4_PIN_SCROLL_HEIGHT;
        if (onHeroPhaseChange) onHeroPhaseChange(false, 1, 0);
        if (onSeq2PinChange) onSeq2PinChange(false, 1);
        if (onSeq3PinChange) onSeq3PinChange(false, 1);
        if (onSeq4PinChange) onSeq4PinChange(true, clamp(pinProgress4, 0, 1), 1);
        if (onSeq5PinChange) onSeq5PinChange(false, 0);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

      } else if (scrollY < SEQ5_END) {
        // ── Phase 8: Sequence 5 scrubbing — frames 1623 -> 1860
        const seq5Scroll = scrollY - SEQ5_START;
        const seq5Frame = clamp(
          Math.floor(seq5Scroll / PX_PER_FRAME),
          0,
          SEQ5_TOTAL - 1
        );
        targetFrame = SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL + SEQ4_TOTAL + seq5Frame;

        // Seq4 overlay fade out: stays visible for first 400px of Seq 5, then slowly fades out 400px -> 900px
        let seq4FadeOut = 1;
        if (seq5Scroll > 400) {
          seq4FadeOut = clamp(1 - (seq5Scroll - 400) / 500, 0, 1);
        }

        if (onHeroPhaseChange) onHeroPhaseChange(false, 1, 0);
        if (onSeq2PinChange) onSeq2PinChange(false, 1);
        if (onSeq3PinChange) onSeq3PinChange(false, 1);
        if (onSeq4PinChange) onSeq4PinChange(seq4FadeOut > 0, 1, seq4FadeOut);
        if (onSeq5PinChange) onSeq5PinChange(false, 0);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

        // Proactively preload ahead
        const preloadAhead = Math.min(targetFrame + 40, TOTAL_FRAMES - 1);
        if (!imageCache.current[preloadAhead]) {
          preloadBatch(imageCache.current, targetFrame, 40);
        }

      } else if (scrollY < SEQ5_PIN_END) {
        // ── Phase 9: Sequence 5 PIN phase — hold final frame of sequence 5 (frame 1860) & reveal Wedding Countdown
        targetFrame = SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL + SEQ4_TOTAL + SEQ5_TOTAL - 1; // 1860
        const pinProgress5 = (scrollY - SEQ5_END) / SEQ5_PIN_SCROLL_HEIGHT;
        if (onHeroPhaseChange) onHeroPhaseChange(false, 1, 0);
        if (onSeq2PinChange) onSeq2PinChange(false, 1);
        if (onSeq3PinChange) onSeq3PinChange(false, 1);
        if (onSeq4PinChange) onSeq4PinChange(false, 1);
        if (onSeq5PinChange) onSeq5PinChange(true, clamp(pinProgress5, 0, 1), 1);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

      } else if (scrollY < SEQ6_END) {
        // ── Phase 10: Sequence 6 scrubbing — frames 1861 -> 2130
        const seq6Scroll = scrollY - SEQ6_START;
        const seq6Frame = clamp(
          Math.floor(seq6Scroll / PX_PER_FRAME),
          0,
          SEQ6_TOTAL - 1
        );
        targetFrame =
          SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL + SEQ4_TOTAL + SEQ5_TOTAL + seq6Frame;

        // Seq5 overlay fade out: stays visible for first 400px of Seq 6, then slowly fades out 400px -> 900px
        let seq5FadeOut = 1;
        if (seq6Scroll > 400) {
          seq5FadeOut = clamp(1 - (seq6Scroll - 400) / 500, 0, 1);
        }

        if (onHeroPhaseChange) onHeroPhaseChange(false, 1, 0);
        if (onSeq2PinChange) onSeq2PinChange(false, 1);
        if (onSeq3PinChange) onSeq3PinChange(false, 1);
        if (onSeq4PinChange) onSeq4PinChange(false, 1);
        if (onSeq5PinChange) onSeq5PinChange(seq5FadeOut > 0, 1, seq5FadeOut);
        if (onSeq6PinChange) onSeq6PinChange(false, 0);

        // Proactively preload ahead
        const preloadAhead = Math.min(targetFrame + 40, TOTAL_FRAMES - 1);
        if (!imageCache.current[preloadAhead]) {
          preloadBatch(imageCache.current, targetFrame, 40);
        }

      } else if (scrollY < SEQ6_PIN_END) {
        // ── Phase 11: Sequence 6 PIN phase — hold final frame of sequence 6 (frame 2130) & reveal Location Map
        targetFrame = TOTAL_FRAMES - 1; // 2130
        const pinProgress6 = (scrollY - SEQ6_END) / SEQ6_PIN_SCROLL_HEIGHT;
        if (onHeroPhaseChange) onHeroPhaseChange(false, 1, 0);
        if (onSeq2PinChange) onSeq2PinChange(false, 1);
        if (onSeq3PinChange) onSeq3PinChange(false, 1);
        if (onSeq4PinChange) onSeq4PinChange(false, 1);
        if (onSeq5PinChange) onSeq5PinChange(false, 1);
        if (onSeq6PinChange) onSeq6PinChange(true, clamp(pinProgress6, 0, 1), 1);

      } else {
        // ── Phase 12: Past sequence 6 pin — hold final frame as resting backdrop
        targetFrame = TOTAL_FRAMES - 1;
        if (onHeroPhaseChange) onHeroPhaseChange(false, 1, 0);
        if (onSeq2PinChange) onSeq2PinChange(false, 1);
        if (onSeq3PinChange) onSeq3PinChange(false, 1);
        if (onSeq4PinChange) onSeq4PinChange(false, 1);
        if (onSeq5PinChange) onSeq5PinChange(false, 1);
        if (onSeq6PinChange) onSeq6PinChange(false, 1);
        if (!seq2CompleteCalledRef.current) {
          seq2CompleteCalledRef.current = true;
          if (onSeq2Complete) onSeq2Complete();
        }
      }

      // Draw if frame changed
      if (targetFrame !== currentFrameRef.current) {
        currentFrameRef.current = targetFrame;
        drawFrame(targetFrame);

        // If the target image isn't loaded yet, wait for it
        const img = imageCache.current[targetFrame];
        if (img && !img.complete) {
          img.onload = () => drawFrame(targetFrame);
        }
      }
    }

    // Use passive scroll listener for performance
    window.addEventListener("scroll", updateFromScroll, { passive: true });

    // RAF loop to ensure smoothness even without scroll events
    function rafLoop() {
      drawFrame(currentFrameRef.current);
      rafId = requestAnimationFrame(rafLoop);
    }
    rafId = requestAnimationFrame(rafLoop);

    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      cancelAnimationFrame(rafId);
    };
  }, [drawFrame, onHeroPhaseChange, onSeq2PinChange, onSeq3PinChange, onSeq4PinChange, onSeq2Complete]);

  return (
    <canvas
      ref={canvasRef}
      id="cinema-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}
