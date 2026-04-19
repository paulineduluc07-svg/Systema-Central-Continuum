"use client";

import { useRef, useEffect, Suspense, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore } from "@/stores/sceneStore";

// ─── Stylized placeholder — shown while GLB loads or when no URL is set ───────
function AvatarPlaceholder({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.7) * 0.05;
    }
  });

  const glassMat: React.ComponentProps<"meshPhysicalMaterial"> = {
    color: "#ff5f7c",
    emissive: "#ff2050",
    emissiveIntensity: 0.3,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85,
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshPhysicalMaterial {...glassMat} color="#c8a080" emissive="#ff8040" emissiveIntensity={0.15} metalness={0.1} roughness={0.5} opacity={1} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.52, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 12]} />
        <meshPhysicalMaterial {...glassMat} color="#c8a080" emissive="#ff8040" emissiveIntensity={0.1} metalness={0.1} roughness={0.5} opacity={1} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.1, 0]}>
        <capsuleGeometry args={[0.17, 0.5, 8, 16]} />
        <meshPhysicalMaterial {...glassMat} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.27, 1.1, 0]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.06, 0.45, 6, 12]} />
        <meshPhysicalMaterial {...glassMat} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.27, 1.1, 0]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.06, 0.45, 6, 12]} />
        <meshPhysicalMaterial {...glassMat} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.1, 0.38, 0]}>
        <capsuleGeometry args={[0.08, 0.62, 6, 12]} />
        <meshPhysicalMaterial {...glassMat} color="#cc2060" emissive="#ff1050" emissiveIntensity={0.2} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.1, 0.38, 0]}>
        <capsuleGeometry args={[0.08, 0.62, 6, 12]} />
        <meshPhysicalMaterial {...glassMat} color="#cc2060" emissive="#ff1050" emissiveIntensity={0.2} />
      </mesh>
      {/* Pink glow at feet */}
      <pointLight color="#ff5f7c" intensity={3} distance={3} position={[0, -0.3, 0.4]} />
    </group>
  );
}

// ─── Real GLB Model ───────────────────────────────────────────────────────────
const AvatarModel = memo(function AvatarModel({
  url,
  position,
}: {
  url: string;
  position: [number, number, number];
}) {
  const { scene, animations } = useGLTF(url);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const headRef   = useRef<THREE.Object3D | null>(null);
  const spineRef  = useRef<THREE.Object3D | null>(null);
  const { avatarAnimation } = useSceneStore();

  useEffect(() => {
    // PBR setup + bone extraction
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        if (obj.material instanceof THREE.MeshStandardMaterial) {
          obj.material.envMapIntensity = 1.4;
          obj.material.needsUpdate = true;
        }
      }
      // Grab bones by common RPM/Mixamo names
      const n = obj.name;
      if (n === "Head" || n === "mixamorigHead") headRef.current = obj;
      if (n === "Spine" || n === "Spine1" || n === "mixamorigSpine")
        spineRef.current = obj;
    });

    // Animation mixer
    const mixer = new THREE.AnimationMixer(scene);
    mixerRef.current = mixer;

    // Play first clip if available (e.g. from RPM or bundled animations)
    if (animations.length > 0) {
      mixer.clipAction(animations[0]).play();
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [scene, animations]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    mixerRef.current?.update(delta);

    // Procedural idle: breathing + micro head sway (always active)
    if (spineRef.current) {
      spineRef.current.scale.y = 1 + Math.sin(t * 1.1) * 0.012;
    }
    if (headRef.current) {
      if (avatarAnimation === "idle") {
        headRef.current.rotation.x = Math.sin(t * 0.38) * 0.022;
        headRef.current.rotation.z = Math.sin(t * 0.29) * 0.016;
      } else if (avatarAnimation === "wave") {
        // Nod: acknowledge message
        headRef.current.rotation.x = Math.sin(t * 2.8) * 0.07;
      } else if (avatarAnimation === "sit") {
        headRef.current.rotation.x = -0.08 + Math.sin(t * 0.3) * 0.01;
      }
    }
  });

  return (
    <group>
      <primitive object={scene} position={position} />
      <pointLight color="#ff5f7c" intensity={3} distance={3.5} position={[position[0], position[1] - 0.5, position[2] + 0.5]} />
    </group>
  );
});

// ─── Public component ─────────────────────────────────────────────────────────
interface KimAvatarGLBProps {
  position?: [number, number, number];
}

export function KimAvatarGLB({ position = [-1.5, -2.5, -3] }: KimAvatarGLBProps) {
  const url = process.env.NEXT_PUBLIC_AVATAR_URL || "/models/kim-avatar.glb";

  if (!url) {
    return <AvatarPlaceholder position={position} />;
  }

  return (
    <Suspense fallback={<AvatarPlaceholder position={position} />}>
      <AvatarModel url={url} position={position} />
    </Suspense>
  );
}
