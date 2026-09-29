import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, PerspectiveCamera, Line } from '@react-three/drei';
import * as THREE from 'three';

import StudentCharacter from './StudentCharacter';

// Career Node component with glowing dot and connecting line
const CareerNode = ({ 
  startPos, 
  endPos, 
  color = "#4f46e5" 
}: { 
  startPos: [number, number, number], 
  endPos: [number, number, number], 
  color?: string 
}) => {
  const nodeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (nodeRef.current) {
      // Subtle floating animation for the node
      nodeRef.current.position.y = endPos[1] + Math.sin(state.clock.elapsedTime * 2 + endPos[0]) * 0.05;
    }
  });

  // Calculate curve points for the line
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...startPos),
    new THREE.Vector3(startPos[0], endPos[1] + 1, (startPos[2] + endPos[2]) / 2),
    new THREE.Vector3(...endPos)
  );
  
  const points = curve.getPoints(20);

  return (
    <group>
      {/* Path line connecting to the student */}
      <Line
        points={points}
        color={color}
        lineWidth={2}
        dashed={true}
        dashScale={5}
        dashSize={0.2}
        dashOffset={0}
        opacity={0.4}
        transparent
      />
      {/* Small glowing node */}
      <mesh ref={nodeRef} position={endPos}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} />
        {/* Glow effect */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </mesh>
      </mesh>
    </group>
  );
};

const StoryScene = () => {
  const mainCamera = useRef<any>(null);

  // We are positioning the student near the center of the right column canvas
  const studentPosition: [number, number, number] = [0, -1, 0];

  return (
    <>
      <PerspectiveCamera ref={mainCamera} makeDefault position={[0, 0, 5]} fov={35} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment preset="city" />

      {/* Main Character (Scaled down and centered in this right-side canvas) */}
      <group position={studentPosition} scale={0.8}>
        <StudentCharacter position={[0, 0, 0]} />
        
        <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={5} blur={1.5} far={2} />

        {/* 2-3 Subtle nodes connected to the student */}
        <group position={[0, 1.2, 0]}>
          <CareerNode startPos={[0, 0, 0]} endPos={[-1.2, 0.8, -0.5]} color="#3b82f6" />
          <CareerNode startPos={[0, 0, 0]} endPos={[1.2, 1.0, 0.2]} color="#10b981" />
          <CareerNode startPos={[0, 0, 0]} endPos={[0.5, -0.2, 1.0]} color="#f43f5e" />
        </group>
      </group>
    </>
  );
};

export default function CareerUniverse() {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <StoryScene />
      </Canvas>
    </div>
  );
}
