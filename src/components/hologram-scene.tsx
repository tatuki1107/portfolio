"use client";

import { ContactShadows, Float, PresentationControls, useCursor } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type SceneProps = {
  reducedMotion: boolean;
  compact: boolean;
  onHoverProject?: (index: number | null) => void;
  onSelectProject?: (index: number) => void;
};

const palette = ["#e24b32", "#234293", "#d5a91b", "#22211e", "#6f8e7b", "#d96c8a", "#e9e3d5"];

function Material({ color, metal = false }: { color: string; metal?: boolean }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={metal ? 0.2 : 0.58}
      metalness={metal ? 0.82 : 0.04}
    />
  );
}

function MonumentShape({ index, color }: { index: number; color: string }) {
  if (index === 0) {
    return (
      <>
        <mesh castShadow position={[0, 0.52, 0]}><sphereGeometry args={[0.38, 28, 28]} /><Material color="#20201d" metal /></mesh>
        <mesh castShadow position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.62, 0.07, 14, 64]} /><Material color={color} metal /></mesh>
        <mesh castShadow position={[0, 0.04, 0]}><cylinderGeometry args={[0.5, 0.62, 0.18, 10]} /><Material color="#e6dfd0" /></mesh>
      </>
    );
  }
  if (index === 1) {
    return (
      <>
        <mesh castShadow position={[-0.32, 0.45, 0]}><boxGeometry args={[0.22, 0.9, 0.32]} /><Material color={color} /></mesh>
        <mesh castShadow position={[0.32, 0.45, 0]}><boxGeometry args={[0.22, 0.9, 0.32]} /><Material color={color} /></mesh>
        <mesh castShadow position={[0, 0.92, 0]}><boxGeometry args={[0.86, 0.18, 0.32]} /><Material color="#e6dfd0" /></mesh>
        <mesh castShadow position={[0, 0.5, -0.02]}><sphereGeometry args={[0.2, 20, 20]} /><Material color="#d5a91b" metal /></mesh>
      </>
    );
  }
  if (index === 2) {
    return (
      <>
        <mesh castShadow position={[0, 0.56, 0]} rotation={[0.8, 0.2, 0.25]}><torusKnotGeometry args={[0.34, 0.1, 72, 10, 2, 3]} /><Material color={color} metal /></mesh>
        <mesh castShadow position={[0, 0.06, 0]}><cylinderGeometry args={[0.54, 0.62, 0.16, 6]} /><Material color="#20201d" /></mesh>
      </>
    );
  }
  if (index === 3) {
    return (
      <>
        {[
          [-0.32, 0.28, 0.08, 0.34, 0.56],
          [0.05, 0.48, -0.08, 0.32, 0.96],
          [0.38, 0.34, 0.1, 0.28, 0.68],
        ].map(([x, y, z, w, h], i) => (
          <mesh key={i} castShadow position={[x, y, z]}><boxGeometry args={[w, h, 0.38]} /><Material color={i === 1 ? color : "#e6dfd0"} /></mesh>
        ))}
        <mesh castShadow position={[0.04, 1.05, -0.02]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.2, 0.04, 10, 36]} /><Material color="#d5a91b" metal /></mesh>
      </>
    );
  }
  if (index === 4) {
    return (
      <>
        <mesh castShadow position={[0, 0.55, 0]} rotation={[0, 0, -0.2]}><capsuleGeometry args={[0.28, 0.65, 10, 20]} /><Material color={color} /></mesh>
        <mesh castShadow position={[0.3, 0.66, 0.18]}><sphereGeometry args={[0.22, 20, 20]} /><Material color="#e24b32" metal /></mesh>
        <mesh castShadow position={[-0.26, 0.08, 0]}><boxGeometry args={[0.55, 0.16, 0.52]} /><Material color="#d5a91b" /></mesh>
      </>
    );
  }
  if (index === 5) {
    return (
      <>
        <mesh castShadow position={[0, 0.26, 0]} rotation={[0, 0.25, -0.18]}><boxGeometry args={[1, 0.18, 0.52]} /><Material color={color} /></mesh>
        <mesh castShadow position={[-0.23, 0.63, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.29, 0.08, 12, 48]} /><Material color="#20201d" metal /></mesh>
        <mesh castShadow position={[0.36, 0.62, 0]}><octahedronGeometry args={[0.29, 0]} /><Material color="#e24b32" /></mesh>
      </>
    );
  }
  return (
    <>
      <mesh castShadow position={[0, 0.5, 0]} rotation={[0.3, 0.2, 0]}><icosahedronGeometry args={[0.48, 0]} /><Material color={color} /></mesh>
      <mesh castShadow position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.68, 0.035, 8, 48]} /><Material color="#234293" metal /></mesh>
      <mesh castShadow position={[0, 0.05, 0]}><cylinderGeometry args={[0.42, 0.52, 0.14, 8]} /><Material color="#e6dfd0" /></mesh>
    </>
  );
}

function ProjectMonument({
  index,
  position,
  rotation,
  onHover,
  onSelect,
}: {
  index: number;
  position: [number, number, number];
  rotation: number;
  onHover?: (index: number | null) => void;
  onSelect?: (index: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = hovered ? 1.18 : 1;
    const nextScale = THREE.MathUtils.lerp(group.current.scale.x, target, 1 - Math.exp(-delta * 9));
    group.current.scale.setScalar(nextScale);
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.025;
  });

  const activate = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect?.(index);
  };

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, rotation, 0]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        onHover?.(index);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover?.(null);
      }}
      onClick={activate}
    >
      <MonumentShape index={index} color={palette[index]} />
      <mesh receiveShadow position={[0, -0.035, 0]}>
        <cylinderGeometry args={[0.72, 0.76, 0.08, 24]} />
        <Material color={hovered ? "#e24b32" : "#b8b6ad"} />
      </mesh>
    </group>
  );
}

function ArchiveIsland({
  reducedMotion,
  onHover,
  onSelect,
}: {
  reducedMotion: boolean;
  onHover?: (index: number | null) => void;
  onSelect?: (index: number) => void;
}) {
  const island = useRef<THREE.Group>(null);
  const monuments = useMemo(
    () => Array.from({ length: 7 }, (_, index) => {
      const angle = index / 7 * Math.PI * 2 + 0.25;
      return {
        index,
        position: [Math.cos(angle) * 2.12, 0.16, Math.sin(angle) * 2.12] as [number, number, number],
        rotation: -angle + Math.PI / 2,
      };
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!island.current || reducedMotion) return;
    island.current.rotation.y += delta * 0.055;
  });

  return (
    <Float speed={reducedMotion ? 0 : 0.45} rotationIntensity={0.02} floatIntensity={0.08}>
      <group ref={island} rotation={[0.03, -0.35, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
          <cylinderGeometry args={[3.18, 3.42, 0.38, 14]} />
          <meshStandardMaterial color="#cbc7ba" roughness={0.82} metalness={0.02} />
        </mesh>
        <mesh receiveShadow position={[0, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.02, 64]} />
          <meshStandardMaterial color="#e7e2d5" roughness={0.94} />
        </mesh>
        {[1.12, 2.12, 2.72].map((radius) => (
          <mesh key={radius} position={[0, -0.025, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.012, 6, 100]} />
            <meshBasicMaterial color="#817d72" transparent opacity={0.55} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.48, 0.7, 0.9, 8]} />
          <Material color="#20201d" />
        </mesh>
        <mesh castShadow position={[0, 1.06, 0]} rotation={[0.2, 0.1, 0]}>
          <octahedronGeometry args={[0.48, 0]} />
          <Material color="#e24b32" metal />
        </mesh>
        {monuments.map((monument) => (
          <ProjectMonument
            key={monument.index}
            {...monument}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </group>
    </Float>
  );
}

export function HologramScene({
  reducedMotion,
  compact,
  onHoverProject,
  onSelectProject,
}: SceneProps) {
  return (
    <Canvas
      shadows={!compact}
      camera={{ position: compact ? [5.8, 5.3, 7.8] : [5.5, 4.5, 7.2], fov: compact ? 43 : 37 }}
      dpr={compact ? [1, 1.15] : [1, 1.55]}
      gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
      onPointerMissed={() => onHoverProject?.(null)}
    >
      <color attach="background" args={["#d7d8d2"]} />
      <fog attach="fog" args={["#d7d8d2", 10, 18]} />
      <ambientLight intensity={1.25} />
      <hemisphereLight intensity={1.35} color="#fff9e9" groundColor="#53607e" />
      <directionalLight castShadow={!compact} position={[5, 8, 5]} intensity={3.4} color="#fff3d8" />
      <directionalLight position={[-5, 2, -3]} intensity={1.8} color="#7890db" />
      <PresentationControls
        global
        enabled={!reducedMotion}
        cursor
        snap
        speed={1.05}
        rotation={[-0.08, 0, 0]}
        polar={[-0.65, 0.32]}
        azimuth={[-0.9, 0.9]}
      >
        <group position={compact ? [0, -0.8, 0] : [0.75, -0.45, 0]} scale={compact ? 0.9 : 1}>
          <ArchiveIsland reducedMotion={reducedMotion} onHover={onHoverProject} onSelect={onSelectProject} />
        </group>
      </PresentationControls>
      {!compact && <ContactShadows position={[0.75, -1.06, 0]} opacity={0.3} scale={9} blur={2.4} far={5} color="#1e1d19" />}
    </Canvas>
  );
}
