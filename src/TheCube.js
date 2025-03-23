import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// This is the inner cube component
const CubeObject = ({ image }) => {
  const meshRef = useRef();

  // Load the image as a texture
  const texture = useLoader(THREE.TextureLoader, image);

  // Configure texture to handle transparency properly
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Create a white background for the texture
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Fill with white background
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image on top
        context.drawImage(img, 0, 0);

        // Update the texture with the new canvas
        texture.image = canvas;
        texture.needsUpdate = true;
      };

      img.src = image;
    }
  }, [texture, image]);

  // Create materials for each face with the same logo texture
  const materials = Array(6)
    .fill()
    .map(
      () =>
        new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.5,
          metalness: 0.2,
          color: 0xffffff, // White base color
          side: THREE.FrontSide,
        })
    );

  // Set up the rotation to keep two opposite corners fixed
  useFrame(() => {
    if (meshRef.current) {
      // Create slow rotation around the axis that keeps opposite corners fixed
      meshRef.current.rotation.y += 0.002; // Slow rotation around y-axis
      meshRef.current.rotation.x = Math.PI / 4; // Fixed tilt to point one corner down
      meshRef.current.rotation.z = Math.PI / 4; // Additional rotation to align corners
    }
  });

  // Rotate the initial position of the cube so one corner points down
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.PI / 4;
      meshRef.current.rotation.z = Math.PI / 4;
    }
  }, []);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      {materials.map((material, index) => (
        <primitive key={index} object={material} attach={`material-${index}`} />
      ))}
    </mesh>
  );
};

// This is the main component that includes the Canvas
const TheCube = ({ image }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={["white"]} />{" "}
      {/* Slightly grey background */}
      <ambientLight intensity={0.9} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={0.8}
      />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <Suspense fallback={null}>
        <CubeObject image={image} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Suspense>
    </Canvas>
  );
};

export default TheCube;
