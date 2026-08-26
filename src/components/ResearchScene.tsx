"use client";

import { Float, Line, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Core() {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  useFrame(({ clock, pointer }) => {
    const time = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = time * 0.12 + pointer.x * 0.22;
      group.current.rotation.x = pointer.y * -0.12;
    }
    if (ringA.current) ringA.current.rotation.z = time * 0.28;
    if (ringB.current) ringB.current.rotation.z = -time * 0.22;
  });
  const orbit = useMemo(() => Array.from({ length: 5 }, (_, index) => {
    const radius = 2.6 + index * 0.25;
    return Array.from({ length: 64 }, (__, point) => {
      const angle = (point / 63) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * (0.28 + index * 0.03), Math.sin(angle * 2 + index) * 0.12);
    });
  }), []);
  return (
    <group ref={group} position={[1.25, 0.05, 0]}>
      <Float speed={1.3} rotationIntensity={0.35} floatIntensity={0.35}>
        <mesh><icosahedronGeometry args={[1.18, 2]} /><meshStandardMaterial color="#031819" emissive="#00e6df" emissiveIntensity={0.24} metalness={0.82} roughness={0.18} wireframe /></mesh>
        <mesh scale={0.72}><icosahedronGeometry args={[1.18, 1]} /><meshStandardMaterial color="#b8ff31" emissive="#7eff00" emissiveIntensity={1.8} transparent opacity={0.18} /></mesh>
      </Float>
      <mesh ref={ringA} rotation={[1.15, 0.1, 0.25]}><torusGeometry args={[1.82, 0.018, 8, 128]} /><meshBasicMaterial color="#00f0ff" transparent opacity={0.75} /></mesh>
      <mesh ref={ringB} rotation={[0.3, 1.1, 0.4]}><torusGeometry args={[2.2, 0.012, 8, 128]} /><meshBasicMaterial color="#b7ff29" transparent opacity={0.42} /></mesh>
      {orbit.map((points, index) => <Line key={index} points={points} color={index % 2 ? "#b8ff31" : "#00d9e8"} lineWidth={0.45} transparent opacity={0.2 - index * 0.018} />)}
      {Array.from({ length: 9 }, (_, index) => {
        const angle = (index / 9) * Math.PI * 2;
        const radius = 1.72 + (index % 3) * 0.28;
        return <mesh key={index} position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.38, Math.sin(angle * 2) * 0.45]}><sphereGeometry args={[index % 3 === 0 ? 0.055 : 0.028, 10, 10]} /><meshBasicMaterial color={index % 2 ? "#b8ff31" : "#00e9ff"} /></mesh>;
      })}
    </group>
  );
}

export default function ResearchScene() {
  return <Canvas camera={{ position: [0, 0, 7], fov: 46 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}><ambientLight intensity={0.35} /><pointLight color="#00dfea" intensity={24} position={[3, 3, 3]} distance={10} /><pointLight color="#aaff22" intensity={10} position={[-3, -2, 2]} distance={9} /><Core /><Stars radius={55} depth={25} count={900} factor={1.4} saturation={0.8} fade speed={0.2} /><fog attach="fog" args={["#020505", 7, 16]} /></Canvas>;
}
