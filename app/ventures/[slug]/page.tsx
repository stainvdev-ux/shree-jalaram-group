import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VentureDetail from "@/components/VentureDetail";
import { getVenture, photo, ventures } from "@/lib/content";

export function generateStaticParams() {
  return ventures.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const v = getVenture(slug);
  if (!v) return {};
  return {
    title: v.name,
    description: v.tagline,
    openGraph: { title: `${v.name} — Shree Jalaram Group`, description: v.tagline, images: [photo(v.slug)] },
  };
}

export default async function VenturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = ventures.findIndex((v) => v.slug === slug);
  if (index < 0) notFound();
  const next = ventures[(index + 1) % ventures.length];
  return <VentureDetail key={slug} venture={ventures[index]} index={index} total={ventures.length} next={next} />;
}
