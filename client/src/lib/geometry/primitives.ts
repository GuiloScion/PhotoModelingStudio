import { 
  BoxGeometry, 
  SphereGeometry, 
  CylinderGeometry, 
  ConeGeometry, 
  PlaneGeometry, 
  TorusGeometry,
  BufferGeometry
} from 'three';
import { PrimitiveType } from '@/types/modeling';

export function createPrimitiveGeometry(primitive: PrimitiveType): BufferGeometry {
  const { type, parameters } = primitive;
  
  switch (type) {
    case 'box':
      return new BoxGeometry(
        parameters.width || 1,
        parameters.height || 1,
        parameters.depth || 1,
        parameters.widthSegments || 1,
        parameters.heightSegments || 1,
        parameters.depthSegments || 1
      );
      
    case 'sphere':
      return new SphereGeometry(
        parameters.radius || 0.5,
        parameters.widthSegments || 32,
        parameters.heightSegments || 16,
        parameters.phiStart || 0,
        parameters.phiLength || Math.PI * 2,
        parameters.thetaStart || 0,
        parameters.thetaLength || Math.PI
      );
      
    case 'cylinder':
      return new CylinderGeometry(
        parameters.radiusTop || 0.5,
        parameters.radiusBottom || 0.5,
        parameters.height || 1,
        parameters.radialSegments || 32,
        parameters.heightSegments || 1,
        parameters.openEnded || false,
        parameters.thetaStart || 0,
        parameters.thetaLength || Math.PI * 2
      );
      
    case 'cone':
      return new ConeGeometry(
        parameters.radius || 0.5,
        parameters.height || 1,
        parameters.radialSegments || 32,
        parameters.heightSegments || 1,
        parameters.openEnded || false,
        parameters.thetaStart || 0,
        parameters.thetaLength || Math.PI * 2
      );
      
    case 'plane':
      return new PlaneGeometry(
        parameters.width || 1,
        parameters.height || 1,
        parameters.widthSegments || 1,
        parameters.heightSegments || 1
      );
      
    case 'torus':
      return new TorusGeometry(
        parameters.radius || 0.5,
        parameters.tube || 0.2,
        parameters.radialSegments || 16,
        parameters.tubularSegments || 100,
        parameters.arc || Math.PI * 2
      );
      
    default:
      return new BoxGeometry(1, 1, 1);
  }
}

export const primitiveDefaults: Record<string, Record<string, number>> = {
  box: {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1
  },
  sphere: {
    radius: 0.5,
    widthSegments: 32,
    heightSegments: 16,
    phiStart: 0,
    phiLength: Math.PI * 2,
    thetaStart: 0,
    thetaLength: Math.PI
  },
  cylinder: {
    radiusTop: 0.5,
    radiusBottom: 0.5,
    height: 1,
    radialSegments: 32,
    heightSegments: 1,
    openEnded: 0,
    thetaStart: 0,
    thetaLength: Math.PI * 2
  },
  cone: {
    radius: 0.5,
    height: 1,
    radialSegments: 32,
    heightSegments: 1,
    openEnded: 0,
    thetaStart: 0,
    thetaLength: Math.PI * 2
  },
  plane: {
    width: 1,
    height: 1,
    widthSegments: 1,
    heightSegments: 1
  },
  torus: {
    radius: 0.5,
    tube: 0.2,
    radialSegments: 16,
    tubularSegments: 100,
    arc: Math.PI * 2
  }
};
