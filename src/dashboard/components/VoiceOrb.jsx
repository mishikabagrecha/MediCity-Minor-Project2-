import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';

export const VoiceOrb = () => {
   const meshRef = useRef();

   useFrame((state) => {
      if (meshRef.current) {
         meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
         meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
         
         // Animate the scale slightly to simulate 'listening/breathing'
         const pulse = 1 + (Math.sin(state.clock.elapsedTime * 8) * 0.05);
         meshRef.current.scale.set(pulse, pulse, pulse);
      }
   });

   return (
      <mesh ref={meshRef} position={[0,0,0]} scale={[1.8, 1.8, 1.8]}>
         {/* A complex sphere geometry with low detail creates a cool techy orb */}
         <Icosahedron args={[1, 3]}>
            <meshPhysicalMaterial 
               color="#3b82f6" 
               emissive="#1e3a8a"
               emissiveIntensity={0.5}
               roughness={0.2}
               metalness={0.8}
               clearcoat={1}
               clearcoatRoughness={0.1}
               wireframe={true}
            />
         </Icosahedron>
         {/* Inner glowing core */}
         <Icosahedron args={[0.9, 10]}>
            <meshPhysicalMaterial 
               color="#60a5fa"
               emissive="#2563eb"
               emissiveIntensity={1}
               roughness={0.1}
               transmission={1}
               transparent={true}
               opacity={0.8}
            />
         </Icosahedron>
      </mesh>
   );
};
