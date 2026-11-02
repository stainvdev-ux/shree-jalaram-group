"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { scene } from "@/lib/scene";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Lenis runs on GSAP's ticker, so smooth scroll, ScrollTrigger and every
// tween share one clock; the WebGL scene reads scroll velocity from it too.
function LenisGsapSync() {
  const lenis = useLenis(ScrollTrigger.update);

  useEffect(() => {
    if (!lenis) return;
    const tick = (time: number) => {
      lenis.raf(time * 1000);
      scene.scrollVelocity = lenis.velocity;
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, [lenis]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scene.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onLeave = () => {
      scene.pointer.x = 0;
      scene.pointer.y = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.95, anchors: true }}>
      {children}
      <LenisGsapSync />
    </ReactLenis>
  );
}
