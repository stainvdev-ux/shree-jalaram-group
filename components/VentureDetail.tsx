"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TLink } from "@/components/Transition";
import { FadeIn, SceneSetter, SplitReveal, useSceneSection } from "@/components/ui/motion";
import { logo, photo, type Venture } from "@/lib/content";

export default function VentureDetail({ venture: v, index, total, next }: { venture: Venture; index: number; total: number; next: Venture }) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const content = useRef<HTMLElement>(null);
  // Hero: sculpture beside the title. Reading: it shrinks behind the sidebar and fades.
  useSceneSection(hero, { shape: v.shape, color: v.accent, x: 2, y: 0.2, scale: 0.9, dim: 0.8 });
  useSceneSection(content, { shape: v.shape, color: v.accent, x: -2.5, y: -0.3, scale: 0.55, dim: 0.35 });

  useGSAP(
    () => {
      // Image opens from a slit and settles as it scrolls.
      gsap.fromTo(
        ".vd__figure",
        { clipPath: "inset(18% 12% 18% 12% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: ".vd__figure", start: "top 90%", end: "top 20%", scrub: true },
        },
      );
      gsap.fromTo(
        ".vd__figure img",
        { scale: 1.25, yPercent: -6 },
        { scale: 1, yPercent: 6, ease: "none", scrollTrigger: { trigger: ".vd__figure", start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.from(".vd__body p", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".vd__body", start: "top 80%" },
      });
      gsap.fromTo(
        ".vd__next-img",
        { clipPath: "inset(30% 30% 30% 30%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ".vd__next", start: "top bottom", end: "center center", scrub: true } },
      );
    },
    { scope: root, dependencies: [v.slug], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="vd" style={{ ["--accent" as string]: v.accent }}>
      <SceneSetter shape={v.shape} color={v.accent} x={2} y={0.2} scale={0.9} dim={0.8} />

      <section ref={hero} className="vd__hero container">
        <FadeIn intro className="vd__crumbs" y={16}>
          <TLink href="/ventures">Ventures</TLink>
          <span aria-hidden="true">/</span>
          <span>{v.sector}</span>
          <span className="vd__num">
            {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
          </span>
        </FadeIn>
        <SplitReveal as="h1" intro className="vd__title" delay={0.05}>
          {v.name}
        </SplitReveal>
        <div className="vd__intro">
          <FadeIn intro delay={0.3} className="vd__logo">
            <Image src={logo(v.slug)} alt={`${v.name} logo`} width={160} height={160} priority />
          </FadeIn>
          <FadeIn intro delay={0.4}>
            <p className="vd__tagline">{v.tagline}</p>
            <p className="vd__location">{v.location}</p>
          </FadeIn>
        </div>
      </section>

      <figure className="vd__figure">
        <Image src={photo(v.slug)} alt={v.name} fill sizes="100vw" priority />
      </figure>

      <section ref={content} className="vd__content container">
        <aside className="vd__aside">
          <p className="eyebrow">(About {v.name})</p>
          <div className="vd__links">
            {v.website && (
              <a href={v.website} target="_blank" rel="noreferrer" className="btn btn--accent" data-magnetic>
                <span>Visit website</span>
                <i aria-hidden="true">↗</i>
              </a>
            )}
            {v.socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="link-arrow">
                {s.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </aside>
        <div className="vd__body">
          {v.body.map((p, i) => (
            <p key={i} className={i === 0 ? "vd__lead" : undefined}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {v.stats && v.stats.length > 0 && (
        <section className="container vd__stats">
          {v.stats.map((s) => (
            <FadeIn key={s.label} className="stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </FadeIn>
          ))}
        </section>
      )}

      <section className="vd__next">
        <TLink href={`/ventures/${next.slug}`} className="vd__next-link" data-cursor="Next">
          <p className="eyebrow">Next venture</p>
          <span className="vd__next-name">{next.name}</span>
          <div className="vd__next-img">
            <Image src={photo(next.slug)} alt="" fill sizes="(max-width: 768px) 90vw, 50vw" />
          </div>
        </TLink>
      </section>
    </div>
  );
}
