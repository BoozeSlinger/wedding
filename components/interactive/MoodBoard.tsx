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
      className="glass-card p-10 md:p-14"
      style={{
        background: venue === "rustic" ? "rgba(28,18,9,0.7)" : "rgba(13,10,14,0.75)",
        border: `1.5px solid rgba(${accentRGB},0.15)`,
        boxShadow: `0 24px 80px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`,
        backdropFilter: "blur(32px)",
        borderRadius: "4px",
      }}
    >
      {/* Live Preview Panel */}
      <div
        className="relative w-full mb-16 overflow-hidden"
        style={{
          height: "300px",
          borderRadius: "2px",
          background: activeColors.length
            ? `linear-gradient(135deg, ${activeColors[0].color}30 0%, ${(activeColors[1] || activeColors[0]).color}50 60%, ${activeColors[0].color}10 100%)`
            : "rgba(0,0,0,0.5)",
          transition: "background 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          border: `1px solid rgba(${accentRGB},0.15)`,
        }}
      >
        {/* Preview elements */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
          style={{ zIndex: 2 }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.6em",
              color: activeColors[0]?.color || accent,
              marginBottom: "12px",
              fontFamily: "var(--font-ui)",
              opacity: 0.9,
              fontWeight: 600,
            }}
          >
            LAST CALL WEDDING CO. · YOUR PALETTE
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              color: "rgba(245,240,232,0.98)",
              lineHeight: 1,
              textShadow: `0 4px 40px ${activeColors[0]?.color}90`,
            }}
          >
            Your Perfect Day
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            {activeColors.map((c) => (
              <div
                key={c.id}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: c.color,
                  border: "2px solid rgba(255,255,255,0.25)",
                  boxShadow: `0 0 25px ${c.color}70`,
                  transition: "all 0.4s ease",
                }}
              />
            ))}
          </div>
          <div
            className="font-ui mt-6 text-xs"
            style={{
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {activeFloral.name} · {activeColors.map((c) => c.name).join(" + ")}
          </div>
        </div>

        {/* Decorative floral motif */}
        <div
          className="absolute"
          style={{
            right: "30px",
            top: "30px",
            fontSize: "4rem",
            opacity: 0.1,
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
            height: "80px",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
          }}
        />
      </div>

      {/* Color Palette Swatches */}
      <div className="mb-16">
        <div
          className="font-ui text-xs mb-8"
          style={{
            color: `rgba(${accentRGB},0.8)`,
            letterSpacing: "0.4em",
            fontWeight: 600,
          }}
        >
          COLOR PALETTE · SELECT UP TO 3
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {palettes.map((p) => (
            <div
              key={p.id}
              className="cursor-trigger text-center group"
              onClick={() => toggleColor(p.id)}
            >
              <div
                className="mood-swatch mx-auto"
                style={{
                  background: p.color,
                  border: selectedColors.includes(p.id)
                    ? `2.5px solid ${accent}`
                    : "2px solid rgba(255,255,255,0.1)",
                  transform: selectedColors.includes(p.id)
                    ? "scale(1.2)"
                    : "scale(1)",
                  boxShadow: selectedColors.includes(p.id)
                    ? `0 0 30px ${p.color}80, 0 0 0 6px rgba(${accentRGB},0.2)`
                    : "none",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
              <div
                className="font-ui mt-3"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: selectedColors.includes(p.id)
                    ? accent
                    : "rgba(255,255,255,0.4)",
                  transition: "color 0.3s ease",
                  fontWeight: 500,
                }}
              >
                {p.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floral Style */}
      <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          className="font-ui text-xs mb-8 mt-8"
          style={{
            color: `rgba(${accentRGB},0.8)`,
            letterSpacing: "0.4em",
            fontWeight: 600,
          }}
        >
          FLORAL STYLE
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {FLORAL_STYLES.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFloral(f.id)}
              className="cursor-trigger p-8 text-center transition-all duration-300 relative group"
              style={{
                border: `1.5px solid ${
                  selectedFloral === f.id
                    ? accent
                    : "rgba(255,255,255,0.06)"
                }`,
                borderRadius: "4px",
                background:
                  selectedFloral === f.id
                    ? `rgba(${accentRGB},0.12)`
                    : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "12px",
                  color:
                    selectedFloral === f.id ? accent : "rgba(255,255,255,0.4)",
                  transition: "all 0.3s ease",
                  fontFamily: "serif",
                  transform: selectedFloral === f.id ? "scale(1.1)" : "scale(1)",
                }}
              >
                {f.icon}
              </div>
              <div
                className="font-ui text-xs font-bold"
                style={{
                  color:
                    selectedFloral === f.id
                      ? accent
                      : "rgba(255,255,255,0.7)",
                  letterSpacing: "0.15em",
                  transition: "color 0.3s ease",
                }}
              >
                {f.name.toUpperCase()}
              </div>
              <div
                className="font-body mt-2"
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.35)",
                  fontStyle: "italic",
                  lineHeight: 1.5,
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
