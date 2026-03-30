"use client";

import { useState } from "react";

interface Props {
  venue: "rustic" | "speakeasy";
}

const RUSTIC_PALETTES = [
  { id: "golden-ember", name: "Golden Ember", color: "#c4922a", desc: "Warm & Western" },
  { id: "sage-prairie", name: "Sage Prairie", color: "#7a8c6e", desc: "Earthy & Natural" },
  { id: "leather-cream", name: "Leather & Cream", color: "#d4b896", desc: "Classic Ranch" },
  { id: "sunset-blush", name: "Sunset Blush", color: "#e8856e", desc: "Romantic Dusk" },
  { id: "midnight-pine", name: "Midnight Pine", color: "#2d4a35", desc: "Deep Forest" },
  { id: "burnt-terracotta", name: "Terracotta", color: "#bf5e3a", desc: "Rich Earth" },
];

const SPEAKEASY_PALETTES = [
  { id: "velvet-crimson", name: "Velvet Crimson", color: "#9b1c1c", desc: "Dark Romance" },
  { id: "gilded-emerald", name: "Gilded Emerald", color: "#1a472a", desc: "Secret Garden" },
  { id: "champagne-gold", name: "Champagne Gold", color: "#d4a017", desc: "Decadent Glow" },
  { id: "violet-shadow", name: "Violet Shadow", color: "#4a1942", desc: "Mysterious Depth" },
  { id: "midnight-slate", name: "Midnight Slate", color: "#1a1f2e", desc: "Cool Elegance" },
  { id: "blush-noir", name: "Blush Noir", color: "#8b3a5a", desc: "Intimate Pink" },
];

const FLORAL_STYLES = [
  { id: "wildflower", name: "Wildflower", icon: "✿", desc: "Loose, untamed, garden-gathered" },
  { id: "architectural", name: "Architectural", icon: "◆", desc: "Structural, statement, bold" },
  { id: "cascading", name: "Cascading", icon: "⌇", desc: "Flowing, romantic, lush" },
  { id: "modern-minimal", name: "Modern Minimal", icon: "○", desc: "Sculptural, single bloom" },
];

export default function MoodBoard({ venue }: Props) {
  const accent = venue === "rustic" ? "var(--rustic-primary)" : "var(--speak-amber)";
  const accentRGB = venue === "rustic" ? "196,146,42" : "212,160,23";

  const palettes = venue === "rustic" ? RUSTIC_PALETTES : SPEAKEASY_PALETTES;
  const [selectedColors, setSelectedColors] = useState<string[]>([palettes[0].id, palettes[2].id]);
  const [selectedFloral, setSelectedFloral] = useState("wildflower");

  const toggleColor = (id: string) => {
    setSelectedColors((prev) => {
      if (prev.includes(id)) return prev.length > 1 ? prev.filter((c) => c !== id) : prev;
      return [...prev.slice(-2), id];
    });
  };

  const activeColors = palettes.filter((p) => selectedColors.includes(p.id));
  const activeFloral = FLORAL_STYLES.find((f) => f.id === selectedFloral)!;

  return (
    <div
      className="glass-card p-8 md:p-10"
      style={{
        background: venue === "rustic" ? "rgba(28,18,9,0.8)" : "rgba(13,10,14,0.85)",
        border: `1px solid rgba(${accentRGB},0.12)`,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Live Preview Panel */}
      <div
        className="relative w-full mb-10 overflow-hidden"
        style={{
          height: "260px",
          borderRadius: "4px",
          background: activeColors.length
            ? `linear-gradient(135deg, ${activeColors[0].color}40 0%, ${(activeColors[1] || activeColors[0]).color}60 60%, ${activeColors[0].color}20 100%)`
            : "rgba(0,0,0,0.5)",
          transition: "background 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          border: `1px solid rgba(${accentRGB},0.1)`,
        }}
      >
        {/* Preview elements */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          style={{ zIndex: 2 }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.5em",
              color: activeColors[0]?.color || accent,
              marginBottom: "10px",
              fontFamily: "var(--font-ui)",
              opacity: 0.8,
            }}
          >
            LAST CALL WEDDING CO. · YOUR PALETTE
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "rgba(245,240,232,0.95)",
              lineHeight: 1,
              textShadow: `0 4px 30px ${activeColors[0]?.color}80`,
            }}
          >
            Your Perfect Day
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            {activeColors.map((c) => (
              <div
                key={c.id}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: c.color,
                  border: "2px solid rgba(255,255,255,0.15)",
                  boxShadow: `0 0 20px ${c.color}60`,
                  transition: "all 0.4s ease",
                }}
              />
            ))}
          </div>
          <div
            className="font-ui mt-4 text-xs"
            style={{
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {activeFloral.name} · {activeColors.map((c) => c.name).join(" + ")}
          </div>
        </div>

        {/* Decorative floral motif */}
        <div
          className="absolute"
          style={{
            right: "20px",
            top: "20px",
            fontSize: "3rem",
            opacity: 0.08,
            fontFamily: "var(--font-display)",
            color: activeColors[0]?.color,
            transition: "color 0.6s ease",
          }}
        >
          {activeFloral.icon}
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "60px",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
          }}
        />
      </div>

      {/* Color Palette Swatches */}
      <div className="mb-10">
        <div
          className="font-ui text-xs mb-5"
          style={{
            color: `rgba(${accentRGB},0.6)`,
            letterSpacing: "0.4em",
          }}
        >
          COLOR PALETTE · SELECT UP TO 3
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {palettes.map((p) => (
            <div
              key={p.id}
              className="cursor-trigger text-center"
              onClick={() => toggleColor(p.id)}
            >
              <div
                className="mood-swatch mx-auto"
                style={{
                  background: p.color,
                  border: selectedColors.includes(p.id)
                    ? `2px solid ${accent}`
                    : "2px solid transparent",
                  transform: selectedColors.includes(p.id)
                    ? "scale(1.2)"
                    : "scale(1)",
                  boxShadow: selectedColors.includes(p.id)
                    ? `0 0 20px ${p.color}60, 0 0 0 4px rgba(${accentRGB},0.2)`
                    : "none",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
              <div
                className="font-ui mt-2"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  color: selectedColors.includes(p.id)
                    ? accent
                    : "rgba(255,255,255,0.3)",
                  transition: "color 0.3s ease",
                }}
              >
                {p.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floral Style */}
      <div>
        <div
          className="font-ui text-xs mb-5"
          style={{
            color: `rgba(${accentRGB},0.6)`,
            letterSpacing: "0.4em",
          }}
        >
          FLORAL STYLE
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FLORAL_STYLES.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFloral(f.id)}
              className="cursor-trigger p-4 text-center transition-all duration-300"
              style={{
                border: `1px solid ${
                  selectedFloral === f.id
                    ? accent
                    : "rgba(255,255,255,0.08)"
                }`,
                borderRadius: "4px",
                background:
                  selectedFloral === f.id
                    ? `rgba(${accentRGB},0.08)`
                    : "rgba(255,255,255,0.02)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "8px",
                  color:
                    selectedFloral === f.id ? accent : "rgba(255,255,255,0.3)",
                  transition: "color 0.3s ease",
                  fontFamily: "serif",
                }}
              >
                {f.icon}
              </div>
              <div
                className="font-ui text-xs font-medium"
                style={{
                  color:
                    selectedFloral === f.id
                      ? accent
                      : "rgba(255,255,255,0.5)",
                  letterSpacing: "0.08em",
                  transition: "color 0.3s ease",
                }}
              >
                {f.name}
              </div>
              <div
                className="font-body mt-1"
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.25)",
                  fontStyle: "italic",
                  maxWidth: "none",
                  lineHeight: 1.4,
                }}
              >
                {f.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
