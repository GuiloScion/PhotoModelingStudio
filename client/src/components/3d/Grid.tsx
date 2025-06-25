import React from 'react';
import { Grid as DreiGrid } from '@react-three/drei';

export function Grid() {
  return (
    <DreiGrid
      position={[0, 0, 0]}
      args={[20, 20]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#333333"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#555555"
      fadeDistance={25}
      fadeStrength={1}
      followCamera={false}
      infiniteGrid={true}
    />
  );
}
