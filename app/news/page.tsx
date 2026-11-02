import type { Metadata } from "next";
import { AmbientScene, FadeIn, SplitReveal } from "@/components/ui/motion";
import { news } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description: "Headlines and milestones from across Shree Jalaram Group's ventures.",
};

export default function NewsPage() {
  return (
    <>
      <AmbientScene x={70} tone={0.8} dim={0.8} />
      <section className="page-hero container">
        <FadeIn intro className="eyebrow" y={16}>
          News · 2008 to 2025
        </FadeIn>
        <SplitReveal as="h1" intro className="display-1">
          Stories &amp;
          <br />
          milestones
        </SplitReveal>
      </section>
      <section className="section container">
        <ul className="news">
          {news.map((n) => (
            <FadeIn as="li" key={n.title} className="news__row">
              <span className="news__year">{n.year}</span>
              <p className="news__title">{n.title}</p>
              <span className="tag">{n.venture}</span>
            </FadeIn>
          ))}
        </ul>
      </section>
    </>
  );
}
