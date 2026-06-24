"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 200;

function Particles() {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.2 + Math.random() * 0.6;
    }
    return { positions, speeds };
  }, []);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.getElapsedTime();
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += Math.sin(t * speeds[i] + i) * 0.0015;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.rotation.y = t * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C9A84C"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      aria-hidden
    >
      <Particles />
    </Canvas>
  );
}
