"use client";

import { ContactShadows, Float, PresentationControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type SceneProps = { reducedMotion: boolean; compact: boolean };

function StudioMobile({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetX = reducedMotion ? -0.08 : state.pointer.y * 0.04 - 0.08;
    const targetY = reducedMotion ? -0.35 : -0.35;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.035);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.035);
    if (!reducedMotion) {
      group.current.rotation.y += delta * 0.1;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.06 - 0.12;
    }
  });

  return (
    <Float speed={reducedMotion ? 0 : 0.7} rotationIntensity={0.035} floatIntensity={0.18}>
      <group ref={group} rotation={[-0.08, -0.35, -0.12]} scale={1.08}>
        <mesh castShadow position={[-0.65, 0.25, 0.1]} rotation={[0.2, 0.45, -0.22]}>
          <boxGeometry args={[1.45, 2.7, 0.42]} />
          <meshStandardMaterial color="#ded8c9" roughness={0.76} metalness={0.02} />
        </mesh>

        <mesh castShadow position={[0.42, -0.18, 0.48]} rotation={[-0.15, -0.2, 0.48]}>
          <boxGeometry args={[0.42, 3.25, 0.2]} />
          <meshStandardMaterial color="#e44a31" roughness={0.42} metalness={0.05} />
        </mesh>

        <mesh castShadow position={[0.75, 0.62, 0.25]} rotation={[1.1, 0.25, 0.12]}>
          <torusGeometry args={[1.12, 0.08, 12, 96]} />
          <meshStandardMaterial color="#172a80" roughness={0.24} metalness={0.72} />
        </mesh>

        <mesh castShadow position={[0.28, -0.72, 0.76]} rotation={[0.35, 0.2, -0.15]}>
          <sphereGeometry args={[0.58, 32, 32]} />
          <meshStandardMaterial color="#20201d" roughness={0.16} metalness={0.82} />
        </mesh>

        <mesh castShadow position={[-0.58, -0.82, 0.8]} rotation={[0.2, -0.1, 0.62]}>
          <cylinderGeometry args={[0.22, 0.22, 2.05, 32]} />
          <meshStandardMaterial color="#f0ede3" roughness={0.48} metalness={0.08} />
        </mesh>

        <mesh castShadow position={[0.98, -0.76, 0.18]} rotation={[0.3, 0.2, -0.2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.28, 6]} />
          <meshStandardMaterial color="#d8aa18" roughness={0.55} metalness={0.08} />
        </mesh>

        <mesh castShadow position={[-1.12, 0.95, -0.12]} rotation={[1.2, 0.1, 0.42]}>
          <torusGeometry args={[0.5, 0.17, 18, 72]} />
          <meshStandardMaterial color="#d8aa18" roughness={0.46} metalness={0.12} />
        </mesh>
      </group>
    </Float>
  );
}

export function HologramScene({ reducedMotion, compact }: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.2, 6.8], fov: compact ? 42 : 34 }}
      dpr={compact ? [1, 1.2] : [1, 1.6]}
      gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <ambientLight intensity={1.5} />
      <directionalLight castShadow position={[4, 6, 5]} intensity={3.2} color="#fff7df" />
      <directionalLight position={[-5, 1, 2]} intensity={1.4} color="#8ca0ff" />
      <pointLight position={[1, -3, 3]} intensity={9} color="#e74a31" />
      <PresentationControls
        global
        enabled={!reducedMotion}
        cursor
        snap
        speed={1.15}
        rotation={[0, 0, 0]}
        polar={[-0.65, 0.55]}
        azimuth={[-0.9, 0.9]}
      >
        <StudioMobile reducedMotion={reducedMotion} />
      </PresentationControls>
      <ContactShadows
        position={[0, -2.25, -0.2]}
        opacity={0.3}
        scale={7}
        blur={2.3}
        far={4.5}
        color="#1e1d19"
      />
    </Canvas>
  );
}
