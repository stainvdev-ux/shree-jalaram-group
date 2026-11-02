"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { INTRO_X, P_INTRO_END, P_RIBBON_START } from "@/lib/ribbon";
import { scene } from "@/lib/scene";

// "1977" sculpted from particles: wavy striations across the faces plus dense
// extruded edges, so the numerals read as solid 3D forms. On scroll the
// particles blow away toward the ribbon.

const WIDTH = 11; // world units

function sampleYear(text: string, max: number) {
  const W = 1400;
  const H = 560;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 430px "Inter Tight Variable", "Inter Tight", ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText(text, W / 2, H / 2 + 20);
  const data = ctx.getImageData(0, 0, W, H).data;
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && data[(y * W + x) * 4 + 3] > 128;

  const s = WIDTH / W;
  const depth = 1.7;
  const pts: number[] = [];
  const step = 3;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (!inside(x, y)) continue;
      const wx = (x - W / 2) * s;
      const wy = -(y - H / 2) * s;
      const edge = !inside(x - 6, y) || !inside(x + 6, y) || !inside(x, y - 6) || !inside(x, y + 6);
      if (edge) {
        for (let k = 0; k < 7; k++) pts.push(wx, wy, (Math.random() - 0.5) * depth);
        continue;
      }
      // Fingerprint-like striations on the faces.
      const wave = (y + 10 * Math.sin(x * 0.017) + 6 * Math.sin(x * 0.047 + y * 0.012)) % 8;
      if (wave < 2.4) pts.push(wx, wy, depth / 2);
      if (wave > 5 && wave < 6.2 && Math.random() < 0.5) pts.push(wx, wy, -depth / 2);
    }
  }
  // Shuffle and cap.
  const n = pts.length / 3;
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const count = Math.min(n, max);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const k = idx[i];
    out[i * 3] = pts[k * 3] + (Math.random() - 0.5) * 0.02;
    out[i * 3 + 1] = pts[k * 3 + 1] + (Math.random() - 0.5) * 0.02;
    out[i * 3 + 2] = pts[k * 3 + 2];
  }
  return out;
}

const vertexShader = /* glsl */ `
  precision highp float;
  attribute vec4 aRand;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uAssemble;
  uniform float uDisperse;
  varying float vAlpha;
  varying float vFront;

  void main() {
    vec3 dir = normalize(aRand.xyz - 0.5 + 1e-4);
    vec3 p = position;
    p.z += 0.07 * sin(p.x * 1.6 + uTime * 1.1 + p.y * 0.8);

    float a = clamp(uAssemble * 1.4 - aRand.w * 0.4, 0.0, 1.0);
    a = a * a * (3.0 - 2.0 * a);
    p = mix(p + dir * (6.0 + aRand.w * 8.0), p, a);

    float d = clamp(uDisperse * 1.5 - aRand.x * 0.5, 0.0, 1.0);
    p += dir * d * (3.0 + aRand.y * 6.0) + vec3(d * d * 16.0, d * 1.5, d * 2.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aRand.y) * uPixelRatio / -mv.z;
    vFront = smoothstep(-0.9, 0.9, position.z);
    vAlpha = a * (1.0 - d) * (0.7 + aRand.z * 0.3);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  varying float vFront;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d);
    if (a < 0.02) discard;
    vec3 col = mix(vec3(0.12, 0.42, 1.0), vec3(0.55, 0.95, 1.0), vFront);
    gl_FragColor = vec4(col, a * vAlpha);
    #include <colorspace_fragment>
  }
`;

export default function IntroYear({ max }: { max: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const group = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const assembled = useRef(0);

  useEffect(() => {
    let alive = true;
    const font = `800 100px "Inter Tight Variable"`;
    (document.fonts?.load(font) ?? Promise.resolve())
      .catch(() => undefined)
      .then(() => {
        if (alive) setPositions(sampleYear("1977", max));
      });
    return () => {
      alive = false;
    };
  }, [max]);

  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 21 },
        uPixelRatio: { value: 1 },
        uAssemble: { value: 0 },
        uDisperse: { value: 0 },
      },
    });
    if (positions) {
      const n = positions.length / 3;
      const rand = new Float32Array(n * 4);
      for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
      g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    }
    return { geometry: g, material: m };
  }, [positions]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.pow(1 - 0.06, delta * 60);
    u.uTime.value = state.clock.elapsedTime;
    u.uPixelRatio.value = dpr;
    // Assemble once, after the preloader.
    if (scene.intro > 0) assembled.current = Math.min(1, assembled.current + delta / 2.6);
    u.uAssemble.value = assembled.current;
    const disperse =
      scene.mode === "journey" ? THREE.MathUtils.smoothstep(scene.progress, P_INTRO_END * 0.5, P_RIBBON_START) : 1;
    u.uDisperse.value += (disperse - u.uDisperse.value) * k;
    g.visible = u.uDisperse.value < 0.995;
    g.rotation.y += (scene.pointer.x * 0.18 - 0.08 - g.rotation.y) * k;
    g.rotation.x += (-scene.pointer.y * 0.12 + 0.04 - g.rotation.x) * k;
  });

  return (
    <group ref={group} position={[INTRO_X, 0.35, 0]}>
      {positions && <points geometry={geometry} material={material} frustumCulled={false} />}
    </group>
  );
}
