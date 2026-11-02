"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TLink } from "./Transition";
import { group, groupLogo, nav, ventures } from "@/lib/content";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".footer__big .mask > span", {
        yPercent: 100,
        stagger: 0.08,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".footer__big", start: "top 90%", refreshPriority: -1 },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="footer">
      <div className="footer__cta">
        <p className="eyebrow">(Let&apos;s connect)</p>
        <TLink href="/contact" className="footer__big" data-cursor="Say hello">
          <span className="mask">
            <span>Build what&apos;s</span>
          </span>
          <span className="mask">
            <span>
              <em>next</em> with us
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 19 19 5M8 5h11v11" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </span>
        </TLink>
      </div>

      <div className="footer__grid">
        <div>
          <p className="eyebrow">Head office</p>
          <a href={group.map} target="_blank" rel="noreferrer" className="footer__text">
            {group.address}
          </a>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <a href={group.phoneHref} className="footer__text">
            {group.phone} <small>(Toll free)</small>
          </a>
          <a href={`mailto:${group.email}`} className="footer__text">
            {group.email}
          </a>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <TLink href="/" className="footer__text">
            Home
          </TLink>
          {nav.map((n) => (
            <TLink key={n.href} href={n.href} className="footer__text">
              {n.label}
            </TLink>
          ))}
        </div>
        <div>
          <p className="eyebrow">Ventures</p>
          <div className="footer__ventures">
            {ventures.map((v) => (
              <TLink key={v.slug} href={`/ventures/${v.slug}`}>
                {v.name}
              </TLink>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__base">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={groupLogo} alt="Shree Jalaram Group — Since 1977" className="footer__logo" width={1237} height={928} loading="lazy" />
        <div className="footer__legal">
          <span>© {new Date().getFullYear()} {group.name}. All rights reserved.</span>
          <a href={group.facebook} target="_blank" rel="noreferrer">
            Facebook ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
