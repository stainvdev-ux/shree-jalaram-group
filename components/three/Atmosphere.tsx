"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RIBBON_LENGTH } from "@/lib/ribbon";
import { scene } from "@/lib/scene";

// Out-of-focus bokeh orbs and fine floating dust around the ribbon.

const vertexShader = /* glsl */ `
  precision highp float;
  attribute vec4 aRand;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uDim;
  uniform float uDrift;
  varying float vAlpha;
  varying float vTint;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * (0.05 + aRand.x * 0.1) + aRand.y * 6.28) * uDrift;
    p.x += cos(uTime * (0.04 + aRand.z * 0.08) + aRand.w * 6.28) * uDrift;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.35 + aRand.w) * uPixelRatio / -mv.z;
    float twinkle = 0.7 + 0.3 * sin(uTime * (0.5 + aRand.x) + aRand.z * 20.0);
    vAlpha = uDim * twinkle * (1.0 - smoothstep(22.0, 40.0, -mv.z)) * smoothstep(0.5, 2.0, -mv.z);
    vTint = aRand.y;
  }
`;

const bokehFragment = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vTint;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float disc = smoothstep(0.5, 0.44, d);
    float rim = smoothstep(0.5, 0.47, d) - smoothstep(0.47, 0.4, d);
    vec3 col = mix(vec3(0.70, 0.66, 1.0), vec3(0.62, 0.95, 1.0), vTint);
    gl_FragColor = vec4(col, (disc * 0.55 + rim * 0.35) * uOpacity * vAlpha);
    #include <colorspace_fragment>
  }
`;

const dustFragment = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vTint;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    if (a < 0.02) discard;
    gl_FragColor = vec4(mix(vec3(0.8, 0.85, 1.0), vec3(0.7, 1.0, 1.0), vTint), a * uOpacity * vAlpha);
    #include <colorspace_fragment>
  }
`;

function makeField(count: number, spread: { y: number; zMin: number; zMax: number }, fragmentShader: string, size: number, opacity: number, drift: number, additive: boolean) {
  const pos = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = -34 + Math.random() * (RIBBON_LENGTH + 54);
    pos[i * 3 + 1] = (Math.random() * 2 - 1) * spread.y;
    pos[i * 3 + 2] = spread.zMin + Math.random() * (spread.zMax - spread.zMin);
    for (let c = 0; c < 4; c++) rand[i * 4 + c] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
  const m = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: 1 },
      uDim: { value: 1 },
      uOpacity: { value: opacity },
      uDrift: { value: drift },
    },
  });
  return { g, m };
}

export default function Atmosphere({ bokeh, dust }: { bokeh: number; dust: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const orbs = useMemo(() => makeField(bokeh, { y: 7, zMin: -16, zMax: 5 }, bokehFragment, 1400, 0.22, 0.6, false), [bokeh]);
  const specks = useMemo(() => makeField(dust, { y: 8, zMin: -14, zMax: 6 }, dustFragment, 26, 0.75, 0.35, true), [dust]);

  useFrame((state, delta) => {
    const k = 1 - Math.pow(1 - 0.05, delta * 60);
    for (const f of [orbs, specks]) {
      const u = f.m.uniforms;
      u.uTime.value = state.clock.elapsedTime;
      u.uPixelRatio.value = dpr;
      u.uDim.value += (Math.min(1, scene.intro * 1.5) * (0.6 + scene.dim * 0.4) - u.uDim.value) * k;
    }
  });

  return (
    <>
      <points geometry={orbs.g} material={orbs.m} frustumCulled={false} renderOrder={-5} />
      <points geometry={specks.g} material={specks.m} frustumCulled={false} />
    </>
  );
}
