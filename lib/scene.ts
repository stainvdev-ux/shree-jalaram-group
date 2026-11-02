import type { Camera } from "three";

// Mutable store shared by the DOM (ScrollTrigger, pages) and the WebGL frame
// loop. Nothing here triggers React renders.

export type SceneMode = "journey" | "ambient";

export const scene = {
  mode: "journey" as SceneMode,
  progress: 0, // journey progress target 0..1 (scroll-driven)
  ambientX: 30, // camera x in ambient mode (inner pages)
  tone: 0, // background tone target: 0 violet → 1 teal (ambient mode)
  accent: "", // optional page accent mixed into the background
  dim: 1, // particle intensity target
  intro: 0, // 0..1 once the preloader lifts
  scrollVelocity: 0,
  pointer: { x: 0, y: 0 },
  camera: null as Camera | null,
  time: 0,
  // Called every frame after the camera moves, to place DOM markers.
  overlay: null as ((camera: Camera, time: number) => void) | null,
};

export function setAmbient(opts: { x?: number; tone?: number; accent?: string; dim?: number }) {
  scene.mode = "ambient";
  scene.ambientX = opts.x ?? 30;
  scene.tone = opts.tone ?? 0.5;
  scene.accent = opts.accent ?? "";
  scene.dim = opts.dim ?? 0.75;
}
