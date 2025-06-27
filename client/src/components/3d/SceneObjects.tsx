import React from 'react';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { SceneObject } from '@/types/modeling';

interface SceneObjectsProps {
  wireframe: boolean;
}

export function SceneObjects({ wireframe }: SceneObjectsProps) {
  const { objects } = useSceneStore();
  
  return (
    <>
      {objects.map((object) => (
        <SceneObjectComponent
          key={object.id}
          object={object}
          wireframe={wireframe}
        />
      ))}
    </>
  );
}

interface SceneObjectComponentProps {
  object: SceneObject;
  wireframe: boolean;
}

function SceneObjectComponent({ object, wireframe }: SceneObjectComponentProps) {
  return (
    <mesh
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
      visible={object.visible}
      geometry={object.geometry}
      material={object.material}
      userData={{ id: object.id }}
      castShadow
      receiveShadow
    >
      {wireframe && (
        <meshBasicMaterial wireframe color="#00ff00" />
      )}
    </mesh>
  );
}