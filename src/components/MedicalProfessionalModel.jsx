import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

export const MedicalProfessionalModel = () => {
  const { scene } = useGLTF('/models/medical-professional.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.transparent = child.material.transparent || false;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      position={[0, -1.25, 0]}
      rotation={[0, Math.PI * 0.05, 0]}
      scale={1.1}
    />
  );
};

useGLTF.preload('/models/medical-professional.glb');
