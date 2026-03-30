"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BudgetSandbox from "@/components/interactive/BudgetSandbox";
import MoodBoard from "@/components/interactive/MoodBoard";
import ConciergeChatWidget from "@/components/interactive/ConciergeChatWidget";
import VenueNav from "@/components/ui/VenueNav";
import CinematicText from "@/components/ui/CinematicText";
import ParallaxPhotoGallery from "@/components/ui/ParallaxPhotoGallery";
import ScrollingQuote from "@/components/ui/ScrollingQuote";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS = [
  { value: "12", suffix: "+", label: "Acres of Land" },
  { value: "350", suffix: "", label: "Guest Capacity" },
  { value: "8", suffix: "", label: "Ceremony Sites" },
  { value: "100%", suffix: "", label: "Open-Air Catering" },
];

export default function RusticVenuePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        ".hero-headline",
        { opacity: 0, y: 60, skewY: 2 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: "power4.out", delay: 0.3 }
      );
      gsap.fromTo(
        ".hero-sub",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.7 }
      );

      // Horizontal gallery scroll
      const gallery = galleryRef.current;
      if (gallery) {
        const items = gallery.querySelectorAll(".gallery-item");
        gsap.fromTo(
          items,
          { x: 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gallery,
              start: "top 80%",
              end: "bottom 20%",
            },
          }
        );
      }

      // Stats counter animation
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            el.classList.add("animate-in");
          },
        });
      });

      // Section reveal
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });

      // Parallax background layers
      gsap.utils.toArray<HTMLElement>(".parallax-layer").forEach((layer) => {
        const speed = Number(layer.dataset.speed) || 0.3;
        gsap.to(layer, {
          y: `${speed * 100}%`,
          ease: "none",
          scrollTrigger: {
            trigger: layer.parentElement,
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
      className="venue-rustic min-h-screen overflow-x-hidden"
      style={{ background: "var(--rustic-dark)" }}
    >
      <VenueNav venue="rustic" />

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 duration-1500 transition-transform">
          <Image 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2048" 
            alt="The Ranch Grounds" 
            fill 
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-stone-950/60 via-stone-950/30 to-stone-950" />
        </div>

        {/* Brand Watermark Overlay */}
        <div className="absolute top-16 md:top-24 left-1/2 -translate-x-1/2 z-0 opacity-40 pointer-events-none">
          <Image 
            src="/logonobg.png"
            alt="Last Call Wedding Co."
            width={320}
            height={90}
            className="brightness-0 invert"
            priority
          />
        </div>

        {/* Background fire gradient */}
        <div
          className="absolute inset-0 parallax-layer"
          data-speed="0.15"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(196,146,42,0.1) 0%, rgba(255,107,53,0.05) 40%, transparent 70%)",
          }}
        />

        {/* Texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 3px,
              rgba(196,146,42,0.015) 3px,
              rgba(196,146,42,0.015) 4px
            )`,
          }}
        />

        <div className="relative text-center px-6 max-w-5xl mx-auto" style={{ zIndex: 2 }}>
          <div
            className="hero-sub font-ui text-xs tracking-[0.5em] mb-6"
            style={{ color: "rgba(196,146,42,0.6)" }}
          >
            VENUE A · THE RANCH · DRIPPING SPRINGS, TX
          </div>

          <h1
            className="hero-headline font-display"
            style={{
              fontSize: "clamp(4.6rem, 11.5vw, 11.5rem)",
              fontWeight: 800,
              color: "var(--color-parchment)",
              lineHeight: 0.9,
              textShadow: "0 10px 80px rgba(196,146,42,0.4)",
            }}
          >
            Where Your
            <br />
            <span style={{ color: "var(--rustic-primary)" }}>Story</span> Gets
            <br />
            Its Sky.
          </h1>

          <p
            className="hero-sub font-body mt-8 mx-auto"
            style={{
              color: "rgba(212,184,150,0.8)",
              fontSize: "1.2rem",
              maxWidth: "50ch",
              lineHeight: 1.7,
            }}
          >
            You&apos;ve looked at a dozen venues. None of them felt like
            <em> yours</em>. Twelve acres of rugged Texas landscape,
            golden-hour light that photographers drive hours for, and open-fire
            catering that turns dinner into the thing guests talk about for
            years. This is it.
          </p>

          <div className="hero-sub flex justify-center gap-4 mt-10">
            <a
              href="#sandbox"
              className="btn-primary cursor-trigger"
              style={{
                borderColor: "var(--rustic-primary)",
                color: "var(--rustic-primary)",
              }}
            >
              <span>See Your Price</span>
            </a>
            <a
              href="#gallery"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 36px",
                color: "rgba(212,184,150,0.6)",
                border: "1px solid rgba(212,184,150,0.2)",
                borderRadius: "2px",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor =
                  "rgba(212,184,150,0.5)";
                (e.target as HTMLElement).style.color =
                  "rgba(212,184,150,0.9)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor =
                  "rgba(212,184,150,0.2)";
                (e.target as HTMLElement).style.color =
                  "rgba(212,184,150,0.6)";
              }}
            >
              Tour The Grounds
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "rgba(196,146,42,0.4)" }}
        >
          <span
            className="font-ui"
            style={{ fontSize: "0.6rem", letterSpacing: "0.4em" }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: "1px",
              height: "50px",
              background:
                "linear-gradient(to bottom, rgba(196,146,42,0.4), transparent)",
              animation: "float-gentle 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section
        className="reveal-section py-16"
        style={{
          borderTop: "1px solid rgba(196,146,42,0.12)",
          borderBottom: "1px solid rgba(196,146,42,0.12)",
          background: "rgba(196,146,42,0.04)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, suffix, label }) => (
            <div key={label} className="text-center">
              <div
                className="stat-value font-editorial"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  color: "var(--rustic-primary)",
                  letterSpacing: "0.05em",
                }}
              >
                {value}
                <span style={{ fontSize: "0.6em", color: "var(--rustic-warm)" }}>
                  {suffix}
                </span>
              </div>
              <div
                className="font-ui mt-1"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  color: "rgba(212,184,150,0.5)",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PHOTO GALLERY ─── */}
      <section id="gallery" className="py-60 md:py-80 px-6 relative z-10 bg-linear-to-b from-stone-950 to-[#1c1209]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-32 flex flex-col md:flex-row items-end justify-between gap-12">
            <CinematicText
            text="The Grounds"
            tag="h2"
            className="font-display"
            style={{
              fontSize: "clamp(3rem, 8vw, 8rem)",
              color: "var(--color-cream)",
              lineHeight: 1.3,
            }}
            splitBy="words"
          />
            <div
              className="font-ui text-xs hidden md:block"
              style={{
                color: "rgba(196,146,42,0.5)",
                letterSpacing: "0.3em",
                maxWidth: "25ch",
                lineHeight: 1.8,
              }}
            >
              ALL-INCLUSIVE ·<br />
              NO VENDOR FEES
            </div>
          </div>

          <ParallaxPhotoGallery
            venue="rustic"
            images={[
              {
                src: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=1400&q=85",
                alt: "Golden hour ranch ceremony looking toward the horizon",
                label: "THE CEREMONY FIELD",
              },
              {
                src: "https://images.unsplash.com/photo-1475761362611-ec598571a7ce?w=1200&q=85",
                alt: "Dramatic barn interior with warm lighting and exposed wood",
                label: "THE RUSTIC RECEPTION",
              },
              {
                src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85",
                alt: "Long wooden tables with artisan floral arrangements",
                label: "ARTISAN DINING",
              },
              {
                src: "https://images.unsplash.com/photo-1512403614274-1224f8d975db?w=1400&q=85",
                alt: "A wide-angle sunset view of the Texas ranch",
                label: "RANCH VISTAS",
              },
              {
                src: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1200&q=85",
                alt: "A gathering around the stone fire circle at night",
                label: "THE FIRE CIRCLE",
              },
              {
                src: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=1200&q=85",
                alt: "Open-air cocktail lounge with leather and wood accents",
                label: "COCKTAIL HOUR",
              },
            ]}
          />
        </div>
      </section>

      {/* ─── SCROLLING QUOTE ─── */}
      <ScrollingQuote
        venue="rustic"
        quote="The food becomes the legend."
        attribution="Last Call Ranch Kitchen"
        rotate={-1.8}
      />

      {/* ─── CATERING FEATURE ─── */}
      <section
        className="reveal-section py-60 md:py-80 px-6 relative overflow-hidden z-10"
        style={{ background: "rgba(196,146,42,0.04)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 10% 50%, rgba(255,107,53,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative">
          <div className="speak-reveal">
            <div
              className="font-ui text-xs mb-10"
              style={{
                color: "rgba(196,146,42,0.6)",
                letterSpacing: "0.4em",
              }}
            >
              OPEN-FIRE · FARM-TO-TABLE · ALL-INCLUSIVE
            </div>
            <h2
              className="font-display mb-10"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                color: "var(--color-cream)",
                lineHeight: 1.3,
              }}
            >
              Where the 
              <br />
              Land Meets 
              <br />
              the Legacy.
            </h2>
            <p
              className="font-body mb-10"
              style={{ color: "rgba(212,184,150,0.7)", fontSize: "1.05rem" }}
            >
              The food at a wedding either disappears from memory or becomes the
              legend. Slow-smoked brisket carved tableside. Artisan s&apos;mores
              under a sky full of stars. Our pitmaster-led team doesn&apos;t do
              wedding catering — they do ranch feasts that happen to have a
              wedding at them.
            </p>
            <div className="space-y-4">
              {[
                "Pitmaster's Feast — Open-fire BBQ full service",
                "Garden to Table — Seasonal farm-fresh menus",
                "Cocktail Grazing Boards — Artisan Texas charcuterie",
                "The Midnight Snack — Late-night comfort bites",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--rustic-primary)",
                      marginTop: "8px",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="font-ui"
                    style={{
                      fontSize: "0.9rem",
                      color: "rgba(212,184,150,0.75)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature image */}
          <div
            className="relative w-full h-full"
            style={{ minHeight: "500px", borderRadius: "4px", overflow: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400&q=85" 
              alt="Open-Fire Feast"
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </div>
        </div>
      </section>

      {/* ─── BUDGET SANDBOX ─── */}
      <section id="sandbox" className="reveal-section py-60 md:py-80 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-32">
            <div
              className="font-ui text-xs mb-10"
              style={{ color: "rgba(196,146,42,0.6)", letterSpacing: "0.4em" }}
            >
              TRANSPARENT · ALL-IN PRICING
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                color: "var(--color-cream)",
                lineHeight: 1.3,
              }}
            >
              Your Story,
              <br />
              Your Budget.
            </h2>
          </div>
          <div className="mt-12">
            <BudgetSandbox venue="rustic" />
          </div>
        </div>
      </section>

      {/* ─── MOOD BOARD ─── */}
      <section className="reveal-section py-60 md:py-80 px-6 relative z-10" style={{ background: "rgba(28,18,9,0.3)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-32">
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                color: "var(--color-cream)",
                lineHeight: 1.3,
              }}
            >
              Visualise the 
              <br />
              Atmosphere.
            </h2>
          </div>
          <div className="mt-12">
            <MoodBoard venue="rustic" />
          </div>
        </div>
      </section>

      {/* ─── CONVERSATIONAL CONCIERGE ─── */}
      <section className="reveal-section py-60 md:py-80 px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-32">
            <div
              className="font-ui text-xs mb-10"
              style={{ color: "rgba(196,146,42,0.6)", letterSpacing: "0.4em" }}
            >
              YOUR DIGITAL CONCIERGE
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                color: "var(--color-cream)",
                lineHeight: 1,
              }}
            >
              Ready to
              <br />
              Details?
            </h2>
          </div>
          <div className="mt-12">
            <ConciergeChatWidget venue="rustic" />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="py-16 px-6 text-center"
        style={{
          borderTop: "1px solid rgba(196,146,42,0.12)",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="font-display mb-3"
          style={{
            fontSize: "2.5rem",
            color: "var(--rustic-primary)",
          }}
        >
          Last Call Wedding Co.
        </div>
        <div
          className="font-ui text-xs"
          style={{
            color: "rgba(196,146,42,0.4)",
            letterSpacing: "0.3em",
          }}
        >
          THE RANCH · THE RESERVE · TWO VENUES. ONE UNFORGETTABLE DAY.
        </div>
        <div
          className="font-ui text-xs mt-6"
          style={{ color: "rgba(196,146,42,0.25)" }}
        >
          © 2026 Last Call Wedding Co. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
