"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  SEQ1_SCROLL_HEIGHT,
  SEQ2_SCROLL_HEIGHT,
  SEQ3_SCROLL_HEIGHT,
  SEQ4_SCROLL_HEIGHT,
  SEQ5_SCROLL_HEIGHT,
  SEQ6_SCROLL_HEIGHT,
  SEQ7_SCROLL_HEIGHT,
  HERO_PIN_SCROLL_HEIGHT,
  SEQ2_PIN_SCROLL_HEIGHT,
  SEQ3_PIN_SCROLL_HEIGHT,
  SEQ4_PIN_SCROLL_HEIGHT,
  SEQ5_PIN_SCROLL_HEIGHT,
  SEQ6_PIN_SCROLL_HEIGHT,
  SEQ7_PIN_SCROLL_HEIGHT,
} from "@/lib/frameUtils";

// Dynamic imports for code splitting
const SequencePlayer = dynamic(() => import("@/components/SequencePlayer"), {
  ssr: false,
});
const HeroOverlay = dynamic(() => import("@/components/HeroOverlay"), {
  ssr: false,
});
const Seq2EndOverlay = dynamic(() => import("@/components/Seq2EndOverlay"), {
  ssr: false,
});
const Seq3EndOverlay = dynamic(() => import("@/components/Seq3EndOverlay"), {
  ssr: false,
});
const Seq4EndOverlay = dynamic(() => import("@/components/Seq4EndOverlay"), {
  ssr: false,
});
const Seq5EndOverlay = dynamic(() => import("@/components/Seq5EndOverlay"), {
  ssr: false,
});
const Seq6EndOverlay = dynamic(() => import("@/components/Seq6EndOverlay"), {
  ssr: false,
});
const Seq7EndOverlay = dynamic(() => import("@/components/Seq7EndOverlay"), {
  ssr: false,
});
const AmbientLayer = dynamic(() => import("@/components/AmbientLayer"), {
  ssr: false,
});

// Total scroll heights
const SEQ1_H = SEQ1_SCROLL_HEIGHT;         // 3840px
const HERO_H = HERO_PIN_SCROLL_HEIGHT;     // 0px
const SEQ2_H = SEQ2_SCROLL_HEIGHT;         // 3224px
const SEQ2_PIN_H = SEQ2_PIN_SCROLL_HEIGHT; // 1800px
const SEQ3_H = SEQ3_SCROLL_HEIGHT;         // 2080px
const SEQ3_PIN_H = SEQ3_PIN_SCROLL_HEIGHT; // 2400px
const SEQ4_H = SEQ4_SCROLL_HEIGHT;         // 3840px
const SEQ4_PIN_H = SEQ4_PIN_SCROLL_HEIGHT; // 2400px
const SEQ5_H = SEQ5_SCROLL_HEIGHT;         // 1904px
const SEQ5_PIN_H = SEQ5_PIN_SCROLL_HEIGHT; // 2800px
const SEQ6_H = SEQ6_SCROLL_HEIGHT;         // 2160px
const SEQ6_PIN_H = SEQ6_PIN_SCROLL_HEIGHT; // 3200px
const SEQ7_H = SEQ7_SCROLL_HEIGHT;         // 1952px
const SEQ7_PIN_H = SEQ7_PIN_SCROLL_HEIGHT; // 3200px

export default function Home() {
  const [heroPhase, setHeroPhase] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [heroFadeOut, setHeroFadeOut] = useState(1);
  const [seq2PinPhase, setSeq2PinPhase] = useState(false);
  const [seq2PinProgress, setSeq2PinProgress] = useState(0);
  const [seq2FadeOut, setSeq2FadeOut] = useState(1);
  const [seq3PinPhase, setSeq3PinPhase] = useState(false);
  const [seq3PinProgress, setSeq3PinProgress] = useState(0);
  const [seq3FadeOut, setSeq3FadeOut] = useState(1);
  const [seq4PinPhase, setSeq4PinPhase] = useState(false);
  const [seq4PinProgress, setSeq4PinProgress] = useState(0);
  const [seq4FadeOut, setSeq4FadeOut] = useState(1);
  const [seq5PinPhase, setSeq5PinPhase] = useState(false);
  const [seq5PinProgress, setSeq5PinProgress] = useState(0);
  const [seq5FadeOut, setSeq5FadeOut] = useState(1);
  const [seq6PinPhase, setSeq6PinPhase] = useState(false);
  const [seq6PinProgress, setSeq6PinProgress] = useState(0);
  const [seq6FadeOut, setSeq6FadeOut] = useState(1);
  const [seq7PinPhase, setSeq7PinPhase] = useState(false);
  const [seq7PinProgress, setSeq7PinProgress] = useState(0);
  const [seq7FadeOut, setSeq7FadeOut] = useState(1);

  const handleHeroPhaseChange = useCallback(
    (inHeroPhase: boolean, progress: number, fadeOut: number = 1) => {
      setHeroPhase(inHeroPhase);
      setHeroProgress(progress);
      setHeroFadeOut(fadeOut);
    },
    []
  );

  const handleSeq2PinChange = useCallback(
    (inPinPhase: boolean, progress: number, fadeOut: number = 1) => {
      setSeq2PinPhase(inPinPhase);
      setSeq2PinProgress(progress);
      setSeq2FadeOut(fadeOut);
    },
    []
  );

  const handleSeq3PinChange = useCallback(
    (inPinPhase: boolean, progress: number, fadeOut: number = 1) => {
      setSeq3PinPhase(inPinPhase);
      setSeq3PinProgress(progress);
      setSeq3FadeOut(fadeOut);
    },
    []
  );

  const handleSeq4PinChange = useCallback(
    (inPinPhase: boolean, progress: number, fadeOut: number = 1) => {
      setSeq4PinPhase(inPinPhase);
      setSeq4PinProgress(progress);
      setSeq4FadeOut(fadeOut);
    },
    []
  );

  const handleSeq5PinChange = useCallback(
    (inPinPhase: boolean, progress: number, fadeOut: number = 1) => {
      setSeq5PinPhase(inPinPhase);
      setSeq5PinProgress(progress);
      setSeq5FadeOut(fadeOut);
    },
    []
  );

  const handleSeq6PinChange = useCallback(
    (inPinPhase: boolean, progress: number, fadeOut: number = 1) => {
      setSeq6PinPhase(inPinPhase);
      setSeq6PinProgress(progress);
      setSeq6FadeOut(fadeOut);
    },
    []
  );

  const handleSeq7PinChange = useCallback(
    (inPinPhase: boolean, progress: number, fadeOut: number = 1) => {
      setSeq7PinPhase(inPinPhase);
      setSeq7PinProgress(progress);
      setSeq7FadeOut(fadeOut);
    },
    []
  );

  const handleSeq2Complete = useCallback(() => {}, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    let lenis: unknown = null;

    async function initLenis() {
      try {
        const { default: Lenis } = await import("lenis");
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        lenis = new Lenis({
          lerp: 0.08,
          smoothWheel: true,
          touchMultiplier: 1.4,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (lenis as any).on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time: number) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (lenis as any).raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } catch {
        try {
          const { default: Lenis } = await import("lenis");
          lenis = new Lenis({ lerp: 0.08, touchMultiplier: 1.4 });
          function raf(time: number) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (lenis as any).raf(time);
            requestAnimationFrame(raf);
          }
          requestAnimationFrame(raf);
        } catch { /* native scroll fallback */ }
      }
    }

    initLenis();
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (lenis) (lenis as any).destroy();
    };
  }, []);

  return (
    <>
      {/* ── Fixed Canvas (z:0) — renders all 2375 frames ─────────────── */}
      <SequencePlayer
        onHeroPhaseChange={handleHeroPhaseChange}
        onSeq2PinChange={handleSeq2PinChange}
        onSeq3PinChange={handleSeq3PinChange}
        onSeq4PinChange={handleSeq4PinChange}
        onSeq5PinChange={handleSeq5PinChange}
        onSeq6PinChange={handleSeq6PinChange}
        onSeq7PinChange={handleSeq7PinChange}
        onSeq2Complete={handleSeq2Complete}
      />

      {/* ── Ambient particles (z:1) — active during hero pin ──────────── */}
      <AmbientLayer isActive={heroPhase} />

      {/* ── Hero names + date overlay (z:2) — appears from frame 320 ──── */}
      <HeroOverlay isVisible={heroPhase} progress={heroProgress} fadeOut={heroFadeOut} />

      {/* ── Seq2 final frame pin overlay (z:2) — soft white sky fade & minimal details ── */}
      <Seq2EndOverlay isVisible={seq2PinPhase} progress={seq2PinProgress} fadeOut={seq2FadeOut} />

      {/* ── Seq3 final frame pin overlay (z:2) — soft white sky fade & minimal Our Story ── */}
      <Seq3EndOverlay isVisible={seq3PinPhase} progress={seq3PinProgress} fadeOut={seq3FadeOut} />

      {/* ── Seq4 final frame pin overlay (z:2) — Couple & Parents details ── */}
      <Seq4EndOverlay isVisible={seq4PinPhase} progress={seq4PinProgress} fadeOut={seq4FadeOut} />

      {/* ── Seq5 final frame pin overlay (z:2) — interactive wedding details & live countdown ── */}
      <Seq5EndOverlay isVisible={seq5PinPhase} progress={seq5PinProgress} fadeOut={seq5FadeOut} />

      {/* ── Seq6 final frame pin overlay (z:2) — centered event location map & directions ── */}
      <Seq6EndOverlay isVisible={seq6PinPhase} progress={seq6PinProgress} fadeOut={seq6FadeOut} />

      {/* ── Seq7 final frame pin overlay (z:2) — Thank You message & top overlay shade ── */}
      <Seq7EndOverlay isVisible={seq7PinPhase} progress={seq7PinProgress} fadeOut={seq7FadeOut} />

      {/* ── Scroll root — defines page height ─────────────────────────── */}
      <div id="scroll-root" style={{ position: "relative", zIndex: 1 }}>

        {/* Sequence 1 spacer */}
        <div aria-hidden="true" style={{ height: SEQ1_H + "px", width: "100%" }} />

        {/* Hero pin spacer */}
        <div aria-hidden="true" style={{ height: HERO_H + "px", width: "100%" }} />

        {/* Sequence 2 spacer */}
        <div aria-hidden="true" style={{ height: SEQ2_H + "px", width: "100%" }} />

        {/* Sequence 2 pin spacer */}
        <div aria-hidden="true" style={{ height: SEQ2_PIN_H + "px", width: "100%" }} />

        {/* Sequence 3 spacer */}
        <div aria-hidden="true" style={{ height: SEQ3_H + "px", width: "100%" }} />

        {/* Sequence 3 pin spacer */}
        <div aria-hidden="true" style={{ height: SEQ3_PIN_H + "px", width: "100%" }} />

        {/* Sequence 4 spacer */}
        <div aria-hidden="true" style={{ height: SEQ4_H + "px", width: "100%" }} />

        {/* Sequence 4 pin spacer */}
        <div aria-hidden="true" style={{ height: SEQ4_PIN_H + "px", width: "100%" }} />

        {/* Sequence 5 spacer */}
        <div aria-hidden="true" style={{ height: SEQ5_H + "px", width: "100%" }} />

        {/* Sequence 5 pin spacer */}
        <div aria-hidden="true" style={{ height: SEQ5_PIN_H + "px", width: "100%" }} />

        {/* Sequence 6 spacer */}
        <div aria-hidden="true" style={{ height: SEQ6_H + "px", width: "100%" }} />

        {/* Sequence 6 pin spacer */}
        <div aria-hidden="true" style={{ height: SEQ6_PIN_H + "px", width: "100%" }} />

        {/* Sequence 7 spacer */}
        <div aria-hidden="true" style={{ height: SEQ7_H + "px", width: "100%" }} />

        {/* Sequence 7 pin spacer — pins final frame of sequence 7 for Thank You overlay */}
        <div aria-hidden="true" style={{ height: SEQ7_PIN_H + "px", width: "100%" }} />
      </div>
    </>
  );
}
