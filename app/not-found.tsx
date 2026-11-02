import { TLink } from "@/components/Transition";
import { SceneSetter } from "@/components/ui/motion";

export default function NotFound() {
  return (
    <section className="page-hero container not-found">
      <SceneSetter shape={6} x={1.8} dim={0.6} />
      <p className="eyebrow">(404)</p>
      <h1 className="display-1">
        Lost in <em>space</em>
      </h1>
      <TLink href="/" className="btn" data-magnetic>
        <span>Back home</span>
        <i aria-hidden="true">→</i>
      </TLink>
    </section>
  );
}
