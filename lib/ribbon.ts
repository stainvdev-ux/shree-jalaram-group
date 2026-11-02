// The ribbon is a twisted band of particle strands running along +x.
// These functions are mirrored 1:1 in RIBBON_GLSL so DOM markers placed with
// the JS versions sit exactly on the particles the GPU draws.

export const RIBBON_LENGTH = 104;
export const INTRO_X = -18; // where the particle "1977" floats, left of the ribbon
export const JOURNEY_START_X = 4;
export const JOURNEY_END_X = RIBBON_LENGTH - 8;

// Journey progress (0..1) is split into the intro hold, the glide to the
// ribbon, and the travel along it.
export const P_INTRO_END = 0.08;
export const P_RIBBON_START = 0.16;

export const centerY = (x: number, t: number) => 1.3 * Math.sin(x * 0.085 + 0.6) + 0.6 * Math.sin(x * 0.21 + 1.7 + t * 0.12);
export const centerZ = (x: number) => 0.9 * Math.sin(x * 0.045 + 0.3);
export const twist = (x: number, t: number) => x * 0.075 + 0.5 * Math.sin(x * 0.13 + t * 0.18);
export const width = (x: number) => 0.85 + 0.35 * Math.sin(x * 0.06 + 1.0);

export function ribbonPoint(x: number, v: number, t: number, out = { x: 0, y: 0, z: 0 }) {
  const th = twist(x, t);
  const w = width(x);
  out.x = x;
  out.y = centerY(x, t) + Math.cos(th) * v * w;
  out.z = centerZ(x) + Math.sin(th) * v * w;
  return out;
}

const smooth = (a: number) => a * a * (3 - 2 * a);

/** Camera x for a journey progress value. */
export function cameraXForProgress(p: number) {
  if (p <= P_INTRO_END) return INTRO_X;
  if (p <= P_RIBBON_START) return INTRO_X + (JOURNEY_START_X - INTRO_X) * smooth((p - P_INTRO_END) / (P_RIBBON_START - P_INTRO_END));
  return JOURNEY_START_X + (JOURNEY_END_X - JOURNEY_START_X) * ((p - P_RIBBON_START) / (1 - P_RIBBON_START));
}

/** Inverse of cameraXForProgress on the ribbon stretch. */
export function progressForX(x: number) {
  return P_RIBBON_START + ((x - JOURNEY_START_X) / (JOURNEY_END_X - JOURNEY_START_X)) * (1 - P_RIBBON_START);
}

/** World x of milestone i of n, spread evenly along the travelled stretch. */
export function milestoneX(i: number, n: number) {
  const a = JOURNEY_START_X + 6;
  const b = JOURNEY_END_X - 2;
  return a + ((b - a) * i) / Math.max(1, n - 1);
}

export const RIBBON_GLSL = /* glsl */ `
  float rCenterY(float x, float t) { return 1.3 * sin(x * 0.085 + 0.6) + 0.6 * sin(x * 0.21 + 1.7 + t * 0.12); }
  float rCenterZ(float x) { return 0.9 * sin(x * 0.045 + 0.3); }
  float rTwist(float x, float t) { return x * 0.075 + 0.5 * sin(x * 0.13 + t * 0.18); }
  float rWidth(float x) { return 0.85 + 0.35 * sin(x * 0.06 + 1.0); }
  vec3 ribbonPos(float x, float v, float t) {
    float th = rTwist(x, t);
    float w = rWidth(x);
    return vec3(x, rCenterY(x, t) + cos(th) * v * w, rCenterZ(x) + sin(th) * v * w);
  }
`;
