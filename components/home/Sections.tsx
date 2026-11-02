"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TLink } from "@/components/Transition";
import { Counter, FadeIn, ScrubText, SplitReveal, useSceneDim } from "@/components/ui/motion";
import { group, logo, photo, ventures } from "@/lib/content";

/** Glass cards for every venture; the first spans two columns. */
export function VenturesGrid({ heading = true }: { heading?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useSceneDim(root, 0.45);

  useGSAP(
    () => {
      gsap.from(".vcard", {
        y: 60,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".vgrid", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section ventures" id="ventures">
      <div className="container">
        {heading && (
          <div className="section-head">
            <p className="eyebrow">Our ventures</p>
            <SplitReveal as="h2" className="display-2">
              Thirteen ventures.
              <br />
              One group.
            </SplitReveal>
            <FadeIn className="section-head__lede">
              <p>Each led with the same commitment to quality, trust and long term value, across eleven industries.</p>
            </FadeIn>
          </div>
        )}
        <div className="vgrid">
          {ventures.map((v, i) => (
            <TLink
              key={v.slug}
              href={`/ventures/${v.slug}`}
              className={`vcard${i === 0 ? " vcard--wide" : ""}`}
              style={{ ["--accent" as string]: v.accent }}
              data-cursor="view"
            >
              <span className="vcard__media" aria-hidden="true">
                <Image src={photo(v.slug)} alt="" fill sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 31vw" />
              </span>
              <span className="vcard__top">
                <span className="vcard__logo">
                  <Image src={logo(v.slug)} alt="" width={72} height={72} />
                </span>
                <span className="vcard__num">{String(i + 1).padStart(2, "0")}</span>
              </span>
              <span className="vcard__body">
                <span className="tag">{v.sector}</span>
                <span className="vcard__name">{v.name}</span>
                <span className="vcard__line">{v.tagline}</span>
              </span>
              <span className="vcard__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </TLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Statement() {
  const root = useRef<HTMLElement>(null);
  useSceneDim(root, 0.35);
  return (
    <section ref={root} className="section statement">
      <div className="container">
        <p className="eyebrow">The Group</p>
        <ScrubText className="statement__text">
          Headquartered in Mumbai, Shree Jalaram Group is a diversified business conglomerate built on entrepreneurial
          vision and operational excellence, backed by over 10,000 dedicated professionals.
        </ScrubText>
        <div className="stats">
          {group.stats.map((s) => (
            <FadeIn key={s.label} className="stat">
              <strong>
                <Counter value={s.value} suffix={s.suffix} grouping={s.value !== 1977} />
              </strong>
              <span>{s.label}</span>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="statement__cta">
          <TLink href="/about" className="btn" data-magnetic>
            <span>About the Group</span>
            <i aria-hidden="true">→</i>
          </TLink>
        </FadeIn>
      </div>
    </section>
  );
}

export function ValuesSection() {
  const root = useRef<HTMLElement>(null);
  useSceneDim(root, 0.35);
  useGSAP(
    () => {
      gsap.from(".value", {
        y: 50,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".values__grid", start: "top 82%" },
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="section values">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">What drives us</p>
          <SplitReveal as="h2" className="display-2">
            Built on integrity,
            <br />
            driven by excellence.
          </SplitReveal>
        </div>
        <div className="vm">
          <FadeIn className="glass vm__item">
            <p className="eyebrow">Our vision</p>
            <p>{group.vision}</p>
          </FadeIn>
          <FadeIn className="glass vm__item" delay={0.08}>
            <p className="eyebrow">Our mission</p>
            <p>{group.mission}</p>
          </FadeIn>
        </div>
        <div className="values__grid">
          {group.values.map((v, i) => (
            <article key={v.title} className="value">
              <span className="value__num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
