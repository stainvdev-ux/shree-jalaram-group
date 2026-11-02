// A tiny mutable store that DOM-side code (ScrollTrigger, pages) writes and the
// WebGL frame loop reads every frame. No React state, so nothing re-renders.

export const GOLD = "#d9b26a";

export const scene = {
  shape: 0, // target shape index (see shapes.ts)
  color: GOLD, // target accent color
  x: 0, // target horizontal offset of the sculpture (world units)
  y: 0,
  scale: 1,
  dim: 1, // 0..1 overall intensity of the sculpture
  intro: 0, // 0..1, driven by the preloader; sculpture assembles as it rises
  scrollVelocity: 0,
  scrollProgress: 0,
  pointer: { x: 0, y: 0 }, // normalized -1..1
};

export function setScene(patch: Partial<Omit<typeof scene, "pointer">>) {
  Object.assign(scene, patch);
}
