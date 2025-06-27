import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

interface CameraProps {
  position?: [number, number, number];
  target?: [number, number, number];
}

export function Camera({ position = [5, 5, 5], target = [0, 0, 0] }: CameraProps) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Update camera controls if needed
  });

  return (
    <PerspectiveCamera
      makeDefault
      position={position}
      fov={45}
      near={0.1}
      far={1000}
    />
  );
}
