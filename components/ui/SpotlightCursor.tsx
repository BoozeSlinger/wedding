"use client";

import { useEffect, useRef } from "react";

export default function SpotlightCursor() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;

    let x = 0, y = 0;
    let targetX = 0, targetY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      spot.style.left = `${x}px`;
      spot.style.top = `${y}px`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      className="cursor-spotlight fixed pointer-events-none"
      style={{
        width: "280px",
        height: "280px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(212,160,23,0.1) 0%, rgba(155,28,28,0.06) 40%, transparent 70%)",
        zIndex: 5,
        transform: "translate(-50%, -50%)",
        animation: "spotlight-pulse 3s ease-in-out infinite",
        pointerEvents: "none",
      }}
    />
  );
}
