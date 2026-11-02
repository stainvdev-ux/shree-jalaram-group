"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { onIntro } from "@/lib/intro";
import { scene, setAmbient } from "@/lib/scene";

/** Inner pages: park the camera somewhere along the ribbon in ambient mode. */
export function AmbientScene({ x = 30, tone = 0.5, accent = "", dim = 0.75 }: { x?: number; tone?: number; accent?: string; dim?: number }) {
  useEffect(() => {
    setAmbient({ x, tone, accent, dim });
  }, [x, tone, accent, dim]);
  return null;
}

/** Fade the particles while a section (e.g. a text-heavy block) is on screen. */
export function useSceneDim(ref: RefObject<HTMLElement | null>, dim: number) {
  useGSAP(() => {
    if (!ref.current) return;
    let prev = scene.dim;
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => {
        if (self.isActive) {
          prev = scene.dim;
          scene.dim = dim;
        } else scene.dim = prev;
      },
    });
  }, [dim]);
}

/** Masked line-by-line reveal using GSAP SplitText. */
export function SplitReveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  intro = false,
  start = "top 85%",
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  intro?: boolean; // wait for the preloader instead of scroll
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { autoAlpha: 1 });
      let stop = () => {};
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          const tween = gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.08,
            delay,
            paused: true,
          });
          if (intro) {
            stop = onIntro(() => tween.play());
          } else {
            ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => tween.play() });
          }
          return tween;
        },
      });
      return () => stop();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}

/** Fade/slide children in as they enter. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 40,
  intro = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  intro?: boolean;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const tween = gsap.from(ref.current, { y, autoAlpha: 0, duration: 1.2, ease: "expo.out", delay, paused: true });
      if (intro) return onIntro(() => tween.play());
      ScrollTrigger.create({ trigger: ref.current, start: "top 90%", once: true, onEnter: () => tween.play() });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function ScrubText({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const split = SplitText.create(ref.current, { type: "words", wordsClass: "scrub-word" });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}

/** Count up to a number when it scrolls into view. */
export function Counter({ value, suffix = "", grouping = true }: { value: number; suffix?: string; grouping?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const obj = { v: 0 };
      const fmt = (n: number) => (grouping ? Math.round(n).toLocaleString("en-IN") : String(Math.round(n)));
      gsap.to(obj, {
        v: value,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = fmt(obj.v) + suffix;
        },
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      0{suffix}
    </span>
  );
}

/**
 * An endless horizontal band. It drifts on its own and speeds up / reverses
 * with scroll velocity, the horizontal motion echoing the venture rail.
 */
export function Marquee({ items, reverse = false, className }: { items: string[]; reverse?: boolean; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      let x = 0;
      let dir = reverse ? 1 : -1;
      const tick = (_t: number, dt: number) => {
        const half = el.scrollWidth / 2;
        const v = scene.scrollVelocity;
        if (Math.abs(v) > 0.3) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
        const speed = 0.6 + Math.min(Math.abs(v), 40) * 0.25;
        x += dir * speed * (dt / 16.67);
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        el.style.transform = `translate3d(${x}px,0,0)`;
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  const row = (key: string) => (
    <div className="marquee__row" key={key} aria-hidden={key === "b"}>
      {items.map((it) => (
        <span className="marquee__item" key={key + it}>
          {it}
          <i aria-hidden="true">✦</i>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className={`marquee ${className ?? ""}`}>
      <div ref={track} className="marquee__track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
