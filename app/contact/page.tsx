import type { Metadata } from "next";
import { FadeIn, SceneSetter, SplitReveal } from "@/components/ui/motion";
import ContactForm from "@/components/ContactForm";
import { group } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with Shree Jalaram Group. ${group.address} · ${group.phone} · ${group.email}`,
};

export default function ContactPage() {
  return (
    <>
      <SceneSetter shape={0} color="#d9b26a" x={2.2} y={0.6} scale={0.7} dim={0.7} />
      <section className="page-hero container">
        <FadeIn intro className="eyebrow" y={16}>
          (Contact)
        </FadeIn>
        <SplitReveal as="h1" intro className="display-1">
          Let&apos;s start a
          <br />
          <em>conversation</em>
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
        <FadeIn className="contact__form" delay={0.1}>
          <ContactForm />
        </FadeIn>
      </section>
    </>
  );
}
