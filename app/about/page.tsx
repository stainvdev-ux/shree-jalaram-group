import type { Metadata } from "next";
import { AmbientScene, FadeIn, Marquee, SplitReveal } from "@/components/ui/motion";
import { ValuesSection } from "@/components/home/Sections";
import { group } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Shree Jalaram Group is a Mumbai-headquartered diversified business conglomerate with over 10,000 professionals across its ventures.",
};

export default function AboutPage() {
  const half = Math.ceil(group.sectors.length / 2);
  return (
    <>
      <AmbientScene x={8} tone={0.15} dim={0.85} />
      <section className="page-hero container">
        <FadeIn intro className="eyebrow" y={16}>
          About us · Since {group.since}
        </FadeIn>
        <SplitReveal as="h1" intro className="display-1">
          Exploring endless
          <br />
          possibilities
        </SplitReveal>
        <FadeIn intro delay={0.4} className="page-hero__lede">
          <p>A business conglomerate headquartered in Mumbai, with interests in diverse market segments across India.</p>
        </FadeIn>
      </section>

      <section className="section container about">
        <p className="eyebrow">About the company</p>
        <div className="about__body glass">
          {group.about.map((p, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <p className={i === 0 ? "about__lead" : undefined}>{p}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="sectors" aria-label="Industries">
        <Marquee items={group.sectors.slice(0, half)} />
        <Marquee items={group.sectors.slice(half)} reverse className="marquee--outline" />
      </section>

      <ValuesSection />
    </>
  );
}
