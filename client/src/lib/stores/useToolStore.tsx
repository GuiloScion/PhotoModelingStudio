import { create } from 'zustand';
import { ModelingTool, PrimitiveType, MaterialProperties } from '@/types/modeling';

interface ToolState {
  activeTool: string | null;
  tools: ModelingTool[];
  primitiveSettings: PrimitiveType;
  materialSettings: MaterialProperties;
  snapEnabled: boolean;
  snapDistance: number;
  showGrid: boolean;
  showWireframe: boolean;
  
  // Actions
  setActiveTool: (toolId: string | null) => void;
  updatePrimitiveSettings: (settings: Partial<PrimitiveType>) => void;
  updateMaterialSettings: (settings: Partial<MaterialProperties>) => void;
  toggleSnap: () => void;
  toggleGrid: () => void;
  toggleWireframe: () => void;
  setSnapDistance: (distance: number) => void;
}

const defaultTools: ModelingTool[] = [
  // Create tools
  { id: 'select', name: 'Select', icon: '⚫', category: 'modify', active: false, shortcut: 'V' },
  { id: 'move', name: 'Move', icon: '↗️', category: 'modify', active: false, shortcut: 'G' },
  { id: 'rotate', name: 'Rotate', icon: '🔄', category: 'modify', active: false, shortcut: 'R' },
  { id: 'scale', name: 'Scale', icon: '📏', category: 'modify', active: false, shortcut: 'S' },
  
  // Primitive tools
  { id: 'box', name: 'Box', icon: '📦', category: 'create', active: false, shortcut: 'B' },
  { id: 'sphere', name: 'Sphere', icon: '⚪', category: 'create', active: false, shortcut: 'U' },
  { id: 'cylinder', name: 'Cylinder', icon: '🗂️', category: 'create', active: false, shortcut: 'C' },
  { id: 'cone', name: 'Cone', icon: '🔺', category: 'create', active: false },
  { id: 'plane', name: 'Plane', icon: '▫️', category: 'create', active: false },
  { id: 'torus', name: 'Torus', icon: '🍩', category: 'create', active: false },
  
  // Measurement tools
  { id: 'measure', name: 'Measure', icon: '📐', category: 'measure', active: false, shortcut: 'M' },
  { id: 'align', name: 'Align', icon: '📏', category: 'measure', active: false },
  
  // Material tools
  { id: 'material', name: 'Material', icon: '🎨', category: 'material', active: false },
  
  // Photo tools
  { id: 'photo_upload', name: 'Photo Upload', icon: '📷', category: 'photo', active: false },
  { id: 'photo_to_3d', name: 'Photo to 3D', icon: '🖼️', category: 'photo', active: false }
];

export const useToolStore = create<ToolState>((set) => ({
  activeTool: 'select',
  tools: defaultTools,
  primitiveSettings: {
    type: 'box',
    parameters: { width: 1, height: 1, depth: 1 }
  },
  materialSettings: {
    type: 'standard',
    color: '#ffffff',
    metalness: 0,
    roughness: 0.5,
    opacity: 1,
    transparent: false
  },
  snapEnabled: true,
  snapDistance: 0.1,
  showGrid: true,
  showWireframe: false,
  
  setActiveTool: (toolId) => {
    set((state) => ({
      activeTool: toolId,
      tools: state.tools.map(tool => ({
        ...tool,
        active: tool.id === toolId
      }))
    }));
  },
  
  updatePrimitiveSettings: (settings) => {
    set((state) => ({
      primitiveSettings: { ...state.primitiveSettings, ...settings }
    }));
  },
  
  updateMaterialSettings: (settings) => {
    set((state) => ({
      materialSettings: { ...state.materialSettings, ...settings }
    }));
  },
  
  toggleSnap: () => {
    set((state) => ({ snapEnabled: !state.snapEnabled }));
  },
  
  toggleGrid: () => {
    set((state) => ({ showGrid: !state.showGrid }));
  },
  
  toggleWireframe: () => {
    set((state) => ({ showWireframe: !state.showWireframe }));
  },
  
  setSnapDistance: (distance) => {
    set({ snapDistance: distance });
  }
}));
