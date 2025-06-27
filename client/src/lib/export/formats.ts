import { Mesh, Scene, BufferGeometry } from 'three';
import { ExportFormat } from '@/types/modeling';

export class ModelExporter {
  static async exportSTL(geometry: BufferGeometry, options: Record<string, any> = {}): Promise<string> {
    const positionAttribute = geometry.getAttribute('position');
    const indexAttribute = geometry.getIndex();
    
    if (!positionAttribute) {
      throw new Error('Geometry has no position attribute');
    }
    
    let stlString = 'solid exported\n';
    
    if (indexAttribute) {
      // Indexed geometry
      const positions = positionAttribute.array as Float32Array;
      const indices = indexAttribute.array;
      
      for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i] * 3;
        const b = indices[i + 1] * 3;
        const c = indices[i + 2] * 3;
        
        // Calculate normal (simplified)
        const normal = this.calculateTriangleNormal(
          positions[a], positions[a + 1], positions[a + 2],
          positions[b], positions[b + 1], positions[b + 2],
          positions[c], positions[c + 1], positions[c + 2]
        );
        
        stlString += `  facet normal ${normal.x} ${normal.y} ${normal.z}\n`;
        stlString += '    outer loop\n';
        stlString += `      vertex ${positions[a]} ${positions[a + 1]} ${positions[a + 2]}\n`;
        stlString += `      vertex ${positions[b]} ${positions[b + 1]} ${positions[b + 2]}\n`;
        stlString += `      vertex ${positions[c]} ${positions[c + 1]} ${positions[c + 2]}\n`;
        stlString += '    endloop\n';
        stlString += '  endfacet\n';
      }
    }
    
    stlString += 'endsolid exported\n';
    return stlString;
  }
  
  static async exportOBJ(geometry: BufferGeometry, options: Record<string, any> = {}): Promise<string> {
    const positionAttribute = geometry.getAttribute('position');
    const indexAttribute = geometry.getIndex();
    
    if (!positionAttribute) {
      throw new Error('Geometry has no position attribute');
    }
    
    let objString = '# Exported from 3D Modeling Studio\n';
    
    // Export vertices
    const positions = positionAttribute.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      objString += `v ${positions[i]} ${positions[i + 1]} ${positions[i + 2]}\n`;
    }
    
    // Export faces
    if (indexAttribute) {
      const indices = indexAttribute.array;
      for (let i = 0; i < indices.length; i += 3) {
        // OBJ indices are 1-based
        objString += `f ${indices[i] + 1} ${indices[i + 1] + 1} ${indices[i + 2] + 1}\n`;
      }
    }
    
    return objString;
  }
  
  static async exportPLY(geometry: BufferGeometry, options: Record<string, any> = {}): Promise<string> {
    const positionAttribute = geometry.getAttribute('position');
    const indexAttribute = geometry.getIndex();
    
    if (!positionAttribute) {
      throw new Error('Geometry has no position attribute');
    }
    
    const positions = positionAttribute.array as Float32Array;
    const vertexCount = positions.length / 3;
    const faceCount = indexAttribute ? indexAttribute.array.length / 3 : 0;
    
    let plyString = 'ply\n';
    plyString += 'format ascii 1.0\n';
    plyString += `element vertex ${vertexCount}\n`;
    plyString += 'property float x\n';
    plyString += 'property float y\n';
    plyString += 'property float z\n';
    
    if (faceCount > 0) {
      plyString += `element face ${faceCount}\n`;
      plyString += 'property list uchar int vertex_indices\n';
    }
    
    plyString += 'end_header\n';
    
    // Export vertices
    for (let i = 0; i < positions.length; i += 3) {
      plyString += `${positions[i]} ${positions[i + 1]} ${positions[i + 2]}\n`;
    }
    
    // Export faces
    if (indexAttribute) {
      const indices = indexAttribute.array;
      for (let i = 0; i < indices.length; i += 3) {
        plyString += `3 ${indices[i]} ${indices[i + 1]} ${indices[i + 2]}\n`;
      }
    }
    
    return plyString;
  }
  
  static async exportGLTF(scene: Scene, options: Record<string, any> = {}): Promise<string> {
    // Simplified GLTF export - in production, use a proper GLTF exporter
    const gltf = {
      asset: {
        version: '2.0',
        generator: '3D Modeling Studio'
      },
      scene: 0,
      scenes: [
        {
          nodes: [0]
        }
      ],
      nodes: [
        {
          mesh: 0
        }
      ],
      meshes: [],
      buffers: [],
      bufferViews: [],
      accessors: []
    };
    
    return JSON.stringify(gltf, null, 2);
  }
  
  private static calculateTriangleNormal(
    x1: number, y1: number, z1: number,
    x2: number, y2: number, z2: number,
    x3: number, y3: number, z3: number
  ): { x: number; y: number; z: number } {
    const ux = x2 - x1;
    const uy = y2 - y1;
    const uz = z2 - z1;
    
    const vx = x3 - x1;
    const vy = y3 - y1;
    const vz = z3 - z1;
    
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    
    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
    
    return {
      x: nx / length,
      y: ny / length,
      z: nz / length
    };
  }
  
  static downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
