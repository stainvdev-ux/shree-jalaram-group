import type { Metadata } from "next";
import { AmbientScene, FadeIn, SplitReveal } from "@/components/ui/motion";
import { VenturesGrid } from "@/components/home/Sections";

export const metadata: Metadata = {
  title: "Ventures",
  description: "Thirteen ventures across lottery, gaming, hospitality, beverages, design, construction, manufacturing, technology and more.",
};

export default function VenturesPage() {
  return (
    <>
      <AmbientScene x={40} tone={0.55} dim={0.8} />
      <section className="page-hero container">
        <FadeIn intro className="eyebrow" y={16}>
          13 ventures · 11 industries
        </FadeIn>
        <SplitReveal as="h1" intro className="display-1">
          A portfolio of
          <br />
          possibility
        </SplitReveal>
        <FadeIn intro delay={0.4} className="page-hero__lede">
          <p>From India&apos;s pioneering lottery brand to luxury hospitality in the Himalayas, explore every business in the Group.</p>
        </FadeIn>
      </section>
      <VenturesGrid heading={false} />
    </>
  );
}
