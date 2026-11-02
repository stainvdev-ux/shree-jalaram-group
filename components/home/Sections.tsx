"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TLink } from "@/components/Transition";
import { Counter, FadeIn, Marquee, ScrubText, SplitReveal, useSceneSection } from "@/components/ui/motion";
import { GOLD } from "@/lib/scene";
import { group, news } from "@/lib/content";

export function Statement() {
  const root = useRef<HTMLElement>(null);
  useSceneSection(root, { shape: 8, color: GOLD, x: -1.9, y: 0, scale: 0.9, dim: 0.75 });

  return (
    <section ref={root} className="statement section">
      <div className="container statement__grid">
        <p className="eyebrow">(01) The group</p>
        <div>
          <ScrubText className="statement__text">
            Headquartered in Mumbai, Shree Jalaram Group is a dynamic and diversified business conglomerate. Built on
            entrepreneurial vision and operational excellence, our ventures span lottery and gaming, hospitality, food and
            beverages, design, construction, manufacturing and technology, backed by over 10,000 dedicated professionals.
          </ScrubText>
          <FadeIn>
            <TLink href="/about" className="btn" data-magnetic>
              <span>About the group</span>
              <i aria-hidden="true">→</i>
            </TLink>
          </FadeIn>
        </div>
      </div>

      <div className="container stats">
        {group.stats.map((s) => (
          <FadeIn key={s.label} className="stat">
            <strong>
              <Counter value={s.value} suffix={s.suffix} grouping={s.value !== 1977} />
            </strong>
            <span>{s.label}</span>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

export function Sectors() {
  const half = Math.ceil(group.sectors.length / 2);
  return (
    <section className="sectors" aria-label="Industries">
      <Marquee items={group.sectors.slice(0, half)} />
      <Marquee items={group.sectors.slice(half)} reverse className="marquee--outline" />
    </section>
  );
}

export function Values() {
  const root = useRef<HTMLElement>(null);
  useSceneSection(root, { shape: 13, color: GOLD, x: 1.9, y: 0.2, scale: 0.85, dim: 0.6 });

  useGSAP(
    () => {
      gsap.from(".value", {
        y: 60,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".values__grid", start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="values section">
      <div className="container">
        <div className="values__head">
          <p className="eyebrow">(03) What drives us</p>
          <SplitReveal as="h2" className="display-2">
            Built on <em>integrity</em>,
            <br />
            driven by excellence.
          </SplitReveal>
        </div>

        <div className="vm">
          <FadeIn className="vm__item">
            <p className="eyebrow">Our vision</p>
            <p>{group.vision}</p>
          </FadeIn>
          <FadeIn className="vm__item" delay={0.1}>
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

export function NewsList({ limit, showHead = true }: { limit?: number; showHead?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useSceneSection(root, { shape: 11, color: "#6f8fe8", x: -2, y: 0, scale: 0.8, dim: 0.45 });
  const items = limit ? news.slice(0, limit) : news;

  useGSAP(
    () => {
      gsap.from(".news__row", {
        y: 40,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".news__list", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="news section">
      <div className="container">
        {showHead && (
          <div className="news__head">
            <p className="eyebrow">(04) In the news</p>
            <SplitReveal as="h2" className="display-2">
              Making <em>headlines</em>
            </SplitReveal>
          </div>
        )}
        <ul className="news__list">
          {items.map((n) => (
            <li key={n.title} className="news__row">
              <span className="news__year">{n.year}</span>
              <p className="news__title">{n.title}</p>
              <span className="news__venture">{n.venture}</span>
            </li>
          ))}
        </ul>
        {limit && (
          <FadeIn className="news__more">
            <TLink href="/news" className="btn" data-magnetic>
              <span>All news</span>
              <i aria-hidden="true">→</i>
            </TLink>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
