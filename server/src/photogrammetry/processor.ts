import sharp from 'sharp';
import * as THREE from 'three';
import exifr from 'exifr';
import { PhotoProcessingOptions, PhotogrammetryResult } from '../types';

export async function processPhotogrammetry(
  files: Express.Multer.File[],
  options: PhotoProcessingOptions
): Promise<PhotogrammetryResult> {
  const startTime = Date.now();
  
  try {
    // 1. Process images and extract features
    const processedImages = await Promise.all(
      files.map(async (file) => {
        // Load image
        const image = sharp(file.path);
        const metadata = await image.metadata();
        const exif = await exifr.parse(file.path);
        
        // Convert to grayscale and get pixels
        const { data, info } = await image
          .grayscale()
          .raw()
          .toBuffer({ resolveWithObject: true });

        return {
          data,
          width: info.width,
          height: info.height,
          exif
        };
      })
    );

    // 2. Generate point cloud from image pairs
    const pointCloud = await generatePointCloud(processedImages, options);

    // 3. Create mesh from point cloud
    const { vertices, indices, normals } = await generateMesh(pointCloud, options);

    // 4. Calculate confidence based on point cloud density and coverage
    const confidence = calculateConfidence(pointCloud, processedImages.length);

    return {
      mesh: {
        vertices: new Float32Array(vertices),
        indices: new Uint32Array(indices),
        normals: new Float32Array(normals)
      },
      pointCloud: new Float32Array(pointCloud.points),
      confidence,
      processingTime: Date.now() - startTime
    };
  } catch (error) {
    throw new Error(`Photogrammetry processing failed: ${error.message}`);
  }
}

async function generatePointCloud(
  images: Array<{
    data: Buffer;
    width: number;
    height: number;
    exif: any;
  }>,
  options: PhotoProcessingOptions
) {
  const points: number[] = [];
  const features: number[][] = [];

  // Extract features from each image
  for (const image of images) {
    const imageFeatures = await extractFeatures(image.data, image.width, image.height);
    features.push(imageFeatures);
  }

  // Match features between consecutive image pairs
  for (let i = 0; i < images.length - 1; i++) {
    const matches = matchFeatures(features[i], features[i + 1]);
    
    // Triangulate matched points
    const triangulatedPoints = triangulatePoints(
      matches,
      images[i].exif,
      images[i + 1].exif
    );
    
    points.push(...triangulatedPoints);
  }

  return {
    points,
    density: points.length / (images.length * 1000) // points per image
  };
}

async function extractFeatures(
  imageData: Buffer,
  width: number,
  height: number
): Promise<number[]> {
  const features: number[] = [];
  const step = Math.max(1, Math.floor(width * height / 10000));

  // Simple feature detection using intensity gradients
  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const idx = y * width + x;
      const gradX = 
        Number(imageData[idx + 1]) - 
        Number(imageData[idx - 1]);
      const gradY = 
        Number(imageData[idx + width]) - 
        Number(imageData[idx - width]);
      
      // Only keep strong features
      if (Math.sqrt(gradX * gradX + gradY * gradY) > 30) {
        features.push(x, y);
      }
    }
  }

  return features;
}

function matchFeatures(features1: number[], features2: number[]): number[][] {
  const matches: number[][] = [];
  const threshold = 10; // Distance threshold for matching

  // Simple nearest neighbor matching
  for (let i = 0; i < features1.length; i += 2) {
    let bestMatch = -1;
    let bestDist = Infinity;

    for (let j = 0; j < features2.length; j += 2) {
      const dist = Math.sqrt(
        Math.pow(features1[i] - features2[j], 2) +
        Math.pow(features1[i + 1] - features2[j + 1], 2)
      );

      if (dist < threshold && dist < bestDist) {
        bestMatch = j;
        bestDist = dist;
      }
    }

    if (bestMatch !== -1) {
      matches.push([
        features1[i], features1[i + 1],
        features2[bestMatch], features2[bestMatch + 1]
      ]);
    }
  }

  return matches;
}

function triangulatePoints(
  matches: number[][],
  exif1: any,
  exif2: any
): number[] {
  const points: number[] = [];
  const focalLength = exif1.FocalLength || 50; // Default focal length if not in EXIF
  
  for (const match of matches) {
    // Simple triangulation using similar triangles
    const [x1, y1, x2, y2] = match;
    const disparity = Math.abs(x2 - x1);
    
    if (disparity > 0) {
      const depth = (focalLength * 0.1) / disparity; // Rough depth estimate
      const x = (x1 + x2) / 2;
      const y = (y1 + y2) / 2;
      const z = depth;
      
      points.push(x, y, z);
    }
  }

  return points;
}

async function generateMesh(
  pointCloud: { points: number[]; density: number },
  options: PhotoProcessingOptions
): Promise<{
  vertices: number[];
  indices: number[];
  normals: number[];
}> {
  const vertices: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];

  // Convert point cloud to mesh using triangulation
  const points = pointCloud.points;
  for (let i = 0; i < points.length; i += 9) {
    // Create triangles from nearby points
    if (i + 8 < points.length) {
      // Add vertex positions
      for (let j = 0; j < 9; j++) {
        vertices.push(points[i + j]);
      }

      // Add triangle indices
      const baseIndex = i / 3;
      indices.push(
        baseIndex, baseIndex + 1, baseIndex + 2
      );

      // Calculate and add normals
      const v1 = new THREE.Vector3(points[i], points[i + 1], points[i + 2]);
      const v2 = new THREE.Vector3(points[i + 3], points[i + 4], points[i + 5]);
      const v3 = new THREE.Vector3(points[i + 6], points[i + 7], points[i + 8]);

      const normal = new THREE.Vector3()
        .crossVectors(
          new THREE.Vector3().subVectors(v2, v1),
          new THREE.Vector3().subVectors(v3, v1)
        )
        .normalize();

      // Add the same normal for all three vertices
      for (let j = 0; j < 3; j++) {
        normals.push(normal.x, normal.y, normal.z);
      }
    }
  }

  return { vertices, indices, normals };
}

function calculateConfidence(
  pointCloud: { points: number[]; density: number },
  numImages: number
): number {
  // Calculate confidence based on multiple factors
  const pointDensity = Math.min(1, pointCloud.density / 100);
  const coverage = Math.min(1, numImages / 20); // Assumes 20 images is optimal
  
  return (pointDensity * 0.7 + coverage * 0.3);
}