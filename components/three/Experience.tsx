"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import ParticleSculpture from "./ParticleSculpture";
import ParticleOcean from "./ParticleOcean";

export default function Experience() {
  const [quality, setQuality] = useState<"low" | "high" | null>(null);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 768px)").matches;
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    setQuality(small || lowCores ? "low" : "high");
  }, []);

  if (!quality) return null;
  const high = quality === "high";

  return (
    <div className="webgl" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, high ? 1.75 : 1.25]}
        camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <ParticleOcean cols={high ? 220 : 120} rows={high ? 120 : 70} />
        <ParticleSculpture count={high ? 16000 : 7000} />
      </Canvas>
    </div>
  );
}
