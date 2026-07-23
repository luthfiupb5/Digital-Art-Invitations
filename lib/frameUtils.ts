// Frame path utilities for sequences

export const SEQ1_TOTAL = 480;
export const SEQ2_TOTAL = 403;
export const SEQ3_TOTAL = 260;
export const SEQ4_TOTAL = 480;
export const SEQ5_TOTAL = 238;
export const SEQ6_TOTAL = 270;
export const TOTAL_FRAMES =
  SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL + SEQ4_TOTAL + SEQ5_TOTAL + SEQ6_TOTAL; // 2131

// Scroll configuration
export const PX_PER_FRAME = 8; // pixels of scroll per frame
export const SEQ1_SCROLL_HEIGHT = SEQ1_TOTAL * PX_PER_FRAME; // 3840px
export const SEQ2_SCROLL_HEIGHT = SEQ2_TOTAL * PX_PER_FRAME; // 3224px
export const SEQ3_SCROLL_HEIGHT = SEQ3_TOTAL * PX_PER_FRAME; // 2080px
export const SEQ4_SCROLL_HEIGHT = SEQ4_TOTAL * PX_PER_FRAME; // 3840px
export const SEQ5_SCROLL_HEIGHT = SEQ5_TOTAL * PX_PER_FRAME; // 1904px
export const SEQ6_SCROLL_HEIGHT = SEQ6_TOTAL * PX_PER_FRAME; // 2160px
export const HERO_PIN_SCROLL_HEIGHT = 0;       // no pin after seq1 — seq2 starts immediately
export const SEQ2_PIN_SCROLL_HEIGHT = 1800;   // pin after seq2 — white sky fade & minimal details reveal here
export const SEQ3_PIN_SCROLL_HEIGHT = 2400;   // pin after seq3 — white sky fade & minimal Our Story reveal here
export const SEQ4_PIN_SCROLL_HEIGHT = 2400;   // pin after seq4 — white sky fade & minimal Couple reveal here
export const SEQ5_PIN_SCROLL_HEIGHT = 2800;   // pin after seq5 — interactive wedding details & countdown reveal here
export const SEQ6_PIN_SCROLL_HEIGHT = 3200;   // pin after seq6 — event location map & directions reveal here

/**
 * Returns the URL path for a given unified frame index [0..2130].
 * Frames 0-479 → Sequence1
 * Frames 480-882 → Sequence 2
 * Frames 883-1142 → Sequence 3
 * Frames 1143-1622 → Sequence 4
 * Frames 1623-1860 → Sequence 5
 * Frames 1861-2130 → Sequence 6
 */
export function getFrameUrl(unifiedIndex: number): string {
  if (unifiedIndex < SEQ1_TOTAL) {
    const n = unifiedIndex + 1;
    return `/Sequence1/frame_${String(n).padStart(5, "0")}_result.webp`;
  } else if (unifiedIndex < SEQ1_TOTAL + SEQ2_TOTAL) {
    const n = unifiedIndex - SEQ1_TOTAL + 1;
    // NOTE: folder has a space — URL-encoded
    return `/sequence%202/frame_${String(n).padStart(5, "0")}_result.webp`;
  } else if (unifiedIndex < SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL) {
    const n = unifiedIndex - (SEQ1_TOTAL + SEQ2_TOTAL) + 1;
    return `/Sequence3/frame_${String(n).padStart(5, "0")}_result.webp`;
  } else if (unifiedIndex < SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL + SEQ4_TOTAL) {
    const n = unifiedIndex - (SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL) + 1;
    return `/Sequence4/frame_${String(n).padStart(5, "0")}_result.webp`;
  } else if (
    unifiedIndex <
    SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL + SEQ4_TOTAL + SEQ5_TOTAL
  ) {
    const n = unifiedIndex - (SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL + SEQ4_TOTAL) + 1;
    return `/sequence5/frame_${String(n).padStart(5, "0")}_result.webp`;
  } else {
    const n =
      unifiedIndex -
      (SEQ1_TOTAL + SEQ2_TOTAL + SEQ3_TOTAL + SEQ4_TOTAL + SEQ5_TOTAL) +
      1;
    return `/Sequence6/frame_${String(n).padStart(5, "0")}_result.webp`;
  }
}

/**
 * Preload a batch of images starting from `startIndex` for `count` frames.
 * Returns an array of Image objects (may still be loading).
 */
export function preloadBatch(
  imageCache: (HTMLImageElement | null)[],
  startIndex: number,
  count: number
): void {
  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    if (idx >= TOTAL_FRAMES) break;
    if (imageCache[idx]) continue; // already cached or loading

    const img = new Image();
    img.decoding = "async";
    img.src = getFrameUrl(idx);
    imageCache[idx] = img;
  }
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

