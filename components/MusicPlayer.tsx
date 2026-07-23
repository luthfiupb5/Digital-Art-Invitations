"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio API ambient chime synth fallback (plays gentle romantic chimes)
  const startSynth = useCallback(() => {
    try {
      if (!synthCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        synthCtxRef.current = new AudioCtx();
      }
      if (synthCtxRef.current.state === "suspended") {
        synthCtxRef.current.resume();
      }

      // Play soft romantic ambient chimes (notes: A, C#, E, F#, G#)
      const notes = [220, 277.18, 329.63, 369.99, 415.3, 440, 554.37, 659.25];
      let noteIdx = 0;

      const playChime = () => {
        if (!synthCtxRef.current || synthCtxRef.current.state !== "running") return;
        const ctx = synthCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(notes[noteIdx % notes.length], ctx.currentTime);
        noteIdx = (noteIdx + Math.floor(Math.random() * 3 + 1)) % notes.length;

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 3.3);
      };

      playChime();
      if (!synthIntervalRef.current) {
        synthIntervalRef.current = setInterval(playChime, 2200);
      }
    } catch {
      /* Audio Context fallback */
    }
  }, []);

  const stopSynth = useCallback(() => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (synthCtxRef.current) {
      synthCtxRef.current.suspend();
    }
  }, []);

  const toggleMusic = () => {
    setHasInteracted(true);
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      stopSynth();
    } else {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          startSynth();
        });
      } else {
        startSynth();
      }
    }
  };

  // Attempt gentle auto-play on first scroll/click anywhere on page
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (audioRef.current) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              startSynth();
              setIsPlaying(true);
            });
        } else {
          startSynth();
          setIsPlaying(true);
        }
      }
      window.removeEventListener("scroll", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("scroll", handleFirstInteraction, { passive: true });
    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      window.removeEventListener("scroll", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted, startSynth]);

  return (
    <>
      {/* HTML5 Audio Tag (Loads /audio/wedding-bg.mp3 if user adds it) */}
      <audio ref={audioRef} src="/audio/wedding-bg.mp3" loop preload="auto" />

      {/* Circular Floating Music Toggle Button — Covers Bottom-Right Star Icon */}
      <div id="music-toggle-container">
        <button
          onClick={toggleMusic}
          aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
          title={isPlaying ? "Music Playing (Click to Mute)" : "Music Off (Click to Play)"}
          className="music-toggle-btn"
        >
          {isPlaying ? (
            /* Animated Equalizer Bars when ON */
            <div className="eq-container">
              <span className="eq-bar bar-1" />
              <span className="eq-bar bar-2" />
              <span className="eq-bar bar-3" />
              <span className="eq-bar bar-4" />
            </div>
          ) : (
            /* Muted Music Note SVG Icon when OFF */
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4a853"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
              <line x1="2" y1="2" x2="22" y2="22" stroke="#e05d5d" strokeWidth="2.2" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
