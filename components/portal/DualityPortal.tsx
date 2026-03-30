"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Venue = "rustic" | "speakeasy" | null;

interface ParticleConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

const RUSTIC_COLORS = [
  "rgba(196, 146, 42, 0.8)",
  "rgba(232, 185, 110, 0.6)",
  "rgba(255, 107, 53, 0.5)",
  "rgba(139, 94, 26, 0.7)",
];

const SPEAKEASY_COLORS = [
  "rgba(155, 28, 28, 0.8)",
  "rgba(212, 160, 23, 0.7)",
  "rgba(107, 31, 58, 0.6)",
  "rgba(26, 71, 42, 0.5)",
];

function createParticles(
  count: number,
  startX: number,
  maxWidth: number,
  colors: string[],
  height: number
): ParticleConfig[] {
  return Array.from({ length: count }, () => ({
    x: startX + Math.random() * maxWidth,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.3,
    radius: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.6 + 0.1,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

export default function DualityPortal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [hoveredSide, setHoveredSide] = useState<Venue>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);
  const splitRatioRef = useRef(0.5);
  const targetRatioRef = useRef(0.5);
  const particlesRef = useRef<ParticleConfig[]>([]);
  const warpProgressRef = useRef(0);
  const warpVenueRef = useRef<Venue>(null);

  const initParticles = useCallback((width: number, height: number) => {
    const midX = width * splitRatioRef.current;
    const half = Math.floor(width);
    particlesRef.current = [
      ...createParticles(50, 0, midX, RUSTIC_COLORS, height),
      ...createParticles(50, midX, half - midX, SPEAKEASY_COLORS, height),
    ];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const drawRusticHalf = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      t: number
    ) => {
      // Deep golden-hour gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, `hsl(25, 55%, ${6 + Math.sin(t * 0.8) * 2}%)`);
      grad.addColorStop(0.4, `hsl(35, 65%, 11%)`);
      grad.addColorStop(0.7, `hsl(25, 55%, 8%)`);
      grad.addColorStop(1, `hsl(15, 45%, 5%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Horizon glow
      const horizonGrad = ctx.createRadialGradient(
        w * 0.5,
        h * 0.68,
        0,
        w * 0.5,
        h * 0.68,
        w * 0.5
      );
      horizonGrad.addColorStop(
        0,
        `rgba(196, 146, 42, ${0.12 + Math.sin(t * 0.5) * 0.04})`
      );
      horizonGrad.addColorStop(0.5, "rgba(139, 94, 26, 0.06)");
      horizonGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, 0, w, h);

      // Ember particles
      particlesRef.current.slice(0, 50).forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        p.x += p.vx;
        p.y += p.vy - 0.2;
        if (p.y < 0) p.y = h;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
      });
    };

    const drawSpeakeasyHalf = (
      ctx: CanvasRenderingContext2D,
      startX: number,
      w: number,
      h: number,
      t: number,
      mouseX: number,
      mouseY: number
    ) => {
      ctx.save();
      ctx.translate(startX, 0);

      // Deep shadow gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, `hsl(270, 20%, 4%)`);
      grad.addColorStop(0.3, `hsl(250, 25%, 6%)`);
      grad.addColorStop(0.7, `hsl(0, 30%, 5%)`);
      grad.addColorStop(1, `hsl(250, 20%, 3%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Pulsing amber glow from center
      const cx = w / 2;
      const cy = h / 2;
      const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.6);
      glowGrad.addColorStop(
        0,
        `rgba(155, 28, 28, ${0.08 + Math.sin(t * 0.7) * 0.04})`
      );
      glowGrad.addColorStop(
        0.5,
        `rgba(212, 160, 23, ${0.04 + Math.sin(t * 0.5) * 0.02})`
      );
      glowGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // Mouse spotlight effect when hovering speakeasy side
      if (mouseX > startX) {
        const relX = mouseX - startX;
        const spotGrad = ctx.createRadialGradient(
          relX,
          mouseY,
          0,
          relX,
          mouseY,
          120
        );
        spotGrad.addColorStop(
          0,
          `rgba(212, 160, 23, ${0.14 + Math.sin(t * 2) * 0.02})`
        );
        spotGrad.addColorStop(0.6, "rgba(196, 146, 42, 0.04)");
        spotGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Dust motes
      particlesRef.current.slice(50).forEach((p) => {
        const relP = { ...p, x: p.x - startX };
        if (relP.x < 0 || relP.x > w) return;
        ctx.beginPath();
        ctx.arc(relP.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;

        p.x += p.vx * 0.5;
        p.y += p.vy * 0.3;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        if (p.x < startX) p.x = startX + w;
        if (p.x > startX + w) p.x = startX;
      });

      ctx.restore();
    };

    const drawDividerLine = (
      ctx: CanvasRenderingContext2D,
      x: number,
      h: number,
      t: number
    ) => {
      // Glowing center divider
      const lineGrad = ctx.createLinearGradient(x, 0, x, h);
      lineGrad.addColorStop(0, "rgba(196, 146, 42, 0)");
      lineGrad.addColorStop(
        0.3,
        `rgba(196, 146, 42, ${0.4 + Math.sin(t) * 0.15})`
      );
      lineGrad.addColorStop(
        0.7,
        `rgba(212, 160, 23, ${0.6 + Math.sin(t * 1.3) * 0.15})`
      );
      lineGrad.addColorStop(1, "rgba(196, 146, 42, 0)");

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glow blur
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.strokeStyle = `rgba(196, 146, 42, ${0.1 + Math.sin(t) * 0.05})`;
      ctx.lineWidth = 8;
      ctx.stroke();
    };

    const drawWarpEffect = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      progress: number,
      venue: Venue
    ) => {
      const eased = 1 - Math.pow(1 - progress, 3);
      const radius = Math.max(w, h) * 2 * eased;
      const centerX = venue === "rustic" ? w * 0.25 : w * 0.75;

      ctx.fillStyle =
        venue === "rustic"
          ? `rgba(28, 18, 9, ${eased})`
          : `rgba(13, 10, 14, ${eased})`;

      ctx.beginPath();
      ctx.arc(centerX, h / 2, radius, 0, Math.PI * 2);
      ctx.fill();

      // Liquid ripple rings
      for (let i = 0; i < 5; i++) {
        const ringScale = 1 - i * 0.12;
        const ringOpacity = Math.max(0, (1 - progress) * 0.4 * (1 - i * 0.2));
        ctx.beginPath();
        ctx.arc(centerX, h / 2, radius * ringScale, 0, Math.PI * 2);
        ctx.strokeStyle =
          venue === "rustic"
            ? `rgba(196, 146, 42, ${ringOpacity})`
            : `rgba(212, 160, 23, ${ringOpacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    let t = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      t += 0.016;

      // Smooth split ratio lerp
      const lerpSpeed =
        targetRatioRef.current !== 0.5 ? 0.04 : 0.025;
      splitRatioRef.current = lerp(
        splitRatioRef.current,
        targetRatioRef.current,
        lerpSpeed
      );

      const splitX = w * splitRatioRef.current;

      // Draw both halves
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, h);
      ctx.clip();
      drawRusticHalf(ctx, splitX, h, t);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, w - splitX, h);
      ctx.clip();
      drawSpeakeasyHalf(ctx, splitX, w - splitX, h, t, mousePos.x, mousePos.y);
      ctx.restore();

      drawDividerLine(ctx, splitX, h, t);

      // Warp transition overlay
      if (warpProgressRef.current > 0) {
        drawWarpEffect(ctx, w, h, warpProgressRef.current, warpVenueRef.current);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initParticles, mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX;
    setMousePos({ x: e.clientX, y: e.clientY });

    const midX = window.innerWidth * 0.5;
    if (x < midX) {
      setHoveredSide("rustic");
      targetRatioRef.current = 0.7;
    } else {
      setHoveredSide("speakeasy");
      targetRatioRef.current = 0.3;
    }
  };

  const handleMouseLeave = () => {
    setHoveredSide(null);
    targetRatioRef.current = 0.5;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isTransitioning) return;
    const x = e.clientX;
    const venue: Venue = x < window.innerWidth * 0.5 ? "rustic" : "speakeasy";

    setIsTransitioning(true);
    warpVenueRef.current = venue;

    let progress = 0;
    const warpInterval = setInterval(() => {
      progress += 0.025;
      warpProgressRef.current = Math.min(progress, 1);
      if (progress >= 1) {
        clearInterval(warpInterval);
        router.push(venue === "rustic" ? "/venue/rustic" : "/venue/speakeasy");
      }
    }, 16);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: "none" }}
      />

      {/* Center overlay text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {/* Top wordmark */}
        <div
          className="font-ui text-xs tracking-[0.4em] text-center mb-8"
          style={{ color: "rgba(196,146,42,0.6)" }}
        >
          THE MOST IMPORTANT DAY OF YOUR LIFE DESERVES THE RIGHT SETTING.
        </div>

        {/* Main headline */}
        <h1
          className="font-display text-center leading-none transition-all duration-700"
          style={{
            fontSize: "clamp(3rem, 8vw, 8rem)",
            color: "rgba(245, 240, 232, 0.95)",
            textShadow: "0 4px 40px rgba(0,0,0,0.9)",
          }}
        >
          Two Venues.
          <br />
          <span
            style={{
              color:
                hoveredSide === "rustic"
                  ? "var(--rustic-primary)"
                  : hoveredSide === "speakeasy"
                  ? "var(--speak-amber)"
                  : "rgba(245,240,232,0.95)",
              transition: "color 0.5s ease",
            }}
          >
            One Day.
          </span>
        </h1>

        {/* Scroll hint ornament */}
        <div className="font-ui mt-10 text-xs tracking-[0.3em] flex items-center gap-4" style={{ color: "rgba(196,146,42,0.4)" }}>
          <div className="w-8 h-px" style={{ background: "rgba(196,146,42,0.3)" }} />
          HOVER TO FEEL IT · CLICK TO STEP INSIDE
          <div className="w-8 h-px" style={{ background: "rgba(196,146,42,0.3)" }} />
        </div>

        {/* Side labels */}
        <div className="absolute inset-0 flex pointer-events-none">
          {/* Rustic label */}
          <div
            className="flex-1 flex flex-col items-center justify-end pb-16"
            style={{
              opacity: hoveredSide === "speakeasy" ? 0.2 : 1,
              transition: "opacity 0.6s ease",
            }}
          >
            <div
              className="font-editorial text-center"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.8rem)",
                color: "var(--rustic-warm)",
                letterSpacing: "0.15em",
              }}
            >
              THE RANCH
            </div>
            <div
              className="font-ui text-xs mt-2"
              style={{
                color: "rgba(196,146,42,0.5)",
                letterSpacing: "0.25em",
              }}
            >
              12 ACRES · 350 GUESTS · OPEN SKIES
            </div>
          </div>

          {/* Speakeasy label */}
          <div
            className="flex-1 flex flex-col items-center justify-end pb-16"
            style={{
              opacity: hoveredSide === "rustic" ? 0.2 : 1,
              transition: "opacity 0.6s ease",
            }}
          >
            <div
              className="font-editorial text-center"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.8rem)",
                color: "var(--speak-amber)",
                letterSpacing: "0.15em",
              }}
            >
              THE VAULT
            </div>
            <div
              className="font-ui text-xs mt-2"
              style={{
                color: "rgba(212,160,23,0.5)",
                letterSpacing: "0.25em",
              }}
            >
              EST. 1924 · 200 GUESTS · DOWNTOWN
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden py-3"
        style={{
          borderTop: "1px solid rgba(196,146,42,0.15)",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
      >
        <div
          style={{ animation: "ticker 30s linear infinite", display: "flex", width: "max-content" }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center" style={{ fontFamily: "var(--font-ui)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(196,146,42,0.4)" }}>
              {[
                "FULL-SERVICE WEDDING PLANNING",
                "VENUES AVAILABLE SPRING & FALL 2026",
                "ALL-INCLUSIVE PACKAGES FROM $18K",
                "OPEN-FIRE & BESPOKE CATERING",
                "PRIVATE SITE TOURS AVAILABLE",
                "LAST CALL WEDDING CO. · EST. IN LOVE",
              ].map((t, j) => (
                <span key={j} className="mx-8">
                  {t} <span style={{ color: "rgba(196,146,42,0.25)" }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
