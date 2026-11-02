"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/scene";

// A rolling field of particles beneath the sculpture: a dark, grainy "ocean"
// that drifts forward faster as the visitor scrolls.

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uTravel;
  uniform float uPixelRatio;
  uniform vec3 uTint;

  varying float vAlpha;
  varying vec3 vColor;

  float wave(vec2 p, float t) {
    float h = 0.0;
    h += sin(p.x * 0.35 + t * 0.6) * 0.45;
    h += sin(p.y * 0.42 - t * 0.5 + p.x * 0.12) * 0.38;
    h += sin((p.x + p.y) * 0.9 + t * 1.1) * 0.12;
    h += sin(p.x * 1.7 - p.y * 1.3 + t * 1.6) * 0.05;
    return h;
  }

  void main() {
    vec3 p = position;
    vec2 q = vec2(p.x, p.z - uTravel);
    float h = wave(q, uTime);
    p.y += h;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = (2.2 + h * 1.4) * uPixelRatio * (9.0 / depth);

    float crest = smoothstep(-0.3, 0.9, h);
    vColor = mix(vec3(0.05, 0.12, 0.35), mix(vec3(0.42, 0.58, 1.0), uTint, 0.25), crest);
    float near = smoothstep(1.0, 4.0, depth);
    float far = 1.0 - smoothstep(14.0, 24.0, depth);
    vAlpha = near * far * (0.25 + crest * 0.75);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
    #include <colorspace_fragment>
  }
`;

export default function ParticleOcean({ cols, rows }: { cols: number; rows: number }) {
  const dpr = useThree((s) => s.viewport.dpr);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(cols * rows * 3);
    const w = 34;
    const d = 26;
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions[i++] = (c / (cols - 1) - 0.5) * w + (Math.random() - 0.5) * 0.05;
        positions[i++] = 0;
        positions[i++] = -(r / (rows - 1)) * d + 3;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -10), 40);
    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTravel: { value: 0 },
        uPixelRatio: { value: 1 },
        uTint: { value: new THREE.Color(scene.color) },
      },
    });
    return { geometry: g, material: m };
  }, [cols, rows]);

  const target = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uTravel.value += delta * (0.35 + Math.min(Math.abs(scene.scrollVelocity), 80) * 0.02);
    u.uPixelRatio.value = dpr;
    target.set(scene.color);
    u.uTint.value.lerp(target, Math.min(1, delta * 2));
  });

  return <points geometry={geometry} material={material} position={[0, -2.6, 0]} frustumCulled={false} />;
}
