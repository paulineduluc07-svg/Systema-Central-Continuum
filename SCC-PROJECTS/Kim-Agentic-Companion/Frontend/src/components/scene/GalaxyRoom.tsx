"use client";

export function GalaxyRoom() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#060c22" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Floor glow reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.49, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color="#ff5f7c"
          emissive="#ff5f7c"
          emissiveIntensity={0.06}
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Back glass wall */}
      <mesh position={[0, 3, -10]}>
        <planeGeometry args={[30, 12]} />
        <meshPhysicalMaterial
          color="#2a3060"
          transparent
          opacity={0.1}
          roughness={0.02}
          metalness={0.05}
          side={2}
        />
      </mesh>

      {/* Left glass wall */}
      <mesh position={[-12, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshPhysicalMaterial
          color="#1e2850"
          transparent
          opacity={0.07}
          roughness={0.02}
          metalness={0.05}
          side={2}
        />
      </mesh>

      {/* Right glass wall */}
      <mesh position={[12, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshPhysicalMaterial
          color="#1e2850"
          transparent
          opacity={0.07}
          roughness={0.02}
          metalness={0.05}
          side={2}
        />
      </mesh>
    </group>
  );
}
