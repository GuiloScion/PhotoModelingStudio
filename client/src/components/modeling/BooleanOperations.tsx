import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { BooleanOperations as BoolOps } from '@/lib/geometry/operations';
import { SceneObject } from '@/types/modeling';
import { Vector3, Euler, Mesh } from 'three';

export function BooleanOperations() {
  const { objects, selectedObjectIds, addObject } = useSceneStore();
  
  const canPerformBoolean = selectedObjectIds.length === 2;
  
  const getSelectedMeshes = (): [Mesh, Mesh] | null => {
    if (!canPerformBoolean) return null;
    
    const meshes = selectedObjectIds.map(id => {
      const obj = objects.find(o => o.id === id);
      if (obj && obj.geometry && obj.material) {
        const mesh = new Mesh(obj.geometry, obj.material);
        mesh.position.copy(obj.position);
        mesh.rotation.copy(obj.rotation);
        mesh.scale.copy(obj.scale);
        return mesh;
      }
      return null;
    }).filter(Boolean) as Mesh[];
    
    return meshes.length === 2 ? [meshes[0], meshes[1]] : null;
  };
  
  const performUnion = () => {
    const meshes = getSelectedMeshes();
    if (!meshes) return;
    
    const [meshA, meshB] = meshes;
    const resultGeometry = BoolOps.union(meshA, meshB);
    
    const newObject: SceneObject = {
      id: `union_${Date.now()}`,
      name: 'Union Result',
      type: 'mesh',
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      geometry: resultGeometry,
      material: meshA.material,
      visible: true,
      locked: false
    };
    
    addObject(newObject);
  };
  
  const performDifference = () => {
    const meshes = getSelectedMeshes();
    if (!meshes) return;
    
    const [meshA, meshB] = meshes;
    const resultGeometry = BoolOps.difference(meshA, meshB);
    
    const newObject: SceneObject = {
      id: `difference_${Date.now()}`,
      name: 'Difference Result',
      type: 'mesh',
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      geometry: resultGeometry,
      material: meshA.material,
      visible: true,
      locked: false
    };
    
    addObject(newObject);
  };
  
  const performIntersection = () => {
    const meshes = getSelectedMeshes();
    if (!meshes) return;
    
    const [meshA, meshB] = meshes;
    const resultGeometry = BoolOps.intersection(meshA, meshB);
    
    const newObject: SceneObject = {
      id: `intersection_${Date.now()}`,
      name: 'Intersection Result',
      type: 'mesh',
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      geometry: resultGeometry,
      material: meshA.material,
      visible: true,
      locked: false
    };
    
    addObject(newObject);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Boolean Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {!canPerformBoolean && (
          <p className="text-xs text-muted-foreground mb-4">
            Select exactly 2 objects to perform boolean operations
          </p>
        )}
        
        <Button
          onClick={performUnion}
          disabled={!canPerformBoolean}
          size="sm"
          className="w-full justify-start"
        >
          <span className="mr-2">⊎</span>
          Union
        </Button>
        
        <Button
          onClick={performDifference}
          disabled={!canPerformBoolean}
          size="sm"
          className="w-full justify-start"
        >
          <span className="mr-2">⊖</span>
          Difference
        </Button>
        
        <Button
          onClick={performIntersection}
          disabled={!canPerformBoolean}
          size="sm"
          className="w-full justify-start"
        >
          <span className="mr-2">⊓</span>
          Intersection
        </Button>
        
        <div className="pt-2 border-t text-xs text-muted-foreground">
          <p>
            Boolean operations create new objects from the combination of selected meshes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
