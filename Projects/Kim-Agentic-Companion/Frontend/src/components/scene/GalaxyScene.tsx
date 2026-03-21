"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";
import { Starfield } from "./Starfield";
import { NebulaLights } from "./NebulaLights";
import { GalaxyRoom } from "./GalaxyRoom";
import { KimAvatar } from "@/components/avatar/KimAvatar";

function CameraRig() {
  const targetRef = useRef(new THREE.Vector3(-2, 1.5, -4));

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Subtle slow orbit + floating
    state.camera.position.x = Math.sin(t * 0.04) * 1.2;
    state.camera.position.y = 2.5 + Math.sin(t * 0.025) * 0.25;
    state.camera.position.z = 9 + Math.cos(t * 0.04) * 0.6;
    state.camera.lookAt(targetRef.current);
  });
  return null;
}

function SceneContent() {
  return (
    <>
      <CameraRig />
      <NebulaLights />
      <GalaxyRoom />
      <Starfield count={2000} />
      <KimAvatar position={[-2, 0.5, -4]} />
      <Preload all />
    </>
  );
}

export function GalaxyScene({ className }: { className?: string }) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 2.5, 9], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      shadows={false}
    >
      <SceneContent />
    </Canvas>
  );
}
