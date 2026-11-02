"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import * as THREE from "three";
import { TLink } from "@/components/Transition";
import { onIntro } from "@/lib/intro";
import { milestoneX, progressForX, ribbonPoint, P_INTRO_END, P_RIBBON_START } from "@/lib/ribbon";
import { scene } from "@/lib/scene";
import { getVenture, logo, milestones, photo } from "@/lib/content";

const n = milestones.length;
const xs = milestones.map((_, i) => milestoneX(i, n));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<(HTMLButtonElement | null)[]>([]);
  const yearEls = useRef<(HTMLButtonElement | null)[]>([]);
  const fill = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();
  const progress = useRef(0);

  /** Scroll position (px) at which milestone i sits at screen centre. */
  const scrollFor = useCallback((i: number) => {
    const el = root.current;
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return top + progressForX(xs[i]) * (el.offsetHeight - window.innerHeight);
  }, []);

  // force: works even while the drawer has paused Lenis.
  const goTo = useCallback((i: number) => lenis?.scrollTo(scrollFor(i), { duration: 1.6, force: true }), [lenis, scrollFor]);

  useGSAP(
    () => {
      scene.mode = "journey";
      scene.accent = "";
      scene.dim = 1;

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          progress.current = p;
          scene.progress = p;
          if (intro.current) {
            const o = 1 - smooth(0, P_INTRO_END * 0.9, p);
            intro.current.style.opacity = String(o);
            intro.current.style.transform = `translate3d(0, ${-60 * (1 - o)}px, 0)`;
            intro.current.style.visibility = o < 0.01 ? "hidden" : "visible";
          }
          if (hud.current) {
            const o = smooth(P_RIBBON_START - 0.03, P_RIBBON_START + 0.01, p);
            hud.current.style.opacity = String(o);
            hud.current.style.visibility = o < 0.01 ? "hidden" : "visible";
          }
          if (fill.current) fill.current.style.transform = `scaleX(${clamp01((p - P_RIBBON_START) / (1 - P_RIBBON_START))})`;
        },
        onEnter: () => {
          scene.mode = "journey";
          scene.dim = 1;
        },
        onEnterBack: () => {
          scene.mode = "journey";
          scene.dim = 1;
        },
      });

      // Intro lines rise in once the preloader has lifted.
      const split = SplitText.create(".intro__line", { type: "lines", mask: "lines" });
      const tl = gsap.timeline({ paused: true });
      tl.from(split.lines, { yPercent: 110, duration: 1.4, ease: "expo.out", stagger: 0.12, delay: 0.6 }).from(
        ".intro__cue",
        { autoAlpha: 0, y: 20, duration: 1, ease: "power3.out" },
        "-=0.8",
      );
      gsap.set(".intro__lines", { autoAlpha: 1 });
      const stop = onIntro(() => tl.play());
      return () => stop();
    },
    { scope: root },
  );

  // Every frame (from the camera rig): project milestones to the screen.
  useEffect(() => {
    const v = new THREE.Vector3();
    const pt = { x: 0, y: 0, z: 0 };
    let active = -1;
    scene.overlay = (camera, t) => {
      const st = stage.current;
      if (!st) return;
      const w = st.clientWidth;
      const h = st.clientHeight;
      const show = progress.current > P_RIBBON_START - 0.04;
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < n; i++) {
        const el = nodeEls.current[i];
        if (!el) continue;
        ribbonPoint(xs[i], 0, t, pt);
        v.set(pt.x, pt.y, pt.z).project(camera);
        const sx = (v.x * 0.5 + 0.5) * w;
        const sy = (-v.y * 0.5 + 0.5) * h;
        const onScreen = show && v.z < 1 && sx > -260 && sx < w + 260;
        el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
        el.style.visibility = onScreen ? "visible" : "hidden";
        const d = Math.abs(sx - w / 2);
        if (onScreen && d < bestD) {
          bestD = d;
          best = i;
        }
      }
      const next = bestD < w * 0.24 ? best : -1;
      if (next !== active) {
        if (active >= 0) {
          nodeEls.current[active]?.classList.remove("is-active");
          yearEls.current[active]?.classList.remove("is-active");
        }
        if (next >= 0) {
          nodeEls.current[next]?.classList.add("is-active");
          yearEls.current[next]?.classList.add("is-active");
        }
        active = next;
      }
    };
    return () => {
      scene.overlay = null;
    };
  }, []);

  // Drawer: lock scroll, Esc to close.
  useEffect(() => {
    if (open === null) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, lenis]);

  const m = open !== null ? milestones[open] : null;
  const venture = m?.venture ? getVenture(m.venture) : undefined;

  return (
    <section ref={root} className="journey" id="journey" aria-label="Our journey since 1977">
      <div ref={stage} className="journey__stage">
        <div ref={intro} className="intro">
          <div className="intro__lines" style={{ visibility: "hidden" }}>
            <p className="intro__line intro__line--a">Explore nearly five decades of</p>
            <h1 className="intro__line intro__line--b">ventures and milestones</h1>
            <p className="intro__line intro__line--c">that have shaped our story</p>
          </div>
          <button type="button" className="intro__cue" onClick={() => goTo(0)}>
            <svg viewBox="0 0 260 40" aria-hidden="true" className="wave">
              <path d="M2 20 C 40 20, 60 6, 95 14 S 150 34, 185 22 S 230 12, 258 20" />
              <path d="M2 20 C 50 22, 70 32, 110 24 S 160 6, 200 16 S 240 26, 258 20" />
              <circle cx="2" cy="20" r="2.5" />
              <circle cx="258" cy="20" r="2.5" />
            </svg>
            <span>Scroll to discover</span>
          </button>
        </div>

        <div className="nodes">
          {milestones.map((ms, i) => (
            <button
              key={i}
              ref={(el) => {
                nodeEls.current[i] = el;
              }}
              type="button"
              className={`node node--${i % 2 ? "low" : "high"}`}
              style={{ visibility: "hidden" }}
              onClick={() => setOpen(i)}
              onFocus={() => goTo(i)}
              aria-label={`${ms.year}: ${ms.title}. Open story`}
            >
              <span className="node__ring" aria-hidden="true">
                <i />
                <i />
              </span>
              <span className="node__stem" aria-hidden="true" />
              <span className="node__year">{ms.year}</span>
              <span className="node__card" aria-hidden="true">
                <span className="node__title">{ms.title}</span>
                <span className="node__tag">{ms.tag}</span>
              </span>
            </button>
          ))}
        </div>

        <div ref={hud} className="journey__hud" style={{ visibility: "hidden" }}>
          <p className="journey__hint">Click a ring to open its story</p>
          <div className="scrubber" role="group" aria-label="Jump to a year">
            <div className="scrubber__track" aria-hidden="true">
              <div ref={fill} className="scrubber__fill" />
            </div>
            {milestones.map((ms, i) => (
              <button
                key={i}
                ref={(el) => {
                  yearEls.current[i] = el;
                }}
                type="button"
                className="scrubber__year"
                style={{ left: `${(progressForX(xs[i]) - P_RIBBON_START) / (1 - P_RIBBON_START) * 100}%` }}
                onClick={() => goTo(i)}
                tabIndex={-1}
              >
                <i aria-hidden="true" />
                <span>{ms.year}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`drawer${m ? " is-open" : ""}`} aria-hidden={!m}>
        <button type="button" className="drawer__scrim" tabIndex={-1} aria-label="Close story" onClick={() => setOpen(null)} />
        <aside className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          {m && (
            <>
              <button type="button" className="drawer__close" onClick={() => setOpen(null)} aria-label="Close story" autoFocus>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
              <p className="drawer__meta">
                <span>{m.year}</span>
                <span className="tag">{m.tag}</span>
              </p>
              <h2 id="drawer-title" className="drawer__title">
                {m.title}
              </h2>
              <p className="drawer__text">{m.text}</p>
              {venture && (
                <TLink href={`/ventures/${venture.slug}`} className="drawer__venture" data-cursor="view">
                  <span className="drawer__photo">
                    <Image src={photo(venture.slug)} alt="" fill sizes="(max-width: 768px) 90vw, 420px" />
                  </span>
                  <span className="drawer__vrow">
                    <span className="drawer__logo">
                      <Image src={logo(venture.slug)} alt="" width={64} height={64} />
                    </span>
                    <span>
                      <strong>{venture.name}</strong>
                      <small>Explore the venture →</small>
                    </span>
                  </span>
                </TLink>
              )}
              {m.href && (
                <TLink href={m.href} className="btn">
                  <span>About the Group</span>
                  <i aria-hidden="true">→</i>
                </TLink>
              )}
              <div className="drawer__nav">
                <button type="button" disabled={open === 0} onClick={() => open !== null && (setOpen(open - 1), goTo(open - 1))}>
                  ← Previous
                </button>
                <button type="button" disabled={open === n - 1} onClick={() => open !== null && (setOpen(open + 1), goTo(open + 1))}>
                  Next →
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
