"use client";

import { Float, Grid, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type SceneProps = { reducedMotion: boolean; compact: boolean };

function sample(index: number, offset: number) {
  const value = Math.sin(index * 12.9898 + offset * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function Core({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current || !inner.current) return;
    const speed = reducedMotion ? 0 : 0.28;
    group.current.rotation.y += delta * speed;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      reducedMotion ? 0.15 : state.pointer.y * 0.22 + 0.15,
      0.04,
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      reducedMotion ? 0 : -state.pointer.x * 0.18,
      0.04,
    );
    inner.current.rotation.y -= delta * speed * 1.7;
  });

  return (
    <Float speed={reducedMotion ? 0 : 1.4} rotationIntensity={0.14} floatIntensity={0.35}>
      <group ref={group} rotation={[0.15, 0.2, 0]}>
        <mesh ref={inner}>
          <icosahedronGeometry args={[0.92, 4]} />
          <meshStandardMaterial
            color="#071c1c"
            emissive="#00f0c8"
            emissiveIntensity={0.72}
            metalness={0.88}
            roughness={0.18}
            flatShading
          />
        </mesh>
        <mesh scale={1.075}>
          <icosahedronGeometry args={[0.92, 2]} />
          <meshBasicMaterial color="#9dff00" wireframe transparent opacity={0.72} />
        </mesh>
        {[1.34, 1.58, 1.84].map((radius, index) => (
          <mesh
            key={radius}
            rotation={[Math.PI / 2 + index * 0.31, index * 0.72, index * 0.48]}
          >
            <torusGeometry args={[radius, index === 1 ? 0.012 : 0.022, 12, 160]} />
            <meshBasicMaterial
              color={index === 1 ? "#9dff00" : "#00e8ff"}
              transparent
              opacity={index === 1 ? 0.62 : 0.42}
            />
          </mesh>
        ))}
        <pointLight color="#00f0c8" intensity={18} distance={6} />
      </group>
    </Float>
  );
}

function DataFragments({ compact }: { compact: boolean }) {
  const fragments = useMemo(
    () =>
      Array.from({ length: compact ? 34 : 72 }, (_, index) => ({
        position: [
          (sample(index, 1) - 0.5) * 7,
          (sample(index, 2) - 0.5) * 5,
          (sample(index, 3) - 0.5) * 3 - 1,
        ] as [number, number, number],
        scale: 0.025 + sample(index, 4) * 0.08,
        color: index % 5 === 0 ? "#9dff00" : "#00e8ff",
      })),
    [compact],
  );

  return (
    <group>
      {fragments.map((fragment, index) => (
        <mesh key={index} position={fragment.position} rotation={[0, 0, index * 0.71]}>
          <boxGeometry args={[fragment.scale * 4, fragment.scale, fragment.scale]} />
          <meshBasicMaterial color={fragment.color} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function HologramScene({ reducedMotion, compact }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 5.6], fov: 42 }}
      dpr={compact ? [1, 1.15] : [1, 1.65]}
      gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[4, 4, 5]} intensity={1.8} color="#d8ffff" />
      <Core reducedMotion={reducedMotion} />
      <DataFragments compact={compact} />
      {!compact && (
        <Sparkles count={90} scale={[7, 5, 3]} size={1.25} speed={0.2} color="#caff3a" />
      )}
      <Grid
        position={[0, -2.18, 0]}
        args={[18, 18]}
        cellSize={0.55}
        cellThickness={0.45}
        cellColor="#005e61"
        sectionSize={2.2}
        sectionThickness={0.75}
        sectionColor="#00a6a8"
        fadeDistance={8}
        fadeStrength={1.4}
        infiniteGrid
      />
      {!compact && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.72} luminanceThreshold={0.32} luminanceSmoothing={0.7} mipmapBlur />
          <Noise opacity={0.025} />
          <Vignette offset={0.35} darkness={0.72} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
