import type { Metadata } from "next";
import { FadeIn, SceneSetter, SplitReveal } from "@/components/ui/motion";
import { NewsList } from "@/components/home/Sections";

export const metadata: Metadata = {
  title: "News",
  description: "Headlines and milestones from across Shree Jalaram Group's ventures.",
};

export default function NewsPage() {
  return (
    <>
      <SceneSetter shape={11} color="#6f8fe8" x={2} y={0.3} scale={0.85} dim={0.7} />
      <section className="page-hero container">
        <FadeIn intro className="eyebrow" y={16}>
          (News) 2008 — 2025
        </FadeIn>
        <SplitReveal as="h1" intro className="display-1">
          Stories &amp;
          <br />
          <em>milestones</em>
        </SplitReveal>
      </section>
      <NewsList showHead={false} />
    </>
  );
}
