"use client";

import { Suspense, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { FurniturePiece } from "@/stores/roomStore";

// ─── Procedural shape placeholder ─────────────────────────────────────────────
function FurniturePlaceholder({ piece }: { piece: FurniturePiece }) {
  const pos = piece.position;
  const rot = (piece.rotation ?? [0, 0, 0]) as [number, number, number];

  if (piece.id === "couch") {
    return (
      <group position={pos} rotation={rot}>
        {/* Seat cushion */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 0.4, 0.9]} />
          <meshPhysicalMaterial color="#5c3d6e" roughness={0.7} metalness={0} />
        </mesh>
        {/* Back rest */}
        <mesh position={[0, 0.55, -0.4]}>
          <boxGeometry args={[2.2, 0.7, 0.18]} />
          <meshPhysicalMaterial color="#5c3d6e" roughness={0.7} metalness={0} />
        </mesh>
        {/* Armrests */}
        {([-1.05, 1.05] as const).map((x) => (
          <mesh key={x} position={[x, 0.2, 0]}>
            <boxGeometry args={[0.18, 0.5, 0.9]} />
            <meshPhysicalMaterial color="#4a2c5c" roughness={0.6} />
          </mesh>
        ))}
      </group>
    );
  }

  if (piece.id === "lamp") {
    return (
      <group position={pos} rotation={rot}>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
          <meshPhysicalMaterial color="#888" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <coneGeometry args={[0.35, 0.4, 12, 1, true]} />
          <meshPhysicalMaterial
            color="#fff0c8"
            emissive="#ffd080"
            emissiveIntensity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight color="#ffd080" intensity={4} distance={6} position={[0, 1.4, 0]} />
      </group>
    );
  }

  if (piece.id === "rug") {
    return (
      <mesh position={pos} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 40]} />
        <meshPhysicalMaterial
          color="#3a1a5c"
          roughness={0.95}
          emissive="#2a0a4a"
          emissiveIntensity={0.08}
        />
      </mesh>
    );
  }

  // Generic fallback box
  return (
    <mesh position={pos}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshPhysicalMaterial color="#444" roughness={0.8} />
    </mesh>
  );
}

// ─── Real GLB loader ──────────────────────────────────────────────────────────
function FurnitureGLB({ piece }: { piece: FurniturePiece }) {
  const { scene } = useGLTF(piece.modelPath);
  const groupRef = useRef<THREE.Group>(null!);

  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      if (obj.material instanceof THREE.MeshStandardMaterial) {
        obj.material.envMapIntensity = 1.2;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={piece.position}
      rotation={(piece.rotation as any) ?? [0, 0, 0]}
      scale={piece.scale ?? 1}
    >
      <primitive object={scene} />
    </group>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
export function FurnitureItem({ piece }: { piece: FurniturePiece }) {
  if (!piece.visible) return null;
  if (!piece.modelPath) return <FurniturePlaceholder piece={piece} />;
  return (
    <Suspense fallback={<FurniturePlaceholder piece={piece} />}>
      <FurnitureGLB piece={piece} />
    </Suspense>
  );
}