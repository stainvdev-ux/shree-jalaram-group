"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitReveal, FadeIn, useSceneSection } from "@/components/ui/motion";
import { GOLD } from "@/lib/scene";
import { group, ventures } from "@/lib/content";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useSceneSection(root, { shape: 0, color: GOLD, x: 1.7, y: 0.1, scale: 1.05, dim: 1 });

  useGSAP(
    () => {
      // Headline drifts up and fades as the hero scrolls away.
      gsap.to(".hero__content", {
        yPercent: -18,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 20%", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero">
      <div className="hero__content container">
        <FadeIn intro className="hero__eyebrow" y={20}>
          <span className="dot" /> Mumbai, India · Est. {group.since}
        </FadeIn>
        <SplitReveal as="h1" intro className="hero__title" delay={0.1}>
          Many ventures.
          <br />
          <em>One</em> legacy.
        </SplitReveal>
        <div className="hero__bottom">
          <FadeIn intro delay={0.5} className="hero__lede">
            <p>
              A diversified business group shaping lottery, gaming, hospitality, beverages, design, construction and
              technology across India.
            </p>
          </FadeIn>
          <FadeIn intro delay={0.65} className="hero__meta">
            <div>
              <strong>{ventures.length}</strong>
              <span>Ventures</span>
            </div>
            <div>
              <strong>10K+</strong>
              <span>People</span>
            </div>
          </FadeIn>
        </div>
      </div>
      <FadeIn intro delay={0.9} className="hero__scroll" y={0}>
        <span>Scroll to explore</span>
        <i />
      </FadeIn>
    </section>
  );
}
