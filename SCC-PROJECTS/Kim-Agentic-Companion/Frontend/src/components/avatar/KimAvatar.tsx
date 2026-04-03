"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Billboard } from "@react-three/drei";
import * as THREE from "three";

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Removes near-white background via smoothstep fade
const FRAGMENT_SHADER = `
  uniform sampler2D map;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(map, vUv);
    float brightness = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    float alpha = 1.0 - smoothstep(0.87, 0.97, brightness);
    gl_FragColor = vec4(tex.rgb, tex.a * alpha);
  }
`;

interface KimAvatarProps {
  position?: [number, number, number];
}

export function KimAvatar({ position = [-2, 0.5, -4] }: KimAvatarProps) {
  const texture = useTexture("/models/kim-avatar.png");
  const groupRef = useRef<THREE.Group>(null!);

  const uniforms = useMemo(
    () => ({ map: { value: texture } }),
    [texture]
  );

  // Subtle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Billboard lockX lockZ>
        {/* Pink glow halo behind avatar */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[3.0, 5.8]} />
          <meshBasicMaterial
            color="#ff5f7c"
            transparent
            opacity={0.08}
          />
        </mesh>

        {/* Avatar image with white-bg removal */}
        <mesh>
          <planeGeometry args={[2.4, 4.8]} />
          <shaderMaterial
            vertexShader={VERTEX_SHADER}
            fragmentShader={FRAGMENT_SHADER}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>
      </Billboard>

      {/* Floor glow at her feet */}
      <pointLight
        color="#ff5f7c"
        intensity={4}
        distance={3.5}
        position={[0, -2.2, 0.5]}
      />
    </group>
  );
}
