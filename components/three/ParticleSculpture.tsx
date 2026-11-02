"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { scene } from "@/lib/scene";
import { getShape, scatter } from "./shapes";

const vertexShader = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec4 aRand;

  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uScatter;
  uniform float uDim;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform vec3 uColor;
  uniform vec3 uGold;

  varying vec3 vColor;
  varying float vAlpha;

  float morph(float mixValue, float stagger) {
    float m = clamp(mixValue * 1.6 - stagger * 0.6, 0.0, 1.0);
    return m * m * (3.0 - 2.0 * m);
  }

  void main() {
    float m = morph(uMix, aRand.x);
    vec3 p = mix(aFrom, aTo, m);

    // Particles burst outward mid-morph, then settle into the new form.
    float burst = sin(m * 3.14159265);
    p += normalize(p + 1e-4) * burst * uScatter * (0.35 + aRand.y);

    // Slow organic drift.
    float t = uTime * 0.35;
    p += 0.055 * vec3(
      sin(p.y * 2.1 + t + aRand.z * 6.2831),
      sin(p.z * 2.3 + t * 1.3 + aRand.x * 6.2831),
      sin(p.x * 1.9 + t * 0.9)
    );

    // Pointer pushes particles aside.
    vec2 d = p.xy - uMouse.xy;
    float dist = length(d);
    p.xy += normalize(d + 1e-4) * smoothstep(1.1, 0.0, dist) * 0.38 * uMouseStrength;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.45 + aRand.y * 1.25) * uPixelRatio / -mv.z;

    float twinkle = 0.75 + 0.25 * sin(uTime * (1.0 + aRand.w * 2.0) + aRand.z * 40.0);
    vColor = mix(uColor, uGold, aRand.z * 0.55) * (0.8 + burst * 0.6);
    vAlpha = uDim * (0.3 + 0.7 * aRand.w) * twinkle;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
    #include <colorspace_fragment>
  }
`;

// Same easing the shader applies, so a morph can be snapshotted mid-flight.
function morphCPU(mix: number, stagger: number) {
  const m = Math.min(1, Math.max(0, mix * 1.6 - stagger * 0.6));
  return m * m * (3 - 2 * m);
}

export default function ParticleSculpture({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const dpr = useThree((s) => s.viewport.dpr);
  const size = useThree((s) => s.size);

  const state = useRef({
    target: -1,
    introStarted: false,
    mix: { v: 0 },
    tween: null as gsap.core.Tween | null,
    color: new THREE.Color(scene.color),
    tmp: new THREE.Color(),
    mouse: new THREE.Vector3(),
    mouseStrength: 0,
  });

  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const from = scatter(count);
    const to = getShape(scene.shape, count);
    const rand = new Float32Array(count * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aFrom", new THREE.BufferAttribute(from.slice(), 3));
    g.setAttribute("aTo", new THREE.BufferAttribute(to.slice(), 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 30 },
        uPixelRatio: { value: 1 },
        uScatter: { value: 0.9 },
        uDim: { value: 1 },
        uMouse: { value: new THREE.Vector3(99, 99, 0) },
        uMouseStrength: { value: 0 },
        uColor: { value: new THREE.Color(scene.color) },
        uGold: { value: new THREE.Color("#f3dfb1") },
      },
    });
    return { geometry: g, material: m };
  }, [count]);

  const morphTo = (shape: number) => {
    const s = state.current;
    const from = geometry.getAttribute("aFrom") as THREE.BufferAttribute;
    const to = geometry.getAttribute("aTo") as THREE.BufferAttribute;
    const rand = geometry.getAttribute("aRand") as THREE.BufferAttribute;
    const fa = from.array as Float32Array;
    const ta = to.array as Float32Array;
    const ra = rand.array as Float32Array;
    const mix = s.mix.v;
    // Snapshot where every particle is right now, then head for the new shape.
    for (let i = 0; i < count; i++) {
      const m = morphCPU(mix, ra[i * 4]);
      for (let c = 0; c < 3; c++) {
        const k = i * 3 + c;
        fa[k] = fa[k] + (ta[k] - fa[k]) * m;
      }
    }
    ta.set(getShape(shape, count));
    from.needsUpdate = true;
    to.needsUpdate = true;
    s.tween?.kill();
    s.mix.v = 0;
    s.tween = gsap.to(s.mix, { v: 1, duration: 1.9, ease: "power2.inOut" });
    s.target = shape;
  };

  useFrame((frame, delta) => {
    const s = state.current;
    const u = material.uniforms;
    const g = group.current;
    if (!g) return;

    // Intro: assemble from the scattered cloud once the preloader lifts.
    if (!s.introStarted && scene.intro > 0) {
      s.introStarted = true;
      s.target = scene.shape;
      (geometry.getAttribute("aTo") as THREE.BufferAttribute).array.set(getShape(scene.shape, count));
      geometry.getAttribute("aTo").needsUpdate = true;
      s.tween = gsap.to(s.mix, { v: 1, duration: 2.8, ease: "power3.out" });
    } else if (s.introStarted && scene.shape !== s.target) {
      morphTo(scene.shape);
    }

    u.uMix.value = s.mix.v;
    u.uTime.value = frame.clock.elapsedTime;
    u.uPixelRatio.value = dpr;

    s.tmp.set(scene.color);
    s.color.lerp(s.tmp, Math.min(1, delta * 2.5));
    u.uColor.value.copy(s.color);
    const narrowDim = size.width / size.height < 1 ? 0.75 : 1;
    u.uDim.value += (scene.dim * narrowDim * Math.min(1, scene.intro * 1.2) - u.uDim.value) * Math.min(1, delta * 3);

    // Responsive placement: pull the sculpture toward center on narrow screens.
    const aspect = size.width / size.height;
    const narrow = aspect < 1;
    const k = 1 - Math.exp(-delta * 3);
    const tx = narrow ? scene.x * 0.25 : scene.x * Math.min(1, aspect / 1.6);
    const ty = narrow ? scene.y + 0.6 : scene.y;
    const ts = scene.scale * (narrow ? 0.72 : 1);
    g.position.x += (tx - g.position.x) * k;
    g.position.y += (ty - g.position.y) * k;
    g.scale.setScalar(g.scale.x + (ts - g.scale.x) * k);

    const vel = scene.scrollVelocity;
    g.rotation.y += delta * 0.1 + vel * 0.0006;
    g.rotation.x += (scene.pointer.y * 0.25 + 0.15 - g.rotation.x) * k;
    g.rotation.z += (-scene.pointer.x * 0.12 - g.rotation.z) * k;

    // Pointer → local space of the sculpture (ray hit on the z = 0 plane).
    const v = s.mouse.set(scene.pointer.x, scene.pointer.y, 0.5).unproject(camera);
    const dir = v.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    const hit = camera.position.clone().add(dir.multiplyScalar(dist));
    g.worldToLocal(hit);
    u.uMouse.value.lerp(hit, 0.2);
    s.mouseStrength += ((scene.pointer.x === 0 && scene.pointer.y === 0 ? 0 : 1) - s.mouseStrength) * k;
    u.uMouseStrength.value = s.mouseStrength;
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
