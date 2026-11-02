"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { beginTransition, endTransition } from "@/lib/intro";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });

export const usePageTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }
      if (url.pathname === window.location.pathname) {
        lenis?.scrollTo(url.hash || 0, { duration: 1.4 });
        return;
      }
      if (busy.current) return;
      busy.current = true;
      beginTransition();
      lenis?.stop();
      router.prefetch(url.pathname);
      gsap
        .timeline()
        .set(panel.current, { visibility: "visible" })
        .fromTo(panel.current, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power4.inOut" })
        .fromTo(line.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, "-=0.35")
        .fromTo(mark.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, "<")
        .add(() => router.push(url.pathname + url.search + url.hash));
    },
    [lenis, router],
  );

  // New route committed: reset scroll, rebuild triggers, lift the panel.
  useEffect(() => {
    if (!busy.current) {
      window.scrollTo(0, 0);
      return;
    }
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      gsap
        .timeline({
          delay: 0.15,
          onComplete: () => {
            busy.current = false;
            gsap.set(panel.current, { visibility: "hidden" });
            lenis?.start();
          },
        })
        .to(mark.current, { autoAlpha: 0, y: -16, duration: 0.3 })
        .to(line.current, { scaleX: 0, transformOrigin: "right", duration: 0.4, ease: "power2.in" }, "<")
        .to(panel.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.85, ease: "power4.inOut" }, "-=0.1")
        .add(endTransition, "-=0.55")
        .set(line.current, { transformOrigin: "left" });
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={panel} className="page-transition" aria-hidden="true">
        <div ref={mark} className="page-transition__mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/group-mark-white.png" alt="" width={46} height={56} />
          <span>Shree Jalaram Group</span>
        </div>
        <div ref={line} className="page-transition__line" />
      </div>
    </TransitionContext.Provider>
  );
}

type TLinkProps = ComponentProps<typeof Link> & { href: string };

export function TLink({ href, onClick, children, ...rest }: TLinkProps) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || rest.target === "_blank") return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
