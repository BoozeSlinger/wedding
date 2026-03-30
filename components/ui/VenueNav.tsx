"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Props {
  venue: "rustic" | "speakeasy";
}

export default function VenueNav({ venue }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const isRustic = venue === "rustic";
  const accent = isRustic ? "var(--rustic-primary)" : "var(--speak-amber)";
  const accentRGB = isRustic ? "196,146,42" : "212,160,23";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30"
      style={{
        padding: scrolled ? "12px 24px" : "20px 24px",
        background: scrolled ? "rgba(10,8,5,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? `1px solid rgba(${accentRGB},0.1)`
          : "none",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="cursor-trigger">
          <div
            className="font-display"
            style={{ fontSize: "1.5rem", color: accent, lineHeight: 1 }}
          >
            Last Call
          </div>
          <div
            className="font-ui"
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.35em",
              color: `rgba(${accentRGB},0.5)`,
              marginTop: "-2px",
            }}
          >
            WEDDING CO.
          </div>
        </Link>

        {/* Venue toggle */}
        <div
          className="hidden md:flex items-center gap-1 px-2 py-2"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: `1px solid rgba(${accentRGB},0.12)`,
            borderRadius: "4px",
          }}
        >
          <Link
            href="/venue/rustic"
            className="cursor-trigger px-4 py-2 font-ui text-xs transition-all duration-300"
            style={{
              letterSpacing: "0.2em",
              color:
                venue === "rustic"
                  ? "var(--rustic-primary)"
                  : "rgba(255,255,255,0.35)",
              background:
                venue === "rustic"
                  ? "rgba(196,146,42,0.12)"
                  : "transparent",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            THE RANCH
          </Link>
          <div
            style={{
              width: "1px",
              height: "16px",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <Link
            href="/venue/speakeasy"
            className="cursor-trigger px-4 py-2 font-ui text-xs transition-all duration-300"
            style={{
              letterSpacing: "0.2em",
              color:
                venue === "speakeasy"
                  ? "var(--speak-amber)"
                  : "rgba(255,255,255,0.35)",
              background:
                venue === "speakeasy"
                  ? "rgba(212,160,23,0.12)"
                  : "transparent",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            THE VAULT
          </Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a
            href="#sandbox"
            className="cursor-trigger hidden md:block font-ui text-xs"
            style={{
              letterSpacing: "0.2em",
              color: `rgba(${accentRGB},0.6)`,
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = accent;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = `rgba(${accentRGB},0.6)`;
            }}
          >
            PRICING
          </a>
          <a
            href="#concierge"
            className="cursor-trigger font-ui text-xs px-5 py-3"
            style={{
              letterSpacing: "0.2em",
              border: `1px solid ${accent}`,
              color: accent,
              borderRadius: "2px",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = accent;
              el.style.color = "var(--color-obsidian)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.color = accent;
            }}
          >
            BOOK
          </a>
        </div>
      </div>
    </nav>
  );
}
