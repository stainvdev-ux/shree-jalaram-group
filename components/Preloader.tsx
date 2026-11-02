"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { scene } from "@/lib/scene";
import { markIntroDone } from "@/lib/intro";

const KEY = "sjg-intro-seen";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!lenis) return;
      let seen = false;
      try {
        seen = sessionStorage.getItem(KEY) === "1";
      } catch {}
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const finish = () => {
        scene.intro = 1;
        markIntroDone();
        lenis.start();
        setGone(true);
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {}
      };

      if (seen || reduce) {
        gsap.to(root.current, { autoAlpha: 0, duration: 0.6, delay: 0.2, onComplete: finish });
        scene.intro = 1;
        return;
      }

      lenis.stop();
      const progress = { v: 0 };
      const fontsReady = document.fonts?.ready ?? Promise.resolve();

      const tl = gsap.timeline();
      tl.from(".preloader__mark img", { yPercent: 110, duration: 1, ease: "expo.out" })
        .from(".preloader__name span", { yPercent: 110, stagger: 0.04, duration: 0.9, ease: "expo.out" }, "-=0.7")
        .to(
          progress,
          {
            v: 100,
            duration: 2.2,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(progress.v)).padStart(3, "0");
              if (bar.current) bar.current.style.transform = `scaleX(${progress.v / 100})`;
            },
          },
          0.2,
        )
        .add(() => {
          tl.pause();
          fontsReady.then(() => tl.resume());
        })
        .to(".preloader__inner", { yPercent: -30, autoAlpha: 0, duration: 0.8, ease: "power3.in" })
        .add(() => {
          scene.intro = 1;
        })
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=0.25")
        .add(finish, "-=0.6");
    },
    { scope: root, dependencies: [lenis] },
  );

  if (gone) return null;

  return (
    <div ref={root} className="preloader" role="status" aria-label="Loading">
      <div className="preloader__inner">
        <div className="preloader__mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/group-mark-white.png" alt="" width={70} height={85} />
        </div>
        <div className="preloader__name" aria-hidden="true">
          {"SHREE JALARAM GROUP".split(" ").map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="preloader__meta">
          <span>Since 1977</span>
          <span>
            <span ref={count}>000</span>%
          </span>
        </div>
        <div className="preloader__track">
          <div ref={bar} className="preloader__bar" />
        </div>
      </div>
    </div>
  );
}
