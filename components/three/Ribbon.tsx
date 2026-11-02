"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RIBBON_GLSL, RIBBON_LENGTH } from "@/lib/ribbon";
import { scene } from "@/lib/scene";

// The flowing band: many parallel strands of dots streaming along the ribbon,
// plus glowing pearls resting on it.

const strandVertex = /* glsl */ `
  precision highp float;
  ${RIBBON_GLSL}
  attribute float aU;
  attribute float aV;
  attribute vec4 aRand;
  uniform float uTime;
  uniform float uLength;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uDim;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float speed = 0.45 + aRand.x * 0.25;
    float x = mod(aU * uLength + uTime * speed, uLength + 12.0) - 6.0;
    float v = aV + (aRand.y - 0.5) * 0.018;
    vec3 p = ribbonPos(x, v, uTime);
    p.y += 0.045 * sin(x * 1.3 + aV * 11.0 + uTime * 0.8);
    p.z += (aRand.z - 0.5) * 0.03;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float edge = smoothstep(0.55, 1.0, aV);
    float ends = smoothstep(-6.0, 4.0, x) * (1.0 - smoothstep(uLength - 4.0, uLength + 6.0, x));
    gl_PointSize = uSize * (0.55 + aRand.w * 0.9 + edge * 0.6) * uPixelRatio / -mv.z;

    vColor = mix(vec3(0.16, 0.62, 1.0), vec3(0.85, 1.0, 1.0), edge * 0.8 + aRand.w * 0.2);
    float depthFade = 1.0 - smoothstep(16.0, 34.0, -mv.z);
    vAlpha = (0.7 + 0.3 * edge) * (0.6 + aRand.w * 0.4) * ends * depthFade * uDim;
  }
`;

const dotFragment = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
    #include <colorspace_fragment>
  }
`;

const pearlVertex = /* glsl */ `
  precision highp float;
  ${RIBBON_GLSL}
  attribute float aX;
  attribute float aV;
  attribute vec4 aRand;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uDim;
  varying float vAlpha;

  void main() {
    vec3 p = ribbonPos(aX, aV, uTime);
    p += (aRand.xyz - 0.5) * vec3(0.0, 0.5, 0.7);
    p.y += 0.08 * sin(uTime * (0.4 + aRand.w) + aRand.x * 6.28);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aRand.w * 0.8) * uPixelRatio / -mv.z;
    vAlpha = uDim * (1.0 - smoothstep(16.0, 30.0, -mv.z));
  }
`;

const pearlFragment = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float body = smoothstep(0.5, 0.42, d);
    float glow = smoothstep(0.5, 0.0, d);
    vec3 col = mix(vec3(0.35, 0.85, 1.0), vec3(0.9, 1.0, 1.0), smoothstep(0.35, 0.0, length(c + vec2(0.12, 0.14))));
    gl_FragColor = vec4(col * (0.75 + glow * 0.5), body * 0.85 * vAlpha);
    #include <colorspace_fragment>
  }
`;

export default function Ribbon({ strands, perStrand, pearls }: { strands: number; perStrand: number; pearls: number }) {
  const dpr = useThree((s) => s.viewport.dpr);

  const strandsObj = useMemo(() => {
    // Extra points packed near the bright leading edge (v → 1).
    const edgeExtra = Math.round(strands * 0.35);
    const total = (strands + edgeExtra) * perStrand;
    const aU = new Float32Array(total);
    const aV = new Float32Array(total);
    const aRand = new Float32Array(total * 4);
    let i = 0;
    for (let s = 0; s < strands + edgeExtra; s++) {
      const v = s < strands ? -1 + (2 * s) / (strands - 1) : 0.82 + Math.random() * 0.18;
      for (let k = 0; k < perStrand; k++) {
        aU[i] = (k + Math.random() * 0.35) / perStrand;
        aV[i] = v;
        for (let c = 0; c < 4; c++) aRand[i * 4 + c] = Math.random();
        i++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(total * 3), 3));
    g.setAttribute("aU", new THREE.BufferAttribute(aU, 1));
    g.setAttribute("aV", new THREE.BufferAttribute(aV, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(aRand, 4));
    const m = new THREE.ShaderMaterial({
      vertexShader: strandVertex,
      fragmentShader: dotFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uLength: { value: RIBBON_LENGTH },
        uSize: { value: 13 },
        uPixelRatio: { value: 1 },
        uDim: { value: 1 },
      },
    });
    return { g, m };
  }, [strands, perStrand]);

  const pearlsObj = useMemo(() => {
    const aX = new Float32Array(pearls);
    const aV = new Float32Array(pearls);
    const aRand = new Float32Array(pearls * 4);
    for (let i = 0; i < pearls; i++) {
      aX[i] = Math.random() * RIBBON_LENGTH;
      aV[i] = Math.random() * 2 - 1;
      for (let c = 0; c < 4; c++) aRand[i * 4 + c] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pearls * 3), 3));
    g.setAttribute("aX", new THREE.BufferAttribute(aX, 1));
    g.setAttribute("aV", new THREE.BufferAttribute(aV, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(aRand, 4));
    const m = new THREE.ShaderMaterial({
      vertexShader: pearlVertex,
      fragmentShader: pearlFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 300 },
        uPixelRatio: { value: 1 },
        uDim: { value: 1 },
      },
    });
    return { g, m };
  }, [pearls]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const k = 1 - Math.pow(1 - 0.06, delta * 60);
    for (const m of [strandsObj.m, pearlsObj.m]) {
      m.uniforms.uTime.value = t;
      m.uniforms.uPixelRatio.value = dpr;
      m.uniforms.uDim.value += (scene.dim * Math.min(1, scene.intro * 1.5) - m.uniforms.uDim.value) * k;
    }
  });

  return (
    <>
      <points geometry={strandsObj.g} material={strandsObj.m} frustumCulled={false} />
      <points geometry={pearlsObj.g} material={pearlsObj.m} frustumCulled={false} />
    </>
  );
}
