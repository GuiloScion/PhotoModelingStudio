import { BufferGeometry, Mesh, Vector3 } from 'three';
import * as THREE from 'three';

export class BooleanOperations {
  static union(meshA: Mesh, meshB: Mesh): BufferGeometry {
    // Simplified union operation - in production, use a CSG library
    const geometry = new BufferGeometry();
    
    // For now, just merge the geometries
    const geometries = [meshA.geometry, meshB.geometry];
    const mergedGeometry = this.mergeGeometries(geometries);
    
    return mergedGeometry;
  }
  
  static difference(meshA: Mesh, meshB: Mesh): BufferGeometry {
    // Simplified difference operation
    // In production, use a proper CSG library like three-csg-ts
    return meshA.geometry.clone();
  }
  
  static intersection(meshA: Mesh, meshB: Mesh): BufferGeometry {
    // Simplified intersection operation
    return meshA.geometry.clone();
  }
  
  private static mergeGeometries(geometries: BufferGeometry[]): BufferGeometry {
    const merged = new BufferGeometry();
    
    let totalVertices = 0;
    let totalIndices = 0;
    
    // Calculate total vertices and indices
    geometries.forEach(geometry => {
      const positionAttribute = geometry.getAttribute('position');
      if (positionAttribute) {
        totalVertices += positionAttribute.count;
      }
      const indexAttribute = geometry.getIndex();
      if (indexAttribute) {
        totalIndices += indexAttribute.count;
      }
    });
    
    // Create merged arrays
    const positions = new Float32Array(totalVertices * 3);
    const indices = new Uint16Array(totalIndices);
    
    let vertexOffset = 0;
    let indexOffset = 0;
    let vertexCount = 0;
    
    geometries.forEach(geometry => {
      const positionAttribute = geometry.getAttribute('position');
      const indexAttribute = geometry.getIndex();
      
      if (positionAttribute) {
        positions.set(positionAttribute.array as Float32Array, vertexOffset);
        vertexOffset += positionAttribute.array.length;
        
        if (indexAttribute) {
          const geometryIndices = indexAttribute.array as Uint16Array;
          for (let i = 0; i < geometryIndices.length; i++) {
            indices[indexOffset + i] = geometryIndices[i] + vertexCount;
          }
          indexOffset += geometryIndices.length;
        }
        
        vertexCount += positionAttribute.count;
      }
    });
    
    merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    merged.setIndex(new THREE.BufferAttribute(indices, 1));
    merged.computeVertexNormals();
    
    return merged;
  }
}

export class MeasurementTools {
  static measureDistance(pointA: Vector3, pointB: Vector3): number {
    return pointA.distanceTo(pointB);
  }
  
  static measureAngle(pointA: Vector3, vertex: Vector3, pointC: Vector3): number {
    const vectorA = pointA.clone().sub(vertex).normalize();
    const vectorC = pointC.clone().sub(vertex).normalize();
    return vectorA.angleTo(vectorC);
  }
  
  static calculateVolume(geometry: BufferGeometry): number {
    // Simplified volume calculation using bounding box
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const size = bbox.getSize(new Vector3());
    return size.x * size.y * size.z;
  }
  
  static calculateSurfaceArea(geometry: BufferGeometry): number {
    // Simplified surface area calculation
    const positionAttribute = geometry.getAttribute('position');
    const indexAttribute = geometry.getIndex();
    
    if (!positionAttribute || !indexAttribute) {
      return 0;
    }
    
    let totalArea = 0;
    const vertices = positionAttribute.array as Float32Array;
    const indices = indexAttribute.array;
    
    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i] * 3;
      const b = indices[i + 1] * 3;
      const c = indices[i + 2] * 3;
      
      const vA = new Vector3(vertices[a], vertices[a + 1], vertices[a + 2]);
      const vB = new Vector3(vertices[b], vertices[b + 1], vertices[b + 2]);
      const vC = new Vector3(vertices[c], vertices[c + 1], vertices[c + 2]);
      
      const ab = vB.clone().sub(vA);
      const ac = vC.clone().sub(vA);
      const cross = ab.cross(ac);
      
      totalArea += cross.length() * 0.5;
    }
    
    return totalArea;
  }
}
