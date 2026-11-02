import Hero from "@/components/home/Hero";
import HorizontalVentures from "@/components/home/HorizontalVentures";
import { NewsList, Sectors, Statement, Values } from "@/components/home/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <Sectors />
      <HorizontalVentures />
      <Values />
      <NewsList limit={5} />
    </>
  );
}
