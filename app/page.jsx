"use client";

import React, { useRef, Suspense, useEffect, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Sphere, PerspectiveCamera, Text } from "@react-three/drei";
import { TextureLoader, BackSide } from "three";
import { gsap } from "gsap";

function Earth() {
  const groupRef = useRef();
  const earthTexture = useLoader(TextureLoader, "/assets/earth3.jpeg");
  const cloudTexture = useLoader(TextureLoader, "/assets/earth3-clouds.jpeg");

  useFrame(() => {
    groupRef.current.rotation.y += 0.0005;
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[50, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial attach="material" map={earthTexture} />
      </Sphere>
      <Sphere args={[50.5, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial
          attach="material"
          map={cloudTexture}
          alphaMap={cloudTexture}
          transparent
          opacity={0.9}
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

function Comet({ camera, isInteractive }) {
  const cometTexture = useLoader(TextureLoader, "/assets/comet.jpeg");
  const zPosition = useRef(500);
  const meshRef = useRef();

  useEffect(() => {
    const handleScroll = (e) => {
      if (!isInteractive) return;

      e.preventDefault();
      zPosition.current = Math.max(zPosition.current - e.deltaY * 0.01, 0);
      const cameraDistance = 10;

      camera.current.position.set(0, 2, zPosition.current + cameraDistance);
      camera.current.lookAt(0, 0, 0);
    };

    document.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleScroll);
    };
  }, [isInteractive]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z = zPosition.current;
    }
  });

  return (
    <>
      <Sphere
        ref={meshRef}
        args={[1, 32, 32]}
        position={[0, 0, zPosition.current]}
      >
        <meshPhongMaterial attach="material" map={cometTexture} />
      </Sphere>
      <Text
        position={[0, 0, 400]}
        fontSize={5}
        rotation={[0, 0, 0]}
        color="white"
      >
        {"1950"}
      </Text>
      <Text
        position={[0, 0, 300]}
        fontSize={5}
        rotation={[0, 0, 0]}
        color="white"
      >
        {"2000"}
      </Text>
      <Text
        position={[0, 0, 200]}
        fontSize={5}
        rotation={[0, 0, 0]}
        color="white"
      >
        {"2050"}
      </Text>
    </>
  );
}

function ThreeScene({ isInteractive, cameraRef }) {
  return (
    <Canvas style={{ background: "black" }}>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 150]} />
      <directionalLight position={[300, 0, 500]} intensity={2} />
      <Suspense fallback={null}>
        <Stars />
        <Earth />
        <Comet camera={cameraRef} isInteractive={isInteractive} />
      </Suspense>
    </Canvas>
  );
}

function TitleComponent({ isExploreClicked }) {
  useEffect(() => {
    if (isExploreClicked) {
      gsap.to(".title", {
        y: "-140%",
        duration: 1,
        scale: 0.6,
        ease: "power2.out",
      });
    }
  }, [isExploreClicked]);

  return (
    <h1 className="title absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[8rem] text-shadow-md font-newake">
      LOOK UP
    </h1>
  );
}

function ExploreButton({ onClick }) {
  const handleClick = () => {
    gsap.to(".exploreButton", {
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
    });
    onClick();
  };

  return (
    <button
      className="exploreButton absolute top-[53%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-red-500 px-8 py-3 rounded-full shadow-md font-semibold text-[2.5rem] transition duration-200 ease-in-out hover:shadow-xl hover:scale-105"
      onClick={handleClick}
    >
      Explore
    </button>
  );
}

function Logo({ isExploreClicked }) {
  useEffect(() => {
    if (isExploreClicked) {
      gsap.to(".logo", {
        autoAlpha: 1,
        duration: 2,
        ease: "power2.in",
      });
    }
  }, [isExploreClicked]);

  return (
    <img
      className="logo absolute top-[2%] left-[2%] transform h-[5rem] invisible"
      src="/assets/yellowdot.png"
      alt="Logo"
    />
  );
}

function HamburgerMenu({ isExploreClicked }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isExploreClicked) {
      gsap.to(".hamburger", {
        autoAlpha: 1,
        duration: 2,
        ease: "power2.in",
      });
    }
  }, [isExploreClicked]);

  return (
    <div
      className="hamburger absolute top-[4%] right-[2%] cursor-pointer text-white text-3xl invisible"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? (
        <span className="block mt-[-0.5rem]">X</span>
      ) : (
        <div className="flex flex-col justify-between w-6 h-5">
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
          <div className="w-full h-px bg-white"></div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [isExploreClicked, setIsExploreClicked] = useState(false);
  const cameraRef = useRef();

  const handleExploreClick = () => {
    setIsExploreClicked(true);
    document.documentElement.style.overflow = "auto";

    gsap.to(cameraRef.current.position, {
      z: 510,
      y: 2,
      duration: 2,
      ease: "power2.inOut",
    });
  };

  useEffect(() => {
    if (!isExploreClicked) {
      document.documentElement.style.overflow = "hidden";
    }
  }, [isExploreClicked]);

  return (
    <div className="w-full h-full overflow-hidden relative">
      <ThreeScene isInteractive={isExploreClicked} cameraRef={cameraRef} />
      <TitleComponent isExploreClicked={isExploreClicked} />
      <Logo isExploreClicked={isExploreClicked} />
      <HamburgerMenu isExploreClicked={isExploreClicked} />
      {!isExploreClicked && <ExploreButton onClick={handleExploreClick} />}
    </div>
  );
}
