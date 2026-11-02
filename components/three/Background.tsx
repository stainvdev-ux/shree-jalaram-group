"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/scene";

// Full-screen gradient drawn inside WebGL (so bloom composites correctly).
// It drifts from violet to teal as the journey advances, with soft light
// pools that slowly wander.

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform float uTone;
  uniform float uTime;
  uniform float uAspect;
  uniform vec3 uAccent;
  uniform float uAccentMix;
  varying vec2 vUv;

  vec3 violet = vec3(0.36, 0.25, 0.58);
  vec3 indigo = vec3(0.24, 0.30, 0.60);
  vec3 teal   = vec3(0.12, 0.42, 0.48);
  vec3 deep   = vec3(0.07, 0.10, 0.24);

  void main() {
    vec2 uv = vUv;
    float diag = clamp(uv.x * 0.75 + (1.0 - uv.y) * 0.25, 0.0, 1.0);
    vec3 left = mix(violet, indigo, uTone);
    vec3 right = mix(indigo, teal, uTone);
    vec3 col = mix(left, right, diag);

    // Wandering light pools.
    vec2 p = vec2(uv.x * uAspect, uv.y);
    vec2 c1 = vec2(uAspect * (0.25 + 0.1 * sin(uTime * 0.05)), 0.7 + 0.08 * cos(uTime * 0.04));
    vec2 c2 = vec2(uAspect * (0.8 + 0.08 * cos(uTime * 0.06)), 0.25 + 0.1 * sin(uTime * 0.05));
    col += 0.06 * smoothstep(0.65, 0.0, distance(p, c1));
    col += 0.05 * smoothstep(0.6, 0.0, distance(p, c2)) * vec3(0.6, 0.9, 1.0);

    col = mix(col, uAccent * 0.55, uAccentMix);

    // Deepen the bottom and the corners for legibility.
    col = mix(deep, col, smoothstep(-0.35, 0.65, uv.y) * 0.35 + 0.65);
    float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5)));
    col *= mix(0.72, 1.0, vig);

    // Colours above are authored in sRGB; the composer works in linear light.
    col = pow(col, vec3(2.2));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export default function Background() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uTone: { value: 0 },
          uTime: { value: 0 },
          uAspect: { value: 1 },
          uAccent: { value: new THREE.Color("#ffffff") },
          uAccentMix: { value: 0 },
        },
      }),
    [],
  );
  const target = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const k = 1 - Math.pow(1 - 0.05, delta * 60);
    const tone = scene.mode === "journey" ? Math.min(1, scene.progress * 1.15) : scene.tone;
    u.uTone.value += (tone - u.uTone.value) * k;
    u.uTime.value = state.clock.elapsedTime;
    u.uAspect.value = state.size.width / state.size.height;
    const accentOn = scene.accent ? 0.16 : 0;
    if (scene.accent) {
      target.set(scene.accent);
      u.uAccent.value.lerp(target, k);
    }
    u.uAccentMix.value += (accentOn - u.uAccentMix.value) * k;
  });

  return (
    <mesh renderOrder={-10} frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
