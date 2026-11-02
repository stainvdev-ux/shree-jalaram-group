import type { Metadata } from "next";
import { AmbientScene, FadeIn, SplitReveal } from "@/components/ui/motion";
import ContactForm from "@/components/ContactForm";
import { group } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with Shree Jalaram Group. ${group.address} · ${group.phone} · ${group.email}`,
};

export default function ContactPage() {
  return (
    <>
      <AmbientScene x={92} tone={1} dim={0.75} />
      <section className="page-hero container">
        <FadeIn intro className="eyebrow" y={16}>
          (Contact)
        </FadeIn>
        <SplitReveal as="h1" intro className="display-1">
          Let&apos;s start a
          <br />
          conversation
        </SplitReveal>
      </section>

      <section className="section container contact">
        <div className="contact__info">
          <FadeIn className="contact__block">
            <p className="eyebrow">Head office</p>
            <a href={group.map} target="_blank" rel="noreferrer">
              {group.address}
            </a>
          </FadeIn>
          <FadeIn className="contact__block" delay={0.05}>
            <p className="eyebrow">Toll free</p>
            <a href={group.phoneHref}>{group.phone}</a>
          </FadeIn>
          <FadeIn className="contact__block" delay={0.1}>
            <p className="eyebrow">Email</p>
            <a href={`mailto:${group.email}`}>{group.email}</a>
          </FadeIn>
          <FadeIn className="contact__block" delay={0.15}>
            <p className="eyebrow">Follow</p>
            <a href={group.facebook} target="_blank" rel="noreferrer">
              Facebook ↗
            </a>
          </FadeIn>
        </div>
        <FadeIn className="contact__form glass" delay={0.1}>
          <ContactForm />
        </FadeIn>
      </section>
    </>
  );
}
