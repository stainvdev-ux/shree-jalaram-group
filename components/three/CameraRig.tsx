"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { INTRO_X, JOURNEY_START_X, cameraXForProgress, centerY } from "@/lib/ribbon";
import { scene } from "@/lib/scene";

// Every camera value is damped toward its target, so scroll, pointer and page
// changes glide instead of snapping.
export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const look = useRef(new THREE.Vector3(INTRO_X, 0.3, 0));
  const smoothP = useRef(0);

  useEffect(() => {
    scene.camera = camera;
    camera.position.set(INTRO_X, 0.3, 12);
    return () => {
      scene.camera = null;
    };
  }, [camera]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    scene.time = t;
    const ease = (e: number) => 1 - Math.pow(1 - e, delta * 60);

    smoothP.current += (scene.progress - smoothP.current) * ease(0.08);
    const x = scene.mode === "journey" ? cameraXForProgress(smoothP.current) : scene.ambientX + Math.sin(t * 0.05) * 2.5;

    // 0 at the "1977" intro, 1 once on the ribbon.
    const onRibbon = THREE.MathUtils.clamp((x - INTRO_X) / (JOURNEY_START_X - INTRO_X), 0, 1);
    const narrow = size.width / size.height < 1;
    const dist = (narrow ? 15 : 10.5) + (1 - onRibbon) * (narrow ? 6 : 1.5);
    const ribbonY = centerY(x, t);

    const tx = x + scene.pointer.x * 0.35;
    const ty = THREE.MathUtils.lerp(0.3, ribbonY * 0.55, onRibbon) + scene.pointer.y * 0.25;
    camera.position.x += (tx - camera.position.x) * ease(0.07);
    camera.position.y += (ty - camera.position.y) * ease(0.05);
    camera.position.z += (dist - camera.position.z) * ease(0.05);

    const lx = x + (scene.mode === "ambient" ? 1.5 : 0);
    const ly = THREE.MathUtils.lerp(0.3, ribbonY * 0.8, onRibbon);
    look.current.x += (lx - look.current.x) * ease(0.08);
    look.current.y += (ly - look.current.y) * ease(0.06);
    camera.lookAt(look.current);

    scene.overlay?.(camera, t);
  });

  return null;
}
