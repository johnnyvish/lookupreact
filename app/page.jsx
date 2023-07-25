"use client";

import React, { useRef, Suspense, useState, useEffect } from "react";
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

function Introduction({ onExplore }) {
  return (
    <div className="w-screen h-screen bg-black text-white flex justify-center items-center">
      <button
        onClick={onExplore}
        className="bg-white text-black px-8 py-4 border-none cursor-pointer focus:outline-none text-[3rem] font-semibold rounded-full transition duration-200 ease-in-out hover:bg-gray-200"
      >
        Explore
      </button>
    </div>
  );
}

function Loading({ onComplete }) {
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    let timer = setInterval(() => {
      setLoadProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1;
        } else {
          clearInterval(timer);
          onComplete();
          return prevProgress;
        }
      });
    }, 40); // Speed of loading bar

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [onComplete]);

  return (
    <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white flex flex-col items-center justify-center">
      <object
        id="svg-logo"
        className="h-[30vh] w-auto"
        data="/assets/yellowdot.svg"
        type="image/svg+xml"
      />
      <div>Loading...</div>
      <div className="w-48 h-4 border border-white bg-black mt-[-8vh]">
        {" "}
        {/* Change the value inside the brackets to adjust the overlap */}
        <div
          className={`bg-white h-full`}
          style={{ width: `${loadProgress}%` }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [stage, setStage] = useState("intro");
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    if (isLoadingComplete) {
      setStage("scene");
    }
  }, [isLoadingComplete]);

  if (stage === "intro") {
    return <Introduction onExplore={() => setStage("loading")} />;
  }

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
      {stage === "loading" && (
        <div className="absolute inset-0 bg-black flex justify-center items-center">
          <Loading onComplete={() => setLoadingComplete(true)} />
        </div>
      )}
    </div>
  );
}
