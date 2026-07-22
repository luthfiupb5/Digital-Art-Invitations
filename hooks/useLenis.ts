"use client";

import { useEffect, useRef } from "react";

interface LenisOptions {
  lerp?: number;
  duration?: number;
  smoothWheel?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
}

/**
 * Hook that initializes Lenis smooth scroll and returns the lenis instance ref.
 * Syncs with GSAP ScrollTrigger if available.
 */
export function useLenis(options: LenisOptions = {}) {
  const lenisRef = useRef<unknown>(null);

  useEffect(() => {
    let lenis: unknown = null;
    let rafId: number;

    async function init() {
      const { default: Lenis } = await import("lenis");

      lenis = new Lenis({
        lerp: options.lerp ?? 0.08,
        duration: options.duration ?? 1.4,
        smoothWheel: options.smoothWheel ?? true,
        touchMultiplier: options.touchMultiplier ?? 1.5,
        infinite: options.infinite ?? false,
      });

      lenisRef.current = lenis;

      // Try to sync with GSAP ScrollTrigger
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (lenis as any).on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time: number) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (lenis as any).raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } catch {
        // GSAP not available, fall back to manual RAF
        function raf(time: number) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (lenis as any).raf(time);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
      }
    }

    init();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (lenis) (lenis as any).destroy();
    };
  }, [options.lerp, options.duration, options.smoothWheel, options.touchMultiplier, options.infinite]);

  return lenisRef;
}
