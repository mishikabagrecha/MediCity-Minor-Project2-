import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const HeartModel = () => {
  const meshRef = useRef();

  // Create a mathematical heart shape
  const x = 0;
  const y = 0;
  const heartShape = new THREE.Shape();
  heartShape.moveTo( x + 2.5, y + 2.5 );
  heartShape.bezierCurveTo( x + 2.5, y + 2.5, x + 2.0, y, x, y );
  heartShape.bezierCurveTo( x - 3.0, y, x - 3.0, y + 3.5, x - 3.0, y + 3.5 );
  heartShape.bezierCurveTo( x - 3.0, y + 5.5, x - 1.0, y + 7.7, x + 2.5, y + 9.5 );
  heartShape.bezierCurveTo( x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5 );
  heartShape.bezierCurveTo( x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y );
  heartShape.bezierCurveTo( x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5 );

  // Smooth out the geometry extrusion
  const extrudeSettings = { 
     depth: 1.5, 
     bevelEnabled: true, 
     bevelSegments: 8, 
     steps: 2, 
     bevelSize: 1, 
     bevelThickness: 1 
  };

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      meshRef.current.position.y = (Math.sin(state.clock.elapsedTime * 2) * 0.2) + 2; 
      
      // Heartbeat pulse scaling
      const pulse = 1 + (Math.sin(state.clock.elapsedTime * 5) * 0.03);
      meshRef.current.scale.set(pulse * 0.25, pulse * 0.25, pulse * 0.25);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 2, 0]} rotation={[Math.PI, 0, 0]}>
      {/* Extrude the 2D heart shape into a 3D geometry */}
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      {/* Provide an organic red organic material with a bit of shine */}
      <meshPhysicalMaterial 
        color="#be123c" 
        emissive="#4c0519"
        roughness={0.3}
        metalness={0.1}
        clearcoat={0.8}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
};
