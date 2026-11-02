"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { MARK_OUTLINE } from "@/lib/markShape";
import { JOURNEY_END_X, MARK_X, centerY } from "@/lib/ribbon";
import { scene } from "@/lib/scene";

// The Group's drop mark as a glass sculpture: the traced logo outline,
// Chaikin-smoothed, extruded with a deep bevel and rendered with physical
// transmission, dispersion and iridescence against a generated studio env.

function chaikin(pts: THREE.Vector2[], iterations: number) {
  let out = pts;
  for (let k = 0; k < iterations; k++) {
    const next: THREE.Vector2[] = [];
    for (let i = 0; i < out.length; i++) {
      const p = out[i];
      const q = out[(i + 1) % out.length];
      next.push(new THREE.Vector2(p.x * 0.75 + q.x * 0.25, p.y * 0.75 + q.y * 0.25));
      next.push(new THREE.Vector2(p.x * 0.25 + q.x * 0.75, p.y * 0.25 + q.y * 0.75));
    }
    out = next;
  }
  return out;
}

export default function Mark3D({ detail }: { detail: number }) {
  const gl = useThree((s) => s.gl);
  const threeScene = useThree((s) => s.scene);
  const group = useRef<THREE.Group>(null);
  const appear = useRef(0);

  // Studio lighting for physical materials only (the shader layers ignore it).
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    threeScene.environment = env;
    return () => {
      threeScene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, threeScene]);

  const geometry = useMemo(() => {
    const raw: THREE.Vector2[] = [];
    for (let i = 0; i < MARK_OUTLINE.length; i += 2) raw.push(new THREE.Vector2(MARK_OUTLINE[i], MARK_OUTLINE[i + 1]));
    const shape = new THREE.Shape(chaikin(raw, 2));
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.2,
      steps: 1,
      curveSegments: 1,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.03,
      bevelSegments: detail,
    });
    g.center();
    g.computeVertexNormals();
    return g;
  }, [detail]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.03,
        metalness: 0,
        transmission: 1,
        thickness: 0.55,
        ior: 1.45,
        dispersion: 0.6,
        iridescence: 1,
        iridescenceIOR: 1.35,
        iridescenceThicknessRange: [200, 700],
        attenuationColor: new THREE.Color("#d9f4ff"),
        attenuationDistance: 6,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        specularIntensity: 1,
        envMapIntensity: 2.2,
        transparent: true,
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const k = 1 - Math.pow(1 - 0.05, delta * 60);
    // Grow in as the camera approaches the end of the ribbon.
    const cam = state.camera.position.x;
    const near = THREE.MathUtils.smoothstep(cam, MARK_X - 26, MARK_X - 8);
    appear.current += (near * Math.min(1, scene.intro) - appear.current) * k;
    // Portrait screens: centre the mark under the closing caption, a bit smaller.
    const narrow = state.size.width < state.size.height;
    const mx = narrow ? JOURNEY_END_X : MARK_X;
    const s = 3.3 * (narrow ? 0.78 : 1) * (0.6 + 0.4 * appear.current);
    g.scale.setScalar(s);
    g.visible = appear.current > 0.01;
    material.opacity = appear.current;
    g.position.set(mx, centerY(mx, t) * 0.6 + (narrow ? -0.9 : 0.35) + Math.sin(t * 0.6) * 0.08, 0.6);
    g.rotation.y += (Math.sin(t * 0.25) * 0.45 + scene.pointer.x * 0.35 - g.rotation.y) * k;
    g.rotation.x += (-scene.pointer.y * 0.15 - g.rotation.x) * k;
    g.rotation.z = Math.sin(t * 0.18) * 0.04;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} />
      {/* Coloured rim lights give the glass its cyan / rose edges. */}
      <pointLight position={[-1.2, 0.8, 1]} color="#8ff0ff" intensity={3} decay={0} />
      <pointLight position={[1.3, -0.6, 0.9]} color="#ffb0cf" intensity={2.2} decay={0} />
      <pointLight position={[0, 0.2, -1.2]} color="#b9a8ff" intensity={1.5} decay={0} />
    </group>
  );
}
