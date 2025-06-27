import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Lighting } from './Lighting';
import { Grid } from './Grid';
import { SceneObjects } from './SceneObjects';

interface SceneProps {
  className?: string;
}

export function Scene({ className }: SceneProps) {
  return (
    <div className={`modeling-viewport ${className || ''}`}>
      <Canvas
        shadows
        camera={{
          position: [5, 5, 5],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a1a1a');
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = 2; // PCFSoftShadowMap
        }}
      >
        <color attach="background" args={['#1a1a1a']} />
        
        <Suspense fallback={null}>
          <Lighting />
          <Grid />
          <SceneObjects wireframe={false} />
        </Suspense>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
          minDistance={1}
          maxDistance={100}
        />
      </Canvas>
    </div>
  );
}