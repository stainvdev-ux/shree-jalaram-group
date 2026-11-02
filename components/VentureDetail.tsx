"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TLink } from "@/components/Transition";
import { AmbientScene, FadeIn, SplitReveal } from "@/components/ui/motion";
import { logo, photo, type Venture } from "@/lib/content";

export default function VentureDetail({ venture: v, index, total, next }: { venture: Venture; index: number; total: number; next: Venture }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".vd__figure",
        { clipPath: "inset(14% 10% 14% 10% round 32px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          ease: "none",
          scrollTrigger: { trigger: ".vd__figure", start: "top 92%", end: "top 25%", scrub: true },
        },
      );
      gsap.fromTo(
        ".vd__figure img",
        { scale: 1.22, yPercent: -5 },
        { scale: 1, yPercent: 5, ease: "none", scrollTrigger: { trigger: ".vd__figure", start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.from(".vd__body p", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".vd__body", start: "top 82%" },
      });
    },
    { scope: root, dependencies: [v.slug], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="vd" style={{ ["--accent" as string]: v.accent }}>
      <AmbientScene x={14 + index * 6} tone={0.35 + (index / total) * 0.6} accent={v.accent} dim={0.55} />

      <section className="page-hero container vd__hero">
        <FadeIn intro className="crumbs" y={16}>
          <TLink href="/ventures">Ventures</TLink>
          <span aria-hidden="true">/</span>
          <span className="tag">{v.sector}</span>
          <span className="crumbs__num">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </FadeIn>
        <SplitReveal as="h1" intro className="display-1 vd__title" delay={0.05}>
          {v.name}
        </SplitReveal>
        <div className="vd__intro">
          <FadeIn intro delay={0.3} className="logo-tile logo-tile--lg">
            <Image src={logo(v.slug)} alt={`${v.name} logo`} width={160} height={160} priority />
          </FadeIn>
          <FadeIn intro delay={0.4}>
            <p className="vd__tagline">{v.tagline}</p>
            <p className="vd__location">{v.location}</p>
          </FadeIn>
        </div>
      </section>

      <div className="container">
        <figure className="vd__figure">
          <Image src={photo(v.slug)} alt={v.name} fill sizes="(max-width: 1680px) 94vw, 1580px" priority />
        </figure>
      </div>

      <section className="container vd__content">
        <aside className="vd__aside">
          <p className="eyebrow">About {v.name}</p>
          <div className="vd__links">
            {v.website && (
              <a href={v.website} target="_blank" rel="noreferrer" className="btn btn--light" data-magnetic>
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
        <div className="vd__body glass">
          {v.body.map((p, i) => (
            <p key={i} className={i === 0 ? "vd__lead" : undefined}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {v.stats && v.stats.length > 0 && (
        <section className="container stats vd__stats">
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
          <span className="tag">{next.sector}</span>
        </TLink>
      </section>
    </div>
  );
}
