"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GalleryImage {
  src: string;
  alt: string;
  label?: string;
  /** Parallax speed 0–1. Higher = more movement. */
  depth?: number;
}

interface Props {
  images: GalleryImage[];
  venue: "rustic" | "speakeasy";
}

/**
 * ParallaxPhotoGallery — An asymmetric masonry-style gallery where each image
 * moves at a different scroll speed, creating genuine depth.
 * Each image is wrapped in a clip-path that reveals it as you scroll.
 */
export default function ParallaxPhotoGallery({ images, venue }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const accent =
    venue === "rustic"
      ? "rgba(196,146,42,0.8)"
      : "rgba(212,160,23,0.8)";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clip-path reveal for each cell
      gsap.utils.toArray<HTMLElement>(".gallery-cell").forEach((cell, i) => {
        gsap.fromTo(
          cell,
          { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          {
            clipPath: "inset(0% 0 0 0)",
            opacity: 1,
            duration: 1.2,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: cell,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            delay: (i % 3) * 0.12,
          }
        );
      });

      // Parallax inner images — each image within its cell moves independently
      gsap.utils.toArray<HTMLElement>(".gallery-img-inner").forEach((img) => {
        const depth = parseFloat(img.dataset.depth || "0.15");
        gsap.fromTo(
          img,
          { y: `-${depth * 100}px` },
          {
            y: `${depth * 100}px`,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".gallery-cell"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // Label reveal
      gsap.utils.toArray<HTMLElement>(".gallery-label").forEach((label) => {
        gsap.fromTo(
          label,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: label.closest(".gallery-cell"),
              start: "top 80%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="gallery-grid w-full grid grid-cols-1 md:grid-cols-12 gap-3"
      style={{
        gridAutoRows: "auto",
      }}
    >
      {images.map((img, i) => {
        // Asymmetric layout: alternating large / tall / small cells
        const layouts = [
          { col: "md:col-span-7", aspect: "66.6%", depth: 0.18 }, // large landscape
          { col: "md:col-span-5", aspect: "120%", depth: 0.12 }, // tall portrait
          { col: "md:col-span-4", aspect: "100%", depth: 0.22 }, // square
          { col: "md:col-span-8", aspect: "56%", depth: 0.14 }, // wide landscape
          { col: "md:col-span-5", aspect: "110%", depth: 0.2 }, // tall portrait
          { col: "md:col-span-7", aspect: "75%", depth: 0.16 }, // medium landscape
        ];
        const layout = layouts[i % layouts.length];
        const depth = img.depth ?? layout.depth;

        return (
          <div
            key={i}
            className={`gallery-cell relative overflow-hidden col-span-1 ${layout.col}`}
            style={{
              paddingBottom: layout.aspect,
              borderRadius: "3px",
              background: venue === "rustic"
                ? "rgba(28,18,9,0.8)"
                : "rgba(13,10,14,0.8)",
            }}
          >
            {/* Inner image with parallax */}
            <div
              className="gallery-img-inner absolute"
              data-depth={String(depth)}
              style={{
                inset: `-${depth * 100}px 0`,
                overflow: "hidden",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
              />
              {/* Overlay gradient for depth */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    venue === "rustic"
                      ? "linear-gradient(to top, rgba(28,18,9,0.5) 0%, transparent 50%)"
                      : "linear-gradient(to top, rgba(13,10,14,0.6) 0%, transparent 50%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Label */}
            {img.label && (
              <div
                className="gallery-label absolute bottom-3 left-4"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  color: accent,
                  textTransform: "uppercase",
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                }}
              >
                {img.label}
              </div>
            )}

            {/* Hover shimmer */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
                pointerEvents: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "0";
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
