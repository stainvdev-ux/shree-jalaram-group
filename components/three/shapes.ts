// Point-cloud generators. Each returns `count` xyz positions that fit roughly
// inside a radius of ~1.7 world units, so any shape can morph into any other.

type Gen = (count: number, rand: () => number) => Float32Array;

const TAU = Math.PI * 2;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fill(count: number, fn: (i: number, out: number[]) => void) {
  const arr = new Float32Array(count * 3);
  const p = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    fn(i, p);
    arr[i * 3] = p[0];
    arr[i * 3 + 1] = p[1];
    arr[i * 3 + 2] = p[2];
  }
  return arr;
}

const gauss = (r: () => number) => (r() + r() + r() - 1.5) / 1.5;

// 0 · core: fibonacci sphere with a soft inner volume
const core: Gen = (n, r) =>
  fill(n, (i, p) => {
    const shell = r() < 0.82;
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = i * 2.399963229728653;
    const R = shell ? 1.45 : 1.45 * Math.cbrt(r()) * 0.85;
    p[0] = Math.cos(th) * rad * R;
    p[1] = y * R;
    p[2] = Math.sin(th) * rad * R;
  });

// 1 · torus (a wheel)
const torus: Gen = (n, r) =>
  fill(n, (_, p) => {
    const u = r() * TAU;
    const v = r() * TAU;
    const R = 1.25;
    const t = 0.42 + gauss(r) * 0.04;
    p[0] = (R + t * Math.cos(v)) * Math.cos(u);
    p[1] = (R + t * Math.cos(v)) * Math.sin(u);
    p[2] = t * Math.sin(v);
  });

// 2 · torus knot
const knot: Gen = (n, r) =>
  fill(n, (_, p) => {
    const t = r() * TAU;
    const P = 2;
    const Q = 3;
    const rr = Math.cos(Q * t) + 2;
    const cx = rr * Math.cos(P * t) * 0.55;
    const cy = rr * Math.sin(P * t) * 0.55;
    const cz = -Math.sin(Q * t) * 0.55;
    const a = r() * TAU;
    const tube = 0.22 * Math.sqrt(r());
    p[0] = cx + Math.cos(a) * tube;
    p[1] = cy + Math.sin(a) * tube;
    p[2] = cz + Math.cos(a + 1.3) * tube;
  });

// 3 · flowing ribbon
const ribbon: Gen = (n, r) =>
  fill(n, (_, p) => {
    const u = r() * 2 - 1;
    const v = r() * 2 - 1;
    p[0] = u * 2.1;
    p[1] = v * 0.7 + Math.sin(u * 3.2) * 0.45;
    p[2] = Math.cos(u * 2.4 + v * 1.5) * 0.6;
  });

// 4 · double helix
const helix: Gen = (n, r) =>
  fill(n, (i, p) => {
    const t = r();
    const strand = i % 3;
    const a = t * TAU * 2.4 + (strand === 1 ? Math.PI : 0);
    const y = (t - 0.5) * 3.6;
    if (strand === 2) {
      // rungs
      const k = Math.round(t * 28) / 28;
      const aa = k * TAU * 2.4;
      const s = r() * 2 - 1;
      p[0] = Math.cos(aa) * 0.75 * s;
      p[1] = (k - 0.5) * 3.6;
      p[2] = Math.sin(aa) * 0.75 * s;
      return;
    }
    p[0] = Math.cos(a) * 0.75 + gauss(r) * 0.05;
    p[1] = y;
    p[2] = Math.sin(a) * 0.75 + gauss(r) * 0.05;
  });

// 5 · orbit rings (roulette / a system of ventures)
const rings: Gen = (n, r) =>
  fill(n, (i, p) => {
    const ring = i % 4;
    const a = r() * TAU;
    if (ring === 3) {
      const R = 0.38 * Math.cbrt(r());
      const th = r() * TAU;
      const ph = Math.acos(2 * r() - 1);
      p[0] = R * Math.sin(ph) * Math.cos(th);
      p[1] = R * Math.cos(ph);
      p[2] = R * Math.sin(ph) * Math.sin(th);
      return;
    }
    const R = [0.85, 1.3, 1.75][ring] + gauss(r) * 0.03;
    const tilt = [0.3, -0.5, 0.9][ring];
    const x = Math.cos(a) * R;
    const z = Math.sin(a) * R;
    p[0] = x;
    p[1] = z * Math.sin(tilt);
    p[2] = z * Math.cos(tilt);
  });

// 6 · spiral galaxy
const galaxy: Gen = (n, r) =>
  fill(n, (_, p) => {
    const arms = 4;
    const radius = Math.pow(r(), 0.7) * 1.9;
    const arm = Math.floor(r() * arms);
    const a = (arm / arms) * TAU + radius * 2.2;
    const spread = 0.28 * (1 - radius / 2.2);
    p[0] = Math.cos(a) * radius + gauss(r) * spread;
    p[1] = gauss(r) * 0.12 * (1.2 - radius / 2);
    p[2] = Math.sin(a) * radius + gauss(r) * spread;
  });

// 7 · cube lattice (dice / structure)
const lattice: Gen = (n, r) =>
  fill(n, (_, p) => {
    const s = 1.15;
    const g = 4;
    const axis = Math.floor(r() * 3);
    const a = (Math.floor(r() * (g + 1)) / g) * 2 - 1;
    const b = (Math.floor(r() * (g + 1)) / g) * 2 - 1;
    const t = r() * 2 - 1;
    const v = axis === 0 ? [t, a, b] : axis === 1 ? [a, t, b] : [a, b, t];
    p[0] = v[0] * s;
    p[1] = v[1] * s;
    p[2] = v[2] * s;
  });

// 8 · drop (echoes the group's mark)
const drop: Gen = (n, r) =>
  fill(n, (_, p) => {
    const u = r();
    const th = r() * TAU;
    const t = u * Math.PI;
    const R = Math.sin(t) * (1 - Math.cos(t) * 0.5) * 0.95;
    const shell = r() < 0.85 ? 1 : Math.cbrt(r());
    p[0] = Math.cos(th) * R * shell;
    p[1] = Math.cos(t) * 1.6 - 0.2;
    p[2] = Math.sin(th) * R * shell;
  });

// 9 · tower cluster (construction)
const towers: Gen = (n, r) => {
  const blocks = [
    [-0.9, -0.5, 0.45, 2.2],
    [-0.2, 0.2, 0.5, 3.2],
    [0.6, -0.3, 0.42, 2.6],
    [0.1, -0.9, 0.35, 1.6],
    [1.1, 0.6, 0.3, 1.4],
  ];
  return fill(n, (_, p) => {
    const b = blocks[Math.floor(r() * blocks.length)];
    const face = Math.floor(r() * 4);
    const s = r() * 2 - 1;
    const h = r();
    const fx = face < 2 ? (face === 0 ? -1 : 1) : s;
    const fz = face >= 2 ? (face === 2 ? -1 : 1) : s;
    const floor = Math.round(h * 14) / 14;
    const y = r() < 0.6 ? floor : h;
    p[0] = b[0] + fx * b[2];
    p[1] = y * b[3] - 1.5;
    p[2] = b[1] + fz * b[2];
  });
};

// 10 · paper roll (archimedean spiral cylinder)
const roll: Gen = (n, r) =>
  fill(n, (_, p) => {
    const t = r();
    const turns = 6;
    const a = t * TAU * turns;
    const R = 0.35 + t * 1.05;
    const unroll = r() < 0.18;
    if (unroll) {
      const s = r();
      p[0] = 1.4 + s * 0.2;
      p[1] = (r() * 2 - 1) * 1.1;
      p[2] = -s * 2.2 + 0.1;
      return;
    }
    p[0] = Math.cos(a) * R;
    p[1] = (r() * 2 - 1) * 1.1;
    p[2] = Math.sin(a) * R;
  });

// 11 · wireframe globe (technology)
const globe: Gen = (n, r) =>
  fill(n, (_, p) => {
    const R = 1.5;
    if (r() < 0.5) {
      const lat = (Math.floor(r() * 9) / 8 - 0.5) * Math.PI * 0.95;
      const lon = r() * TAU;
      p[0] = Math.cos(lat) * Math.cos(lon) * R;
      p[1] = Math.sin(lat) * R;
      p[2] = Math.cos(lat) * Math.sin(lon) * R;
    } else {
      const lon = (Math.floor(r() * 12) / 12) * TAU;
      const lat = (r() - 0.5) * Math.PI;
      p[0] = Math.cos(lat) * Math.cos(lon) * R;
      p[1] = Math.sin(lat) * R;
      p[2] = Math.cos(lat) * Math.sin(lon) * R;
    }
  });

// 12 · saddle (a sculptural lounger)
const saddle: Gen = (n, r) =>
  fill(n, (_, p) => {
    const a = r() * TAU;
    const rad = Math.sqrt(r()) * 1.7;
    const x = Math.cos(a) * rad;
    const z = Math.sin(a) * rad;
    p[0] = x;
    p[1] = (x * x - z * z) * 0.32;
    p[2] = z;
  });

// 13 · lotus (CSR / care)
const lotus: Gen = (n, r) =>
  fill(n, (_, p) => {
    const layer = Math.floor(r() * 3);
    const petals = [6, 8, 10][layer];
    const th = r() * TAU;
    const petal = Math.abs(Math.cos((petals / 2) * th));
    const t = Math.sqrt(r());
    const R = t * petal * [1.0, 1.4, 1.8][layer];
    p[0] = Math.cos(th) * R;
    p[1] = Math.pow(t, 2) * [1.1, 0.75, 0.4][layer] * petal - 0.4 + gauss(r) * 0.02;
    p[2] = Math.sin(th) * R;
  });

const generators: Gen[] = [core, torus, knot, ribbon, helix, rings, galaxy, lattice, drop, towers, roll, globe, saddle, lotus];

export const SHAPE_COUNT = generators.length;

const cache = new Map<string, Float32Array>();

export function getShape(index: number, count: number) {
  const i = ((index % SHAPE_COUNT) + SHAPE_COUNT) % SHAPE_COUNT;
  const key = `${i}:${count}`;
  let arr = cache.get(key);
  if (!arr) {
    arr = generators[i](count, mulberry32(1000 + i * 7919));
    // Shuffle order so particles travel to random spots, not neighbours.
    const rand = mulberry32(42 + i);
    for (let k = count - 1; k > 0; k--) {
      const j = Math.floor(rand() * (k + 1));
      for (let c = 0; c < 3; c++) {
        const tmp = arr[k * 3 + c];
        arr[k * 3 + c] = arr[j * 3 + c];
        arr[j * 3 + c] = tmp;
      }
    }
    cache.set(key, arr);
  }
  return arr;
}

export function scatter(count: number) {
  const r = mulberry32(7);
  return fill(count, (_, p) => {
    const R = 4 + r() * 6;
    const th = r() * TAU;
    const ph = Math.acos(2 * r() - 1);
    p[0] = R * Math.sin(ph) * Math.cos(th);
    p[1] = R * Math.cos(ph);
    p[2] = R * Math.sin(ph) * Math.sin(th) - 2;
  });
}
