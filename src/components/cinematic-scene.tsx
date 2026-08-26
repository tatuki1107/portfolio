"use client";

import { Line, PresentationControls, useCursor } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import { type ReactNode, type RefObject, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type CinematicSceneProps = {
  progressRef: RefObject<number>;
  activeChapter: number;
  compact: boolean;
  active: boolean;
  paused: boolean;
  onSelectProject: (index: number) => void;
};

const BONE = "#e5e2d8";
const GRAPHITE = "#171819";
const STEEL = "#758089";
const ORANGE = "#ff4b18";
const BLUE = "#31539b";

function FacilityMaterial({ color, metal = false }: { color: string; metal?: boolean }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={metal ? 0.24 : 0.67}
      metalness={metal ? 0.78 : 0.04}
    />
  );
}

function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const position = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.2, 12),
      new THREE.Vector3(-1.1, 1.55, 2.4),
      new THREE.Vector3(1.2, 1.35, -7.6),
      new THREE.Vector3(-1.35, 1.75, -17.4),
      new THREE.Vector3(0, 3.6, -28),
    ]),
    [],
  );
  const target = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(-1.4, 0.55, -4.1),
      new THREE.Vector3(1.25, 0.4, -13.2),
      new THREE.Vector3(-0.2, 0.15, -22.4),
      new THREE.Vector3(0, 0, -30),
    ]),
    [],
  );
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const progress = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    position.getPoint(progress, desiredPosition.current);
    target.getPoint(progress, desiredTarget.current);
    desiredPosition.current.x += state.pointer.x * 0.3;
    desiredPosition.current.y += state.pointer.y * 0.16;
    const smooth = 1 - Math.exp(-delta * 4.5);
    state.camera.position.lerp(desiredPosition.current, smooth);
    lookTarget.current.lerp(desiredTarget.current, smooth);
    state.camera.lookAt(lookTarget.current);
  });

  return null;
}

function Corridor({ compact }: { compact: boolean }) {
  const floor = useRef<THREE.InstancedMesh>(null);
  const ribs = useRef<THREE.InstancedMesh>(null);
  const count = compact ? 12 : 20;

  useLayoutEffect(() => {
    if (!floor.current || !ribs.current) return;
    const dummy = new THREE.Object3D();
    for (let index = 0; index < count; index += 1) {
      const z = 7 - index * 2;
      dummy.position.set(0, -1.18, z);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      floor.current.setMatrixAt(index, dummy.matrix);

      dummy.position.set(index % 2 === 0 ? -4.55 : 4.55, 1.7, z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      ribs.current.setMatrixAt(index, dummy.matrix);
    }
    floor.current.instanceMatrix.needsUpdate = true;
    ribs.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <group>
      <instancedMesh ref={floor} args={[undefined, undefined, count]} receiveShadow>
        <boxGeometry args={[8.7, 0.1, 1.72]} />
        <meshStandardMaterial color="#6c7172" roughness={0.9} metalness={0.08} />
      </instancedMesh>
      <instancedMesh ref={ribs} args={[undefined, undefined, count]} castShadow>
        <boxGeometry args={[0.16, 5.8, 0.28]} />
        <meshStandardMaterial color="#a8aba7" roughness={0.62} metalness={0.22} />
      </instancedMesh>
      <mesh position={[0, 4.3, -11]} receiveShadow>
        <boxGeometry args={[9.2, 0.08, 39]} />
        <meshStandardMaterial color="#c6c7c2" roughness={0.86} />
      </mesh>
      {[-3, 0, 3].map((x) => (
        <mesh key={x} position={[x, 4.18, -11]}>
          <boxGeometry args={[0.07, 0.05, 38]} />
          <meshStandardMaterial color="#fff7de" emissive="#fff1c5" emissiveIntensity={2.2} />
        </mesh>
      ))}
      <mesh position={[0, -1.08, -11]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 40]} />
        <meshStandardMaterial color="#4d5253" roughness={0.92} />
      </mesh>
    </group>
  );
}

function InteractiveStation({
  children,
  projectIndex,
  onSelect,
}: {
  children: ReactNode;
  projectIndex: number;
  onSelect: (index: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  useCursor(hovered);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = hovered ? 1.035 : 1;
    const scale = THREE.MathUtils.lerp(group.current.scale.x, target, 1 - Math.exp(-delta * 9));
    group.current.scale.setScalar(scale);
  });

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(projectIndex);
  };

  return (
    <group
      ref={group}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={select}
    >
      {children}
    </group>
  );
}

function Waveform({ paused, compact }: { paused: boolean; compact: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = compact ? 11 : 19;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return;
    for (let index = 0; index < count; index += 1) {
      const phase = paused ? 0 : state.clock.elapsedTime * 2.3;
      const height = 0.13 + Math.abs(Math.sin(phase + index * 0.66)) * 0.62;
      dummy.position.set((index - (count - 1) / 2) * 0.13, height / 2, 0);
      dummy.scale.set(1, height, 1);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} position={[0, -0.25, 0.68]}>
      <boxGeometry args={[0.055, 1, 0.055]} />
      <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={1.5} />
    </instancedMesh>
  );
}

function YuiStation({ paused, compact, onSelect }: { paused: boolean; compact: boolean; onSelect: (index: number) => void }) {
  const rings = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!rings.current || paused) return;
    rings.current.rotation.y += delta * 0.35;
    rings.current.rotation.z -= delta * 0.12;
  });

  return (
    <InteractiveStation projectIndex={0} onSelect={onSelect}>
      <group position={[-1.4, -0.15, -4.1]}>
        <mesh castShadow position={[0, 0.12, 0]}>
          <cylinderGeometry args={[1.8, 2.1, 0.34, 16]} />
          <FacilityMaterial color="#242729" metal />
        </mesh>
        <group ref={rings} position={[0, 1.25, 0]}>
          {[0.88, 1.2, 1.52].map((radius, index) => (
            <mesh key={radius} rotation={[Math.PI / 2 + index * 0.47, index * 0.8, 0]} castShadow>
              <torusGeometry args={[radius, index === 1 ? 0.075 : 0.035, 10, compact ? 48 : 96]} />
              <FacilityMaterial color={index === 1 ? ORANGE : BONE} metal />
            </mesh>
          ))}
          <mesh castShadow>
            <sphereGeometry args={[0.48, compact ? 20 : 36, compact ? 20 : 36]} />
            <meshStandardMaterial color={GRAPHITE} roughness={0.18} metalness={0.88} />
          </mesh>
          <pointLight color={ORANGE} intensity={13} distance={5} />
        </group>
        <Waveform paused={paused} compact={compact} />
        <mesh position={[0, 2.95, -0.4]}>
          <boxGeometry args={[3.2, 0.08, 0.08]} />
          <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={2} />
        </mesh>
      </group>
    </InteractiveStation>
  );
}

function ARStation({ paused, onSelect }: { paused: boolean; onSelect: (index: number) => void }) {
  const scanner = useRef<THREE.Mesh>(null);
  const specimen = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (paused) return;
    if (scanner.current) scanner.current.position.y = 0.55 + (Math.sin(state.clock.elapsedTime * 1.25) + 1) * 0.75;
    if (specimen.current) specimen.current.rotation.y += delta * 0.45;
  });

  return (
    <InteractiveStation projectIndex={1} onSelect={onSelect}>
      <group position={[1.25, -0.1, -13.1]}>
        <mesh castShadow position={[-1.45, 1.5, 0]}><boxGeometry args={[0.32, 3, 0.55]} /><FacilityMaterial color={BONE} /></mesh>
        <mesh castShadow position={[1.45, 1.5, 0]}><boxGeometry args={[0.32, 3, 0.55]} /><FacilityMaterial color={BONE} /></mesh>
        <mesh castShadow position={[0, 3, 0]}><boxGeometry args={[3.2, 0.32, 0.55]} /><FacilityMaterial color={GRAPHITE} metal /></mesh>
        <mesh castShadow position={[0, 0.08, 0]}><boxGeometry args={[3.6, 0.16, 2.7]} /><FacilityMaterial color="#9da1a0" metal /></mesh>
        <mesh ref={scanner} position={[0, 0.55, 0.15]}>
          <boxGeometry args={[2.65, 0.025, 0.025]} />
          <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={4} />
        </mesh>
        <mesh ref={specimen} castShadow position={[0, 1.35, 0]} rotation={[0.3, 0, 0.15]}>
          <dodecahedronGeometry args={[0.72, 0]} />
          <meshStandardMaterial color={BLUE} roughness={0.26} metalness={0.66} />
        </mesh>
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.75, 1.75]} />
          <meshStandardMaterial color="#ece6d7" roughness={0.92} />
        </mesh>
        <pointLight position={[0, 1.5, 1.2]} color={ORANGE} intensity={9} distance={4} />
      </group>
    </InteractiveStation>
  );
}

function CityBlocks({ compact }: { compact: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = compact ? 16 : 28;
  const layout = useMemo(
    () => Array.from({ length: count }, (_, index) => ({
      x: (index % 7 - 3) * 0.62,
      z: (Math.floor(index / 7) - 1.5) * 0.72,
      height: 0.35 + ((index * 37) % 11) * 0.11,
    })),
    [count],
  );

  useLayoutEffect(() => {
    if (!mesh.current) return;
    const dummy = new THREE.Object3D();
    layout.forEach((item, index) => {
      dummy.position.set(item.x, item.height / 2, item.z);
      dummy.scale.set(0.46, item.height, 0.52);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [layout]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#202326" roughness={0.78} metalness={0.18} />
    </instancedMesh>
  );
}

function KobeStation({ compact, onSelect }: { compact: boolean; onSelect: (index: number) => void }) {
  const routePoints = useMemo(
    () => [
      [-2.2, 0.18, 0.8], [-1.45, 0.22, 0.15], [-0.6, 0.2, 0.48], [0.35, 0.22, -0.2], [1.2, 0.2, 0.22], [2.15, 0.2, -0.7],
    ] as [number, number, number][],
    [],
  );

  return (
    <InteractiveStation projectIndex={2} onSelect={onSelect}>
      <group position={[-0.15, -0.12, -22.4]}>
        <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[5.4, 0.18, 3.7]} />
          <FacilityMaterial color="#777b7b" metal />
        </mesh>
        <CityBlocks compact={compact} />
        <Line points={routePoints} color={ORANGE} lineWidth={compact ? 2 : 4} />
        {routePoints.filter((_, index) => index % 2 === 0).map((point, index) => (
          <mesh key={index} position={point}>
            <sphereGeometry args={[0.09, 14, 14]} />
            <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={4} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 1.85, -0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 5.8, 12]} />
          <FacilityMaterial color={STEEL} metal />
        </mesh>
        <pointLight position={[0, 1.6, 1.2]} color={ORANGE} intensity={15} distance={6} />
      </group>
    </InteractiveStation>
  );
}

function Scene({
  progressRef,
  activeChapter,
  compact,
  paused,
  onSelectProject,
}: Omit<CinematicSceneProps, "active">) {
  return (
    <>
      <CameraRig progressRef={progressRef} />
      <ambientLight intensity={0.7} />
      <hemisphereLight intensity={1.1} color="#f4f0df" groundColor="#24292d" />
      <directionalLight castShadow={!compact} position={[4, 8, 6]} intensity={2.7} color="#fff1d2" />
      <Corridor compact={compact} />
      <PresentationControls
        global
        enabled={!compact && activeChapter >= 0 && activeChapter < 3}
        cursor
        snap
        speed={0.35}
        rotation={[0, 0, 0]}
        polar={[-0.08, 0.08]}
        azimuth={[-0.1, 0.1]}
      >
        <group>
          <YuiStation paused={paused} compact={compact} onSelect={onSelectProject} />
          <ARStation paused={paused} onSelect={onSelectProject} />
          <KobeStation compact={compact} onSelect={onSelectProject} />
        </group>
      </PresentationControls>
      {!compact ? (
        <EffectComposer multisampling={0}>
          <SMAA />
          <Vignette offset={0.42} darkness={0.44} />
        </EffectComposer>
      ) : null}
    </>
  );
}

export function CinematicScene(props: CinematicSceneProps) {
  return (
    <Canvas
      shadows={!props.compact}
      camera={{ position: [0, 2.2, 12], fov: props.compact ? 48 : 42, near: 0.1, far: 70 }}
      dpr={props.compact ? [1, 1.15] : [1, 1.55]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      frameloop={props.active ? "always" : "demand"}
    >
      <color attach="background" args={["#292d2f"]} />
      <fog attach="fog" args={["#292d2f", 8, 27]} />
      <Scene {...props} />
    </Canvas>
  );
}
