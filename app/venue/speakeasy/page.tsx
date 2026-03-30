"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BudgetSandbox from "@/components/interactive/BudgetSandbox";
import MoodBoard from "@/components/interactive/MoodBoard";
import ConciergeChatWidget from "@/components/interactive/ConciergeChatWidget";
import VenueNav from "@/components/ui/VenueNav";
import SpotlightCursor from "@/components/ui/SpotlightCursor";
import Image from "next/image";
import CinematicText from "@/components/ui/CinematicText";
import ParallaxPhotoGallery from "@/components/ui/ParallaxPhotoGallery";
import ScrollingQuote from "@/components/ui/ScrollingQuote";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ARCHITECTURAL_HOTSPOTS = [
  {
    x: "22%",
    y: "55%",
    label: "The Mahogany Bar",
    description: "Bespoke Cocktail Packages Available",
    detail: "120yr-old reclaimed mahogany. Fully staffed.",
  },
  {
    x: "70%",
    y: "40%",
    label: "The Vault Room",
    description: "Private Ceremony Space · 80 Guests",
    detail: "Original 1920s brick. Exposed copper pipes.",
  },
  {
    x: "50%",
    y: "75%",
    label: "The Stage",
    description: "Live Music & Entertainment Platform",
    detail: "Full A/V rig included. House band available.",
  },
];

export default function SpeakeasyVenuePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".speak-headline",
        { opacity: 0, y: 70, clipPath: "inset(100% 0 0 0)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0 0 0)",
          duration: 1.4,
          ease: "power4.out",
          delay: 0.3,
        }
      );
      gsap.fromTo(
        ".speak-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.9 }
      );

      gsap.utils.toArray<HTMLElement>(".speak-reveal").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
            delay: i * 0.05,
          }
        );
      });

      // Ambient glow parallax
      gsap.utils.toArray<HTMLElement>(".speak-parallax").forEach((el) => {
        const speed = Number(el.dataset.speed) || 0.2;
        gsap.to(el, {
          y: `${speed * 100}%`,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="venue-speakeasy min-h-screen overflow-x-hidden"
      style={{ background: "var(--speak-dark)" }}
    >
      <SpotlightCursor />
      <VenueNav venue="speakeasy" />

      {/* ─── HERO ─── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/reserve_editorial_hero_1774868160148.png" 
            alt="The Reserve Venue" 
            fill 
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-stone-950/60 via-stone-950/30 to-stone-950" />
        </div>

        {/* Brand Watermark Overlay */}
        <div className="absolute top-24 md:top-32 left-1/2 -translate-x-1/2 z-10 opacity-40 pointer-events-none">
          <Image 
            src="/logonobg.png"
            alt="Last Call Wedding Co."
            width={320}
            height={90}
            className="brightness-0 invert"
            priority
          />
        </div>

        {/* Ambient glow layers */}
        <div
          className="absolute speak-parallax"
          data-speed="0.1"
          style={{
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 50% at 30% 60%, rgba(155,28,28,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Brick texture lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(92,45,30,0.08),
              rgba(92,45,30,0.08) 1px,
              transparent 1px,
              transparent 40px
            )`,
          }}
        />

        <div className="relative text-center px-6 max-w-5xl mx-auto" style={{ zIndex: 2 }}>
          <div
            className="speak-sub font-ui text-xs tracking-[0.5em] mb-6"
            style={{ color: "rgba(212,160,23,0.6)" }}
          >
            VENUE B · THE RESERVE · DOWNTOWN AUSTIN, TX
          </div>

          <h1
            className="speak-headline font-display"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 9rem)",
              color: "var(--color-cream)",
              lineHeight: 0.92,
              textShadow:
                "0 0 80px rgba(155,28,28,0.4), 0 20px 60px rgba(0,0,0,0.9)",
            }}
          >
            The Night
            <br />
            They&apos;ll Never{" "}
            <span
              style={{
                color: "var(--speak-amber)",
                textShadow: "0 0 40px rgba(212,160,23,0.5)",
              }}
            >
              Forget.
            </span>
          </h1>

          <p
            className="speak-sub font-body mt-8 mx-auto"
            style={{
              color: "rgba(201,168,76,0.7)",
              fontSize: "1.15rem",
              maxWidth: "48ch",
              lineHeight: 1.75,
            }}
          >
            A 1924 landmark building reborn as the most intimate wedding venue
            in Austin. Exposed brick, velvet drapes, the soft hum of live jazz
            — and a bespoke cocktail program that turns your reception into
            something people whisper about years later.
          </p>

          <div className="speak-sub flex justify-center gap-4 mt-10">
            <a
              href="#sandbox"
              className="cursor-trigger"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 36px",
                border: "1px solid var(--speak-amber)",
                color: "var(--speak-amber)",
                borderRadius: "2px",
                textDecoration: "none",
                position: "relative",
                overflow: "hidden",
                display: "inline-block",
                transition: "color 0.35s ease",
                background: "transparent",
              }}
            >
              See Your Investment
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "rgba(212,160,23,0.4)" }}
        >
          <span
            className="font-ui"
            style={{ fontSize: "0.6rem", letterSpacing: "0.4em" }}
          >
            DESCEND
          </span>
          <div
            style={{
              width: "1px",
              height: "50px",
              background:
                "linear-gradient(to bottom, rgba(212,160,23,0.4), transparent)",
              animation: "float-gentle 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ─── ARCHITECTURAL HOTSPOTS ─── */}
      <section className="speak-reveal py-60 md:py-80 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-32">
            <div
              className="font-ui text-xs mb-10"
              style={{ color: "rgba(212,160,23,0.6)", letterSpacing: "0.4em" }}
            >
              EXPLORE THE SPACE
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: "var(--color-cream)",
                lineHeight: 1.3,
              }}
            >
              Explore Your
              <br />
              Venue
            </h2>
            <p
              className="font-ui text-sm mt-4"
              style={{
                color: "rgba(212,160,23,0.4)",
                letterSpacing: "0.15em",
              }}
            >
              HOVER THE HOTSPOTS TO DISCOVER
            </p>
          </div>

          {/* Interactive floor plan */}
          <div
            className="relative w-full"
            style={{
              height: "500px",
              borderRadius: "4px",
              overflow: "hidden",
              background:
                "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(30,22,38,1) 0%, rgba(13,10,14,1) 100%)",
              border: "1px solid rgba(212,160,23,0.08)",
            }}
          >
            {/* Interior scene */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  repeating-linear-gradient(90deg, rgba(92,45,30,0.06) 0px, rgba(92,45,30,0.06) 1px, transparent 1px, transparent 60px),
                  repeating-linear-gradient(0deg, rgba(92,45,30,0.04) 0px, rgba(92,45,30,0.04) 1px, transparent 1px, transparent 80px)
                `,
              }}
            />
            <div
              className="absolute font-display text-center"
              style={{
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "clamp(1rem, 3vw, 2rem)",
                color: "rgba(212,160,23,0.15)",
                letterSpacing: "0.3em",
              }}
            >
              THE RESERVE · EST. 1924
            </div>

            {/* Architectural details */}
            {[
              { x: "10%", y: "20%", w: "25%", h: "60%", label: "BAR AREA" },
              { x: "40%", y: "15%", w: "20%", h: "70%", label: "DANCE FLOOR" },
              { x: "65%", y: "25%", w: "30%", h: "50%", label: "DINING" },
            ].map(({ x, y, w, h, label }) => (
              <div
                key={label}
                className="absolute"
                style={{
                  left: x,
                  top: y,
                  width: w,
                  height: h,
                  border: "1px solid rgba(212,160,23,0.1)",
                  borderRadius: "2px",
                }}
              >
                <span
                  className="absolute font-ui"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.3em",
                    color: "rgba(212,160,23,0.25)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}

            {/* Hotspots */}
            {ARCHITECTURAL_HOTSPOTS.map((spot, i) => (
              <div
                key={i}
                className="absolute cursor-trigger"
                style={{ left: spot.x, top: spot.y, transform: "translate(-50%, -50%)", zIndex: 5 }}
                onMouseEnter={() => setActiveHotspot(i)}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                {/* Pulse ring */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1.5px solid var(--speak-amber)",
                    background:
                      activeHotspot === i
                        ? "rgba(212,160,23,0.15)"
                        : "rgba(212,160,23,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    animation: "ember-pulse 2.5s ease-in-out infinite",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--speak-amber)",
                    }}
                  />
                </div>

                {/* Tooltip */}
                {activeHotspot === i && (
                  <div
                    className="absolute glass-card p-4"
                    style={{
                      bottom: "50px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      minWidth: "200px",
                      background: "rgba(13,10,14,0.95)",
                      border: "1px solid rgba(212,160,23,0.3)",
                      animation: "fadeInUp 0.25s ease forwards",
                      zIndex: 20,
                    }}
                  >
                    <div
                      className="font-editorial"
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--speak-amber)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {spot.label}
                    </div>
                    <div
                      className="font-ui text-xs mt-1"
                      style={{ color: "rgba(201,168,76,0.7)", lineHeight: 1.5 }}
                    >
                      {spot.description}
                    </div>
                    <div
                      className="font-body text-xs mt-2"
                      style={{
                        color: "rgba(201,168,76,0.45)",
                        fontStyle: "italic",
                      }}
                    >
                      {spot.detail}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHOTO GALLERY ─── */}
      <section id="gallery" className="py-60 md:py-80 px-6 speak-reveal relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-32 flex items-end justify-between">
            <CinematicText
              text="The Reserve"
              tag="h2"
              className="font-display"
              style={{
                fontSize: "clamp(3rem, 8vw, 8rem)",
                color: "var(--color-cream)",
                lineHeight: 0.9,
              }}
              splitBy="words"
            />
            <div
              className="font-ui text-xs hidden md:block text-right"
              style={{
                color: "rgba(212,160,23,0.5)",
                letterSpacing: "0.3em",
                maxWidth: "25ch",
                lineHeight: 1.8,
              }}
            >
              INTIMATE · IMMERSIVE ·<br />
              UNFORGETTABLE
            </div>
          </div>

          <ParallaxPhotoGallery
            venue="speakeasy"
            images={[
              {
                src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1400&q=85",
                alt: "The Velvet Lounge Mixology",
                label: "Bespoke Mixology",
              },
              {
                src: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=900&q=80",
                alt: "Vault Jazz Stage",
                label: "Live Jazz Stage",
              },
              {
                src: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=900&q=80",
                alt: "Candlelit Dining Space",
                label: "Intimate Dining",
              },
              {
                src: "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=1200&q=85",
                alt: "Craft Cocktail Details",
                label: "1924 Details",
              },
              {
                src: "https://images.unsplash.com/photo-1436018626274-89acd1d6ec9d?w=900&q=80",
                alt: "Vault Ceremony Setup",
                label: "The Vault Ceremony",
              },
              {
                src: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=85",
                alt: "Velvet Draping and Neon ambiance",
                label: "Late Night Ambiance",
              },
            ]}
          />
        </div>
      </section>

      {/* ─── SCROLLING QUOTE ─── */}
      <ScrollingQuote
        venue="speakeasy"
        quote="A night they'll never tell."
        attribution="The Reserve"
        rotate={1.5}
      />

      {/* ─── AMBIANCE SECTION ─── */}
      <section
        className="speak-reveal py-60 md:py-80 px-6 relative z-10"
        style={{ background: "rgba(155,28,28,0.05)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 80% 50%, rgba(107,31,58,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative">
          <div
            style={{
              height: "500px",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1542282811-943ef1a977c3?w=1200&q=80"
              alt="Moody speakeasy ambiance"
              fill
              className="object-cover"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(13,10,14,0.9) 0%, rgba(92,45,30,0.4) 40%, rgba(13,10,14,0.8) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 30% 40%, rgba(155,28,28,0.25) 0%, transparent 60%)",
                animation: "ember-pulse 4s ease-in-out infinite",
              }}
            />
            <div
              className="absolute font-display"
              style={{
                bottom: "30px",
                left: "30px",
                fontSize: "3rem",
                color: "rgba(212,160,23,0.35)",
                lineHeight: 1,
                textShadow: "0 4px 20px rgba(0,0,0,0.8)",
              }}
            >
              &ldquo;Exclusive
              <br />
              means it&apos;s
              <br />
              yours.&rdquo;
            </div>
          </div>

          <div>
            <div
              className="font-ui text-xs mb-10"
              style={{
                color: "rgba(212,160,23,0.6)",
                letterSpacing: "0.4em",
              }}
            >
              THE EXPERIENCE
            </div>
            <h2
              className="font-display mb-12"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                color: "var(--color-cream)",
                lineHeight: 1.3,
              }}
            >
              Space for Every
              <br />
              Guest Who Matters.
              <br />
              <span style={{ color: "var(--speak-velvet)" }}>Nothing More.</span>
            </h2>
            <p
              className="font-body mb-8"
              style={{ color: "rgba(201,168,76,0.65)", fontSize: "1rem" }}
            >
              The Vault holds up to 200 guests in an atmosphere that actually
              makes your wedding feel like an <em>event</em>. Original 1924
              exposed brick, cast-iron columns, velvet draping, and a full
              bespoke cocktail program curated by our in-house mixologist.
              Exclusive rental means this night belongs entirely to you.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { stat: "200", label: "Guest Capacity" },
                { stat: "1924", label: "Year Built" },
                { stat: "4", label: "Private Rooms" },
                { stat: "∞", label: "Atmosphere" },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <div
                    className="font-editorial"
                    style={{
                      fontSize: "2.5rem",
                      color: "var(--speak-amber)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {stat}
                  </div>
                  <div
                    className="font-ui"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.25em",
                      color: "rgba(201,168,76,0.4)",
                      marginTop: "4px",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── BAR PROGRAM ─── */}
      <section className="speak-reveal py-60 md:py-80 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div
            className="font-ui text-xs mb-4"
            style={{ color: "rgba(212,160,23,0.6)", letterSpacing: "0.4em" }}
          >
            CURATED BY OUR IN-HOUSE MIXOLOGIST
          </div>
          <h2
            className="font-display mb-16"
            style={{
              fontSize: "clamp(3rem, 7vw, 6rem)",
              color: "var(--color-cream)",
              lineHeight: 1.3,
            }}
          >
            The Bar That
            <br />
            Makes the Night.
          </h2>
          <div className="ornament-divider my-8" style={{ maxWidth: "300px", margin: "32px auto" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <polygon points="8,1 10,6 15,6 11,10 13,15 8,12 3,15 5,10 1,6 6,6" />
            </svg>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                name: "The Prohibition",
                desc: "Rye whiskey, black walnut bitters, honey syrup, smoked ice",
                price: "$18/guest",
              },
              {
                name: "The Velvet",
                desc: "Elderflower gin, lychee, rose water, champagne float",
                price: "$16/guest",
              },
              {
                name: "The Vault Mule",
                desc: "Bourbon, ginger beer, candied ginger, gold dust rim",
                price: "$15/guest",
              },
            ].map((cocktail) => (
              <div
                key={cocktail.name}
                className="glass-card p-8 cursor-trigger"
                style={{
                  background: "rgba(13,10,14,0.7)",
                  border: "1px solid rgba(212,160,23,0.12)",
                  textAlign: "center",
                  transition: "border-color 0.3s ease, transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(212,160,23,0.4)";
                  el.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(212,160,23,0.12)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="font-display mb-3"
                  style={{ fontSize: "1.8rem", color: "var(--speak-amber)" }}
                >
                  {cocktail.name}
                </div>
                <p
                  className="font-body text-sm mb-4"
                  style={{
                    color: "rgba(201,168,76,0.55)",
                    fontStyle: "italic",
                    lineHeight: 1.6,
                    maxWidth: "none",
                  }}
                >
                  {cocktail.desc}
                </p>
                <div
                  className="font-ui text-xs"
                  style={{
                    color: "rgba(212,160,23,0.7)",
                    letterSpacing: "0.2em",
                  }}
                >
                  {cocktail.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BUDGET SANDBOX ─── */}
      <section id="sandbox" className="speak-reveal py-60 md:py-80 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-32">
            <div
              className="font-ui text-xs mb-10"
              style={{ color: "rgba(212,160,23,0.6)", letterSpacing: "0.4em" }}
            >
              TRANSPARENT · ALL-IN PRICING
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: "var(--color-cream)",
                lineHeight: 1.3,
              }}
            >
              Your Night,
              <br />
              Your Number.
            </h2>
          </div>
          <div className="mt-12">
            <BudgetSandbox venue="speakeasy" />
          </div>
        </div>
      </section>

      {/* ─── MOOD BOARD ─── */}
      <section
        className="speak-reveal py-60 md:py-80 px-6 relative z-10"
        style={{ background: "rgba(155,28,28,0.04)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-32">
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: "var(--color-cream)",
                lineHeight: 1.3,
              }}
            >
              Your Aesthetic.
              <br />
              Your Rules.
            </h2>
          </div>
          <div className="mt-12">
            <MoodBoard venue="speakeasy" />
          </div>
        </div>
      </section>

      {/* ─── CONCIERGE ─── */}
      <section className="speak-reveal py-60 md:py-80 px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-20">
            <div
              className="font-ui text-xs mb-6"
              style={{ color: "rgba(212,160,23,0.6)", letterSpacing: "0.4em" }}
            >
              ANONYMOUS · INSTANT
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: "var(--color-cream)",
                lineHeight: 1,
              }}
            >
              The Invisible
              <br />
              Steward.
            </h2>
          </div>
          <div className="mt-12">
            <ConciergeChatWidget venue="speakeasy" />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="py-16 px-6 text-center"
        style={{
          borderTop: "1px solid rgba(212,160,23,0.1)",
          background: "rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="font-display mb-3"
          style={{ fontSize: "2.5rem", color: "var(--speak-amber)" }}
        >
          Last Call Wedding Co.
        </div>
        <div
          className="font-ui text-xs"
          style={{
            color: "rgba(212,160,23,0.4)",
            letterSpacing: "0.3em",
          }}
        >
          THE RANCH · THE RESERVE · TWO VENUES. ONE UNFORGETTABLE DAY.
        </div>
        <div
          className="font-ui text-xs mt-6"
          style={{ color: "rgba(212,160,23,0.2)" }}
        >
          © 2026 Last Call Wedding Co. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
