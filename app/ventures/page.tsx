import type { Metadata } from "next";
import VenturesIndex from "@/components/VenturesIndex";

export const metadata: Metadata = {
  title: "Ventures",
  description: "Thirteen ventures across lottery, gaming, hospitality, beverages, design, construction, manufacturing, technology and more.",
};

export default function VenturesPage() {
  return <VenturesIndex />;
}
