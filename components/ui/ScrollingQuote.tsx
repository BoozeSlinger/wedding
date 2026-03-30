"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  quote: string;
  attribution?: string;
  venue: "rustic" | "speakeasy";
  /** Rotation angle, e.g. -2 for slight counter-clockwise tilt */
  rotate?: number;
}

/**
 * ScrollingQuote — A full-width horizontally scrolling marquee quote.
 * Speed is tied to scroll velocity so it speeds up when scrolling fast.
 * The text tilts slightly for an editorial magazine feel.
 */
export default function ScrollingQuote({
  quote,
  attribution,
  venue,
  rotate = -2.5,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(0);
  const xRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastScrollY = useRef(0);

  const accent = venue === "rustic" ? "#c4922a" : "#d4a017";
  const accentDim =
    venue === "rustic" ? "rgba(196,146,42,0.15)" : "rgba(212,160,23,0.15)";

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Auto-scroll with scroll-velocity boost
    const tick = () => {
      const scrollDelta = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;

      // Ease speed toward target
      const targetSpeed = -0.6 - Math.abs(scrollDelta) * 0.4;
      speedRef.current += (targetSpeed - speedRef.current) * 0.1;

      xRef.current += speedRef.current;

      // Reset when first copy scrolls fully out
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(xRef.current) >= halfWidth) {
        xRef.current = 0;
      }

      track.style.transform = `translateX(${xRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const repeated = Array(6).fill(`${quote} `);

  return (
    <div
      className="w-full overflow-hidden relative py-12"
      style={{
        transform: `rotate(${rotate}deg)`,
        margin: `${Math.abs(rotate) * 4}px 0`,
        borderTop: `1px solid ${accentDim}`,
        borderBottom: `1px solid ${accentDim}`,
      }}
    >
      {/* Background accent strip */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, transparent 0%, ${accentDim} 30%, ${accentDim} 70%, transparent 100%)`,
        }}
      />

      <div
        ref={trackRef}
        className="flex whitespace-nowrap"
        style={{ willChange: "transform", display: "flex" }}
      >
        {[...repeated, ...repeated].map((item, i) => (
          <span
            key={i}
            className="font-display"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 5.5rem)",
              color: i % 2 === 0 ? accent : "rgba(245,240,232,0.12)",
              flexShrink: 0,
              paddingRight: "0.5em",
              textShadow: i % 2 === 0 ? `0 0 40px ${accentDim}` : "none",
            }}
          >
            {item}
            <span
              style={{
                color: accentDim,
                fontSize: "0.5em",
                verticalAlign: "middle",
                margin: "0 0.5em",
              }}
            >
              ◆
            </span>
          </span>
        ))}
      </div>

      {attribution && (
        <div
          className="absolute bottom-2 right-8 font-ui text-xs"
          style={{ color: "rgba(196,146,42,0.3)", letterSpacing: "0.2em" }}
        >
          — {attribution}
        </div>
      )}
    </div>
  );
}
