import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface StudentCharacterProps {
  modelPath?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

// Fallback high-quality placeholder if no GLTF model is provided
const FallbackStudent = () => {
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  // Subtle idle animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t / 2) * 0.1;
      headRef.current.rotation.x = Math.sin(t / 3) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <group position={[0, 1, 0]}>
        {/* Body */}
        <mesh ref={bodyRef} position={[0, 0, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.4, 0.8, 4, 16]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.1} />
        </mesh>
        
        {/* Head */}
        <mesh ref={headRef} position={[0, 1.2, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
        </mesh>
        
        {/* Backpack/Detail to make it student-like */}
        <mesh position={[0, 0.2, -0.45]} castShadow>
          <boxGeometry args={[0.6, 0.7, 0.2]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
        </mesh>
        
        {/* Glowing "Aura" */}
        <mesh position={[0, 0.5, 0]} scale={1.2}>
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial color="#60a5fa" transparent opacity={0.1} distort={0.4} speed={2} />
        </mesh>
      </group>
    </Float>
  );
};

// Model Loader Component (Error boundary handles missing files at suspense level)
const GLTFStudent = ({ modelPath }: { modelPath: string }) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
};

export default function StudentCharacter({ modelPath, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: StudentCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Smooth, very subtle continuous rotation to give it life if needed
    // The main movement will be handled by GSAP ScrollTrigger acting on this group
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {modelPath ? (
        <React.Suspense fallback={<FallbackStudent />}>
          <GLTFStudent modelPath={modelPath} />
        </React.Suspense>
      ) : (
        <FallbackStudent />
      )}
    </group>
  );
}
