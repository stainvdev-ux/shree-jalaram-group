import { TLink } from "@/components/Transition";
import { AmbientScene } from "@/components/ui/motion";

export default function NotFound() {
  return (
    <section className="page-hero container not-found">
      <AmbientScene x={50} tone={0.6} dim={0.7} />
      <p className="eyebrow">(404)</p>
      <h1 className="display-1">
        Lost in time
      </h1>
      <TLink href="/" className="btn" data-magnetic>
        <span>Back home</span>
        <i aria-hidden="true">→</i>
      </TLink>
    </section>
  );
}
