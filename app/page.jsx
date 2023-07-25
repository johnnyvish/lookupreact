"use client";

import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Sphere, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { TextureLoader, BackSide } from "three";
import { Line } from "@react-three/drei";
import { CatmullRomCurve3, Vector3 } from "three";

function Earth() {
  const groupRef = useRef();
  const earthTexture = useLoader(TextureLoader, "/assets/earth3.jpeg");
  const cloudTexture = useLoader(TextureLoader, "/assets/earth3-clouds.jpeg");

  useFrame(() => {
    groupRef.current.rotation.y += 0.0005;
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[10, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial attach="material" map={earthTexture} />
      </Sphere>
      <Sphere args={[10.02, 32, 32]} position={[0, 0, 0]}>
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

function Comet() {
  const cometTexture = useLoader(TextureLoader, "/assets/comet.jpeg");

  return (
    <Sphere args={[1, 32, 32]} position={[0, 0, 50]}>
      <meshPhongMaterial attach="material" map={cometTexture} />
    </Sphere>
  );
}

function CometTrajectory() {
  // Describe a curve trajectory
  const points = [
    new Vector3(0, 0, 50), // these points should be modified to represent the trajectory you want
    new Vector3(20, 0, 30),
    new Vector3(20, 0, 20),
    new Vector3(0, 0, 0), // earth position
  ];
  const curve = new CatmullRomCurve3(points);

  return (
    <Line
      points={curve.getPoints(100)}
      color="white"
      lineWidth={5}
      transparent
      opacity={0.5}
    />
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

function ThreeScene() {
  return (
    <Canvas style={{ background: "black" }}>
      <PerspectiveCamera makeDefault position={[0, 0, 100]} />
      <directionalLight position={[300, 0, 500]} intensity={2} />
      <Suspense fallback={null}>
        <Stars />
        <Earth />
        <Comet />
        <CometTrajectory />
      </Suspense>
      <OrbitControls />
    </Canvas>
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
          setTimeout(onComplete, 0); // Use setTimeout to postpone state update
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

  return (
    <div className="w-full h-full overflow-hidden">
      <ThreeScene />

      {/* {stage === "intro" && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Introduction onExplore={() => setStage("loading")} />
        </div>
      )}

      {stage === "loading" && (
        <div className="absolute inset-0 bg-black flex justify-center items-center">
          <Loading onComplete={() => setLoadingComplete(true)} />
        </div>
      )} */}
    </div>
  );
}
