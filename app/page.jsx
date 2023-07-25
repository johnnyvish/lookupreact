"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Sphere, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { TextureLoader, BackSide } from "three";

function Earth() {
  const groupRef = useRef();
  const earthTexture = useLoader(TextureLoader, "/assets/earth3.jpeg");
  const cloudTexture = useLoader(TextureLoader, "/assets/earth3-clouds.jpeg");

  useFrame(() => {
    groupRef.current.rotation.y += 0.0005;
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[3, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial attach="material" map={earthTexture} />
      </Sphere>
      <Sphere args={[3.02, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial
          attach="material"
          map={cloudTexture}
          alphaMap={cloudTexture}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </group>
  );
}

function Stars() {
  const texture = useLoader(TextureLoader, "/assets/starfield.jpeg");

  return (
    <Sphere args={[1000, 32, 32]} position={[0, 0, 0]}>
      <meshBasicMaterial attach="material" map={texture} side={BackSide} />
    </Sphere>
  );
}

export default function Home() {
  return (
    <div className="w-full h-full overflow-hidden">
      <Canvas style={{ background: "black" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} />
        <directionalLight position={[300, 0, 500]} intensity={2} />
        <Suspense fallback={null}>
          <Stars />
          <Earth />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
