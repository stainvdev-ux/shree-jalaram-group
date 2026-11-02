"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

// RenderPass → UnrealBloom (half resolution) → OutputPass (ACES + sRGB) →
// film grain. Rendering at priority 1 takes over from fiber's default render.

const GrainShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAmount: { value: 0.045 } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    precision mediump float;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAmount;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float n = hash(vUv * vec2(1920.0, 1080.0) + fract(uTime) * 100.0) - 0.5;
      c.rgb += n * uAmount;
      gl_FragColor = c;
    }
  `,
};

export default function Effects({ bloom }: { bloom: boolean }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);

  const { composer, grain, bloomPass } = useMemo(() => {
    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
    const c = new EffectComposer(gl, target);
    c.addPass(new RenderPass(scene, camera));
    const b = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.5, 0.5);
    if (bloom) c.addPass(b);
    c.addPass(new OutputPass());
    const g = new ShaderPass(GrainShader);
    c.addPass(g);
    return { composer: c, grain: g, bloomPass: b };
  }, [gl, scene, camera, bloom]);

  useEffect(() => {
    composer.setPixelRatio(dpr);
    composer.setSize(size.width, size.height);
    bloomPass.resolution.set(size.width / 2, size.height / 2);
  }, [composer, bloomPass, size, dpr]);

  useEffect(() => () => composer.dispose(), [composer]);

  useFrame((_, delta) => {
    grain.uniforms.uTime.value += delta;
    composer.render(delta);
  }, 1);

  return null;
}
