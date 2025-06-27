import React from 'react';

export function Lighting() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.2} color="#ffffff" />
      
      {/* Main directional light (sun) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#4f8ff7"
      />
      
      {/* Rim light */}
      <directionalLight
        position={[0, -5, 10]}
        intensity={0.2}
        color="#ff7f50"
      />
      
      {/* Hemisphere light for realistic ambient */}
      <hemisphereLight
        args={['#87ceeb', '#4f4f4f', 0.3]}
      />
    </>
  );
}
