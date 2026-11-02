"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// A dot + ring cursor. Links/buttons grow the ring, [data-cursor="view"]
// shows a label, and [data-magnetic] elements lean toward the pointer.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });

    let magnet: HTMLElement | null = null;
    let seen = false;
    gsap.set([dot.current, ring.current], { autoAlpha: 0 });

    const onMove = (e: PointerEvent) => {
      if (!seen) {
        seen = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        gsap.to(magnet, { x: mx * 0.3, y: my * 0.3, duration: 0.6, ease: "power3.out" });
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const view = t.closest<HTMLElement>("[data-cursor]:not(html)");
      const link = t.closest("a, button, [role='button'], input, textarea, select, label");
      const m = t.closest<HTMLElement>("[data-magnetic]");
      if (m !== magnet) {
        if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
        magnet = m;
      }
      const root = document.documentElement;
      if (view) {
        root.dataset.cursor = "view";
        if (label.current) label.current.textContent = view.dataset.cursor === "view" ? "View" : view.dataset.cursor ?? "";
      } else if (link) {
        root.dataset.cursor = "link";
      } else {
        delete root.dataset.cursor;
      }
    };

    const onDown = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
    const onLeave = () => gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    const onEnter = () => gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span ref={label} />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
