"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function NebulaLights() {
  const pinkRef  = useRef<THREE.PointLight>(null!);
  const cyanRef  = useRef<THREE.PointLight>(null!);
  const purpleRef = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pinkRef.current)   pinkRef.current.intensity   = 2.5 + Math.sin(t * 0.7)  * 1.0;
    if (cyanRef.current)   cyanRef.current.intensity   = 1.8 + Math.sin(t * 0.5 + 1) * 0.6;
    if (purpleRef.current) purpleRef.current.intensity = 2.0 + Math.sin(t * 0.9 + 2) * 0.8;
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#1a1f4a" />
      <pointLight ref={pinkRef}   position={[-5, 4, 1]}  color="#ff5f7c" intensity={2.5} distance={14} />
      <pointLight ref={cyanRef}   position={[5, 3, -1]}  color="#68fff0" intensity={1.8} distance={12} />
      <pointLight ref={purpleRef} position={[0, 6, -5]}  color="#c47aff" intensity={2.0} distance={16} />
      <pointLight position={[0, 8, 0]} color="#ffffff"   intensity={0.8} distance={20} />
    </>
  );
}
