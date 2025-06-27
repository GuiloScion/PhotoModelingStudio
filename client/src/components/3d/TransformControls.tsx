import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TransformControls as DreiTransformControls } from '@react-three/drei';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { useToolStore } from '@/lib/stores/useToolStore';

export function TransformControls() {
  const transformRef = useRef<any>();
  const { selectedObjectIds } = useSceneStore();
  const { activeTool } = useToolStore();
  const { scene } = useThree();
  
  const selectedObject = selectedObjectIds.length === 1 
    ? scene.getObjectByProperty('userData.id', selectedObjectIds[0])
    : null;
  
  const getTransformMode = () => {
    switch (activeTool) {
      case 'move': return 'translate';
      case 'rotate': return 'rotate';
      case 'scale': return 'scale';
      default: return null;
    }
  };
  
  const mode = getTransformMode();
  
  if (!selectedObject || !mode) {
    return null;
  }
  
  return (
    <DreiTransformControls
      ref={transformRef}
      object={selectedObject}
      mode={mode}
      size={1}
      showX={true}
      showY={true}
      showZ={true}
      space="world"
      onObjectChange={(e) => {
        if (e?.target?.object) {
          const obj = e.target.object;
          const id = obj.userData.id;
          if (id) {
            useSceneStore.getState().updateObject(id, {
              position: obj.position.clone(),
              rotation: obj.rotation.clone(),
              scale: obj.scale.clone()
            });
          }
        }
      }}
    />
  );
}
