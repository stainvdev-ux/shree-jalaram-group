import type { Metadata } from "next";
import { FadeIn, SceneSetter, SplitReveal } from "@/components/ui/motion";
import { Sectors, Values } from "@/components/home/Sections";
import { GOLD } from "@/lib/scene";
import { group } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Shree Jalaram Group is a Mumbai-headquartered diversified business conglomerate with over 10,000 professionals across its ventures.",
};

export default function AboutPage() {
  return (
    <>
      <SceneSetter shape={8} color={GOLD} x={2} y={0.2} scale={0.95} dim={0.85} />
      <section className="page-hero container">
        <FadeIn intro className="eyebrow" y={16}>
          (About us) Since {group.since}
        </FadeIn>
        <SplitReveal as="h1" intro className="display-1">
          Exploring endless
          <br />
          <em>possibilities</em>
        </SplitReveal>
        <FadeIn intro delay={0.4} className="page-hero__lede">
          <p>A business conglomerate headquartered in Mumbai, with interests in diverse market segments across India.</p>
        </FadeIn>
      </section>

      <section className="section container about">
        <p className="eyebrow">(About the company)</p>
        <div className="about__body">
          {group.about.map((p, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <p className={i === 0 ? "about__lead" : undefined}>{p}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <Sectors />
      <Values />
    </>
  );
}
