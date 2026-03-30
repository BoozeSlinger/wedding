"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const RANCH_IMAGE = "/ranch_editorial_hero_1774868144903.png";
const RESERVE_IMAGE = "/reserve_editorial_hero_1774868160148.png";
const LOGO_SRC = "/logonobg.png";

export default function EditorialHero() {
  const router = useRouter();
  const [hovered, setHovered] = useState<"left" | "right" | null>(null);
  const [selected, setSelected] = useState<"left" | "right" | null>(null);
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const leftImgRef = useRef<HTMLDivElement>(null);
  const rightImgRef = useRef<HTMLDivElement>(null);
  const globalHeroTextRef = useRef<HTMLDivElement>(null);

  // Splash Refs
  const splashLeftRef = useRef<HTMLDivElement>(null);
  const splashRightRef = useRef<HTMLDivElement>(null);
  const splashLogoRef = useRef<HTMLDivElement>(null);
  const loaderBarRef = useRef<HTMLDivElement>(null);

  // Text Reveal Refs
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const ranchContentRef = useRef<HTMLDivElement>(null);
  const reserveContentRef = useRef<HTMLDivElement>(null);

  // ─── INITIAL SPLASH REVEAL ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsSplashComplete(true)
      });

      // 1. Initial State for Hero Text
      gsap.set([leftTextRef.current, rightTextRef.current, globalHeroTextRef.current], {
        opacity: 0,
        y: 20
      });

      // 2. The Load: 1px line
      tl.to(loaderBarRef.current, {
        width: "100%",
        duration: 1.5,
        ease: "power2.inOut"
      });

      // 3. The Fade: Logo & Loader
      tl.to([splashLogoRef.current, loaderBarRef.current], {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power2.in"
      });

      // 4. The Curtain Part
      tl.to(splashLeftRef.current, {
        x: "-100%",
        duration: 1.2,
        ease: "power4.inOut"
      }, "+=0.1");
      
      tl.to(splashRightRef.current, {
        x: "100%",
        duration: 1.2,
        ease: "power4.inOut"
      }, "<");

      // 5. Hero Text Reveal (Triggered as curtains part)
      tl.to([leftTextRef.current, rightTextRef.current, globalHeroTextRef.current], {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.8");
    });

    return () => ctx.revert();
  }, []);

  // ─── HOVER LOGIC ───
  useEffect(() => {
    if (!leftPanelRef.current || !rightPanelRef.current || selected || !isSplashComplete) return;

    const leftFlex = hovered === "left" ? 0.65 : hovered === "right" ? 0.35 : 0.5;
    const rightFlex = hovered === "right" ? 0.65 : hovered === "left" ? 0.35 : 0.5;

    gsap.to(leftPanelRef.current, {
      flexGrow: leftFlex,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.to(rightPanelRef.current, {
      flexGrow: rightFlex,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.to(leftImgRef.current, {
      scale: hovered === "left" ? 1.05 : 1,
      duration: 1.5,
      ease: "power2.out",
    });

    gsap.to(rightImgRef.current, {
      scale: hovered === "right" ? 1.05 : 1,
      duration: 1.5,
      ease: "power2.out",
    });

    gsap.to(leftPanelRef.current.querySelector(".overlay"), {
      opacity: hovered === "right" ? 0.6 : 0,
      duration: 0.6,
    });
    gsap.to(rightPanelRef.current.querySelector(".overlay"), {
      opacity: hovered === "left" ? 0.6 : 0,
      duration: 0.6,
    });
  }, [hovered, selected, isSplashComplete]);

  const handleSelect = (side: "left" | "right") => {
    if (selected || !isSplashComplete) return;
    setSelected(side);

    const tl = gsap.timeline({
      onComplete: () => {
        router.push(side === "left" ? "/venue/rustic" : "/venue/speakeasy");
      }
    });

    tl.to(globalHeroTextRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.inOut",
    });

    if (side === "left") {
      tl.to(leftPanelRef.current, {
        flexGrow: 1,
        duration: 0.8,
        ease: "power4.inOut",
      }, 0);
      tl.to(rightPanelRef.current, {
        flexGrow: 0,
        opacity: 0,
        x: "100%",
        duration: 0.8,
        ease: "power4.inOut",
      }, 0);
    } else {
      tl.to(rightPanelRef.current, {
        flexGrow: 1,
        duration: 0.8,
        ease: "power4.inOut",
      }, 0);
      tl.to(leftPanelRef.current, {
        flexGrow: 0,
        opacity: 0,
        x: "-100%",
        duration: 0.8,
        ease: "power4.inOut",
      }, 0);
    }

    tl.to(side === "left" ? ranchContentRef.current : reserveContentRef.current, {
      y: 0,
      duration: 1.2,
      ease: "power4.inOut",
    }, 0.2);

    tl.to(side === "left" ? leftImgRef.current : rightImgRef.current, {
      scale: 1,
      duration: 1.2,
      ease: "power4.inOut",
    }, 0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-stone-950 font-display"
    >
      {/* ─── SPLASH SCREEN PRE-LOADER ─── */}
      {!isSplashComplete && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Left Curtain */}
          <div 
            ref={splashLeftRef}
            className="absolute top-0 left-0 w-1/2 h-full bg-[#121212] flex items-center justify-end"
          />
          {/* Right Curtain */}
          <div 
            ref={splashRightRef}
            className="absolute top-0 right-0 w-1/2 h-full bg-[#121212] flex items-center justify-start"
          />

          {/* Logo & Loader Center Wrapper */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div ref={splashLogoRef} className="mb-6 flex flex-col items-center">
               <Image 
                src={LOGO_SRC}
                alt="Last Call Wedding Co."
                width={420}
                height={120}
                className="brightness-125 contrast-125"
                priority
              />
              <span className="font-editorial text-cream/40 text-[0.6rem] tracking-[1em] uppercase mt-2">
                Last Call Wedding Co.
              </span>
            </div>
            
            {/* 1px Loader line */}
            <div className="w-48 h-px bg-white/10 relative overflow-hidden mt-4">
              <div 
                ref={loaderBarRef}
                className="absolute top-0 left-0 h-full bg-[#d4a017] w-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── HERO CONTENT ─── */}
      <div className="relative flex w-full h-full">
        {/* Left Panel: THE RANCH */}
        <div 
          ref={leftPanelRef}
          className="relative flex-1 group cursor-pointer overflow-hidden border-r border-white/5"
          onMouseEnter={() => setHovered("left")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleSelect("left")}
        >
          <div ref={leftImgRef} className="absolute inset-0 transition-transform duration-1500">
            <Image 
              src={RANCH_IMAGE} 
              alt="The Ranch" 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <div 
            className="absolute inset-0 bg-[#050505]/80 transition-opacity duration-700 pointer-events-none" 
            style={{ opacity: hovered === "right" ? 1 : 0 }}
          />
          
          <div ref={leftTextRef} className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white z-10 transition-transform duration-700 group-hover:scale-105">
            <h2 className="font-editorial text-5xl md:text-7xl lg:text-8xl tracking-widest uppercase text-[#c4922a] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">The Ranch</h2>
            <div className="mt-8 overflow-hidden h-px w-20 bg-[#c4922a]/30" />
            <p className="mt-8 font-ui text-[0.7rem] tracking-[0.3em] uppercase opacity-0 transition-all duration-700 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
              Wildheart • Open Skies • Freedom
            </p>
          </div>
        </div>

        {/* Right Panel: THE RESERVE */}
        <div 
          ref={rightPanelRef}
          className="relative flex-1 group cursor-pointer overflow-hidden"
          onMouseEnter={() => setHovered("right")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleSelect("right")}
        >
          <div ref={rightImgRef} className="absolute inset-0 transition-transform duration-1500">
            <Image 
              src={RESERVE_IMAGE} 
              alt="The Reserve" 
              fill 
              className="object-cover"
              priority
            />
          </div>
          <div 
            className="absolute inset-0 bg-[#0d0202]/85 transition-opacity duration-700 pointer-events-none" 
            style={{ opacity: hovered === "left" ? 1 : 0 }}
          />

          <div ref={rightTextRef} className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white z-10 transition-transform duration-700 group-hover:scale-105">
            <h2 className="font-editorial text-5xl md:text-7xl lg:text-8xl tracking-widest uppercase text-[#d4a017] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">The Reserve</h2>
            <div className="mt-8 overflow-hidden h-px w-20 bg-[#d4a017]/30" />
            <p className="mt-8 font-ui text-[0.7rem] tracking-[0.3em] uppercase opacity-0 transition-all duration-700 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
              Timeless • Underground • Elegance
            </p>
          </div>
        </div>
      </div>

      <div 
        ref={globalHeroTextRef}
        className="absolute top-12 md:top-20 left-1/2 -translate-x-1/2 z-20 text-center w-full px-8 pointer-events-none flex flex-col items-center justify-center gap-0"
      >
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
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white opacity-95 editorial-glow leading-none">
          Where your forever starts.
        </h1>
      </div>

      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        <div 
          ref={ranchContentRef}
          className="absolute inset-0 bg-[#1c1209] flex flex-col items-center justify-center translate-y-full"
        >
          <div className="max-w-2xl text-center">
            <span className="font-ui text-xs tracking-[0.8em] text-white/40 uppercase mb-8 block">Descending Into</span>
            <h3 className="font-editorial text-6xl md:text-8xl text-white tracking-[0.2em] mb-6">THE RANCH</h3>
            <p className="font-display text-4xl md:text-5xl text-[#c4922a] opacity-0 translate-y-4 transition-all duration-1000 delay-500 group-hover:opacity-100 group-hover:translate-y-0"
               style={{ opacity: selected === "left" ? 1 : 0, transform: selected === "left" ? "translateY(0)" : "translateY(20px)" }}>
              Open Skies · Wild Hearts
            </p>
          </div>
        </div>
        <div 
          ref={reserveContentRef}
          className="absolute inset-0 bg-[#0d0a0e] flex flex-col items-center justify-center translate-y-full"
        >
          <div className="max-w-2xl text-center">
            <span className="font-ui text-xs tracking-[0.8em] text-[#d4a017]/40 uppercase mb-8 block">Descending Into</span>
            <h3 className="font-editorial text-6xl md:text-8xl text-[#d4a017] tracking-[0.2em] mb-6 uppercase">THE RESERVE</h3>
            <p className="font-display text-4xl md:text-5xl text-white"
               style={{ opacity: selected === "right" ? 1 : 0, transform: selected === "right" ? "translateY(0)" : "translateY(20px)", transition: "all 1s ease 0.5s" }}>
              Underground Elegance
            </p>
          </div>
        </div>
      </div>

      {/* Floating UI Elements */}
      <div className="absolute top-10 left-10 z-10 pointer-events-none">
        <div className="font-display text-2xl text-white/20 uppercase tracking-[1em]">L·C</div>
      </div>
      
      <div className="absolute bottom-10 right-10 z-10 pointer-events-none">
        <div className="font-ui text-[0.6rem] text-white/30 uppercase tracking-[0.3em]">Last Call Wedding Co. © 2026</div>
      </div>
    </div>
  );
}
