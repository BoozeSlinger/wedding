"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  text: string;
  tag?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  splitBy?: "words" | "chars" | "lines";
  trigger?: "scroll" | "mount";
  start?: string;
}

/**
 * CinematicText — A GSAP-powered text reveal component.
 * Splits text into individual chars or words, then animates them in
 * using a clip-path + translate reveal (like editorial / luxury brand sites).
 */
export default function CinematicText({
  text,
  tag: Tag = "div",
  className = "",
  style = {},
  delay = 0,
  stagger = 0.03,
  splitBy = "chars",
  trigger = "scroll",
  start = "top 88%",
}: Props) {
  const containerRef = useRef<HTMLElement>(null);

  const buildSpans = useCallback(() => {
    const units =
      splitBy === "chars"
        ? text.split("")
        : splitBy === "words"
        ? text.split(" ")
        : [text];

    return units.map((unit, i) => {
      const isSpace = unit === " ";
      return (
        <span
          key={i}
          style={{ overflow: "hidden", display: "inline-block" }}
          aria-hidden={i > 0 ? true : undefined}
        >
          <span
            className="reveal-unit"
            style={{
              display: "inline-block",
              willChange: "transform, opacity",
            }}
          >
            {isSpace ? "\u00A0" : unit}
          </span>
          {splitBy === "words" && i < units.length - 1 ? "\u00A0" : null}
        </span>
      );
    });
  }, [text, splitBy]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const units = el.querySelectorAll<HTMLElement>(".reveal-unit");

    const animProps = {
      opacity: 0,
      y: splitBy === "chars" ? "105%" : "60%",
      rotateX: splitBy === "chars" ? 8 : 0,
    };

    gsap.set(units, animProps);

    const anim = gsap.to(units, {
      opacity: 1,
      y: "0%",
      rotateX: 0,
      duration: splitBy === "chars" ? 0.7 : 0.9,
      ease: "power4.out",
      stagger,
      delay,
      ...(trigger === "scroll"
        ? {
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: "play none none none",
            },
          }
        : {}),
    });

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [delay, stagger, start, splitBy, trigger]);

  return (
    // Use a wrapping div cast so ref always types correctly,
    // then render Tag inside it (React renders Tag as the actual DOM element)
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={containerRef as any}
      className={className}
      style={{ perspective: "400px", ...style }}
      aria-label={text}
    >
      {buildSpans()}
    </Tag>
  );
}
