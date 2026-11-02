"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { TLink } from "./Transition";
import { group, nav, ventures } from "@/lib/content";

export default function Header() {
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const hidden = useRef(false);

  // Hide while scrolling down, reveal on the way up.
  useLenis(({ scroll, direction }) => {
    const shouldHide = scroll > 160 && direction === 1 && !open;
    if (shouldHide !== hidden.current) {
      hidden.current = shouldHide;
      gsap.to(bar.current, { yPercent: shouldHide ? -120 : 0, duration: 0.6, ease: "power3.out" });
    }
    header.current?.classList.toggle("is-scrolled", scroll > 40);
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      lenis?.stop();
      hidden.current = false;
      gsap.to(bar.current, { yPercent: 0, duration: 0.4 });
    } else if (wasOpen.current) {
      lenis?.start();
    }
    wasOpen.current = open;
  }, [open, lenis]);

  useGSAP(
    () => {
      if (!menu.current) return;
      if (open) {
        gsap
          .timeline()
          .set(menu.current, { visibility: "visible" })
          .fromTo(menu.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" })
          .fromTo(".menu__link span", { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.9, ease: "expo.out" }, "-=0.35")
          .fromTo(".menu__foot > *", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.05 }, "-=0.6");
      } else {
        gsap
          .timeline()
          .to(menu.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "expo.inOut" })
          .set(menu.current, { visibility: "hidden" });
      }
    },
    { dependencies: [open], scope: header },
  );

  return (
    <header ref={header} className="header">
      <div ref={bar} className="header__bar">
        <TLink href="/" className="header__logo" aria-label="Shree Jalaram Group — home" data-magnetic>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/group-mark-white.png" alt="" width={26} height={32} />
          <span>
            Shree Jalaram
            <br />
            Group
          </span>
        </TLink>

        <nav className="header__nav" aria-label="Primary">
          {nav.map((item) => (
            <TLink key={item.href} href={item.href} className={!item.href.includes("#") && pathname.startsWith(item.href) ? "is-active" : undefined}>
              <span data-text={item.label}>{item.label}</span>
            </TLink>
          ))}
        </nav>

        <TLink href="/contact" className="header__cta" data-magnetic>
          Get in touch
        </TLink>

        <button
          type="button"
          className={`header__burger${open ? " is-open" : ""}`}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <div ref={menu} id="site-menu" className="menu" aria-hidden={!open}>
        <nav className="menu__nav" aria-label="Mobile">
          {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
            <TLink key={item.href} href={item.href} className="menu__link" tabIndex={open ? 0 : -1}>
              <small>{String(i + 1).padStart(2, "0")}</small>
              <span>{item.label}</span>
            </TLink>
          ))}
        </nav>
        <div className="menu__foot">
          <a href={`mailto:${group.email}`}>{group.email}</a>
          <a href={group.phoneHref}>{group.phone}</a>
          <span>{ventures.length} ventures · Since {group.since}</span>
        </div>
      </div>
    </header>
  );
}
