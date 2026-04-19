"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

function AnimatedRimLight() {
  const ref = useRef<THREE.PointLight>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.intensity = 1.8 + Math.sin(state.clock.elapsedTime * 0.6) * 0.4;
    }
  });
  return (
    <pointLight
      ref={ref}
      position={[-1.5, 3, -7]}
      color="#ff5f7c"
      intensity={1.8}
      distance={10}
    />
  );
}

export function SceneLighting() {
  return (
    <>
      {/* HDR Environment for PBR reflections */}
      <Environment preset="night" environmentIntensity={0.6} />

      {/* Ambient — very dark, lets PBR do the work */}
      <ambientLight intensity={0.15} color="#0a0e28" />

      {/* Key light — warm, from front-top-right */}
      <directionalLight
        position={[3, 8, 5]}
        intensity={1.4}
        color="#fff4e0"
        castShadow={false}
      />

      {/* Fill light — cool, from left */}
      <pointLight
        position={[-6, 4, 2]}
        color="#8ab4f8"
        intensity={0.9}
        distance={15}
      />

      {/* Cyan accent — from right */}
      <pointLight
        position={[6, 2, 0]}
        color="#68fff0"
        intensity={0.7}
        distance={12}
      />

      {/* Rim light — pink, behind avatar, animated */}
      <AnimatedRimLight />

      {/* Purple nebula top */}
      <pointLight
        position={[0, 10, -5]}
        color="#c47aff"
        intensity={1.2}
        distance={20}
      />
    </>
  );
}
