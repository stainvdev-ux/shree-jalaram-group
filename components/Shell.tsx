"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import SmoothScroll from "./SmoothScroll";
import { TransitionProvider } from "./Transition";
import Preloader from "./Preloader";
import Cursor from "./Cursor";
import Header from "./Header";
import Footer from "./Footer";

const Experience = dynamic(() => import("./three/Experience"), { ssr: false });

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <TransitionProvider>
        <Experience />
        <Header />
        <main id="main" className="main">
          {children}
        </main>
        <Footer />
        <Cursor />
        <Preloader />
      </TransitionProvider>
    </SmoothScroll>
  );
}
