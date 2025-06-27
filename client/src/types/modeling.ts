import { Vector3, Euler, Material, Geometry, BufferGeometry } from 'three';

export interface SceneObject {
  id: string;
  name: string;
  type: 'primitive' | 'mesh' | 'group' | 'photo3d';
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  geometry?: BufferGeometry;
  material?: Material;
  children?: SceneObject[];
  visible: boolean;
  locked: boolean;
  userData?: Record<string, any>;
}

export interface ModelingTool {
  id: string;
  name: string;
  icon: string;
  category: 'create' | 'modify' | 'measure' | 'material' | 'photo';
  active: boolean;
  shortcut?: string;
}

export interface PrimitiveType {
  type: 'box' | 'sphere' | 'cylinder' | 'cone' | 'plane' | 'torus';
  parameters: Record<string, number>;
}

export interface PhotogrammetryResult {
  mesh: BufferGeometry;
  texture?: string;
  pointCloud?: Float32Array;
  confidence: number;
  processingTime: number;
}

export interface ExportFormat {
  format: 'stl' | 'obj' | 'gltf' | 'ply' | 'fbx';
  options: Record<string, any>;
}

export interface MaterialProperties {
  type: 'standard' | 'physical' | 'basic' | 'pbr';
  color: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  opacity?: number;
  transparent?: boolean;
  textureMap?: string;
  normalMap?: string;
  roughnessMap?: string;
  metalnessMap?: string;
}
