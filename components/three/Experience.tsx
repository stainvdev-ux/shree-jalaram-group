"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Background from "./Background";
import Ribbon from "./Ribbon";
import Atmosphere from "./Atmosphere";
import IntroYear from "./IntroYear";
import CameraRig from "./CameraRig";
import Effects from "./Effects";
import Mark3D from "./Mark3D";

type Quality = "low" | "high";

export default function Experience() {
  const [quality, setQuality] = useState<Quality | null>(null);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 768px)").matches;
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    setQuality(small || lowCores ? "low" : "high");
  }, []);

  if (!quality) return <div className="webgl webgl--fallback" aria-hidden="true" />;
  const high = quality === "high";

  return (
    <div className="webgl" aria-hidden="true">
      <Canvas
        dpr={[1, high ? 1.75 : 1.5]}
        camera={{ position: [-18, 0.3, 12], fov: 40, near: 0.1, far: 80 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance", toneMapping: THREE.NoToneMapping }}
        style={{ pointerEvents: "none" }}
      >
        <Background />
        <Atmosphere bokeh={high ? 70 : 36} dust={high ? 2600 : 1100} />
        <Ribbon strands={high ? 72 : 40} perStrand={high ? 2600 : 1200} pearls={high ? 70 : 40} />
        <IntroYear max={high ? 46000 : 20000} />
        <Mark3D detail={high ? 8 : 4} />
        <CameraRig />
        <Effects bloom={high} />
      </Canvas>
    </div>
  );
}
