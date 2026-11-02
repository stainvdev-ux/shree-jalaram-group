"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TLink } from "@/components/Transition";
import { FadeIn, SceneSetter, SplitReveal } from "@/components/ui/motion";
import { GOLD } from "@/lib/scene";
import { photo, ventures } from "@/lib/content";

// A list of ventures with a floating preview that trails the cursor.
export default function VenturesIndex() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      gsap.from(".vi__row", {
        y: 50,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".vi__list", start: "top 85%" },
      });

      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || !contextSafe) return;
      const px = gsap.quickTo(preview.current, "x", { duration: 0.6, ease: "power3" });
      const py = gsap.quickTo(preview.current, "y", { duration: 0.6, ease: "power3" });
      const rows = gsap.utils.toArray<HTMLElement>(".vi__row", root.current);

      const move = contextSafe((e: PointerEvent) => {
        px(e.clientX);
        py(e.clientY);
      });
      const enter = contextSafe((e: PointerEvent) => {
        const i = Number((e.currentTarget as HTMLElement).dataset.index);
        gsap.to(".vi__preview-inner", { yPercent: -100 * i, duration: 0.7, ease: "expo.out" });
        gsap.to(preview.current, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" });
      });
      const leave = contextSafe(() => gsap.to(preview.current, { autoAlpha: 0, scale: 0.85, duration: 0.4 }));

      window.addEventListener("pointermove", move);
      rows.forEach((r) => {
        r.addEventListener("pointerenter", enter);
        r.addEventListener("pointerleave", leave);
      });
      return () => {
        window.removeEventListener("pointermove", move);
        rows.forEach((r) => {
          r.removeEventListener("pointerenter", enter);
          r.removeEventListener("pointerleave", leave);
        });
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="vi">
      <SceneSetter shape={5} color={GOLD} x={2.1} y={0.4} scale={0.8} dim={0.6} />
      <section className="page-hero container">
        <FadeIn intro className="eyebrow" y={16}>
          ({String(ventures.length).padStart(2, "0")}) Ventures
        </FadeIn>
        <SplitReveal as="h1" intro className="display-1">
          A portfolio
          <br />
          of <em>possibility</em>
        </SplitReveal>
        <FadeIn intro delay={0.4} className="page-hero__lede">
          <p>
            Thirteen businesses across eleven industries, each led with the same commitment to quality, trust and long
            term value.
          </p>
        </FadeIn>
      </section>

      <section className="container">
        <ul className="vi__list">
          {ventures.map((v, i) => (
            <li key={v.slug}>
              <TLink href={`/ventures/${v.slug}`} className="vi__row" data-index={i} style={{ ["--accent" as string]: v.accent }}>
                <span className="vi__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="vi__name">{v.name}</span>
                <span className="vi__sector">{v.sector}</span>
                <span className="vi__arrow" aria-hidden="true">
                  →
                </span>
              </TLink>
            </li>
          ))}
        </ul>
      </section>

      <div ref={preview} className="vi__preview" aria-hidden="true">
        <div className="vi__preview-inner">
          {ventures.map((v) => (
            <div key={v.slug} className="vi__preview-item">
              <Image src={photo(v.slug)} alt="" fill sizes="360px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
