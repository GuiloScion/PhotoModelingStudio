export interface PhotoProcessingOptions {
  algorithm: string;
  quality: number;
  density: number;
}

export interface PhotogrammetryResult {
  mesh: {
    vertices: Float32Array;
    indices: Uint32Array;
    normals: Float32Array;
  };
  pointCloud: Float32Array;
  confidence: number;
  processingTime: number;
}