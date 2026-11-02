"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import { TLink } from "@/components/Transition";
import { setScene, GOLD } from "@/lib/scene";
import { logo, photo, ventures } from "@/lib/content";

// Pinned section: vertical scroll drives the venture rail sideways. Each card
// that crosses the viewport's centre re-shapes and re-tints the 3D sculpture.
export default function HorizontalVentures() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const current = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        let active = -2;

        let st: ScrollTrigger | undefined;
        const setActive = (i: number) => {
          // Only steer the 3D scene while the rail is actually pinned on screen.
          if (!st?.isActive || i === active) return;
          active = i;
          const v = ventures[i];
          if (current.current) current.current.textContent = i < 0 ? "00" : String(i + 1).padStart(2, "0");
          if (name.current) name.current.textContent = v ? v.name : "Our ventures";
          if (v) setScene({ shape: v.shape, color: v.accent, x: 0, y: 0.35, scale: 0.95, dim: 0.55 });
          else setScene({ shape: 5, color: GOLD, x: 0, y: 0.2, scale: 1, dim: 0.8 });
        };

        const cards = gsap.utils.toArray<HTMLElement>(".hv__card", el);
        let bounds: { left: number; right: number }[] = [];
        const measure = () => {
          bounds = cards.map((c) => ({ left: c.offsetLeft, right: c.offsetLeft + c.offsetWidth }));
        };

        // The venture whose card spans the 55% line of the viewport is active,
        // read from the rail's real (scrubbed) position, so fast jumps settle correctly.
        const syncActive = () => {
          const line = -Number(gsap.getProperty(el, "x")) + window.innerWidth * 0.55;
          let idx = -1;
          for (let i = 0; i < bounds.length; i++) if (line >= bounds[i].left) idx = i;
          setActive(idx);
        };

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none", // required for containerAnimation to map 1:1
          onUpdate: syncActive,
          scrollTrigger: {
            trigger: pin.current,
            pin: true,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              measure();
              syncActive();
            },
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            },
            onEnter: syncActive,
            onEnterBack: () => {
              active = -2;
              syncActive();
            },
          },
        });
        st = tween.scrollTrigger;
        measure();

        cards.forEach((card) => {
          const img = card.querySelector(".hv__img");
          gsap.fromTo(
            img,
            { xPercent: -10, scale: 1.12 },
            {
              xPercent: 10,
              scale: 1.12,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.from(card.querySelectorAll(".hv__reveal"), {
            y: 36,
            autoAlpha: 0,
            stagger: 0.07,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 80%", toggleActions: "play none none reverse" },
          });
        });

        gsap.from(".hv__intro > *", {
          y: 50,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hv" id="ventures" aria-label="Our ventures">
      <div ref={pin} className="hv__pin">
        <div className="hv__hud container">
          <p className="eyebrow">(02) Our ventures</p>
          <p className="hv__now" aria-hidden="true">
            <span ref={name}>Our ventures</span>
          </p>
          <p className="hv__count" aria-hidden="true">
            <span ref={current}>00</span>
            <span> / {String(ventures.length).padStart(2, "0")}</span>
          </p>
          <div className="hv__progress" aria-hidden="true">
            <div ref={bar} />
          </div>
        </div>

        <div ref={track} className="hv__track">
          <div className="hv__intro">
            <h2 className="display-2">
              Thirteen ventures.
              <br />
              <em>One</em> vision.
            </h2>
            <p>
              From India&apos;s pioneering lottery brand to luxury hospitality in the Himalayas, every venture is built on
              the same foundation of integrity, innovation and excellence.
            </p>
            <span className="hv__hint">
              Keep scrolling <i aria-hidden="true">→</i>
            </span>
          </div>

          {ventures.map((v, i) => (
            <article key={v.slug} className="hv__card" style={{ ["--accent" as string]: v.accent }}>
              <TLink href={`/ventures/${v.slug}`} className="hv__media" data-cursor="view" aria-label={`Explore ${v.name}`}>
                <div className="hv__img">
                  <Image src={photo(v.slug)} alt="" fill sizes="(max-width: 768px) 85vw, 60vw" priority={i < 2} />
                </div>
                <span className="hv__index">{String(i + 1).padStart(2, "0")}</span>
              </TLink>
              <div className="hv__meta">
                <div className="hv__logo hv__reveal">
                  <Image src={logo(v.slug)} alt={`${v.name} logo`} width={120} height={120} />
                </div>
                <div className="hv__text">
                  <p className="hv__sector hv__reveal">
                    {v.sector} <span>· {v.location}</span>
                  </p>
                  <h3 className="hv__name hv__reveal">{v.name}</h3>
                  <p className="hv__tagline hv__reveal">{v.tagline}</p>
                  <TLink href={`/ventures/${v.slug}`} className="link-arrow hv__reveal">
                    Explore venture <span aria-hidden="true">→</span>
                  </TLink>
                </div>
              </div>
            </article>
          ))}

          <div className="hv__outro">
            <p className="eyebrow">And counting</p>
            <TLink href="/ventures" className="display-2 hv__all" data-cursor="view">
              View all
              <br />
              <em>ventures</em> →
            </TLink>
          </div>
        </div>
      </div>
    </section>
  );
}
