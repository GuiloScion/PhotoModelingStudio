import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SceneObject, PhotogrammetryResult } from '@/types/modeling';
import { Vector3, Euler } from 'three';

interface SceneState {
  objects: SceneObject[];
  selectedObjectIds: string[];
  
  // Actions
  addObject: (object: SceneObject) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  selectObjects: (ids: string[]) => void;
  clearSelection: () => void;
  duplicateObject: (id: string) => void;
  groupObjects: (ids: string[]) => void;
  ungroupObject: (id: string) => void;
  addPhotoObject: (result: PhotogrammetryResult) => void;
}

export const useSceneStore = create<SceneState>()(
  subscribeWithSelector((set, get) => ({
    objects: [],
    selectedObjectIds: [],
    
    addObject: (object) => {
      set((state) => ({
        objects: [...state.objects, object]
      }));
    },
    
    removeObject: (id) => {
      set((state) => ({
        objects: state.objects.filter(obj => obj.id !== id),
        selectedObjectIds: state.selectedObjectIds.filter(selectedId => selectedId !== id)
      }));
    },
    
    updateObject: (id, updates) => {
      set((state) => ({
        objects: state.objects.map(obj => 
          obj.id === id ? { ...obj, ...updates } : obj
        )
      }));
    },
    
    selectObjects: (ids) => {
      set({ selectedObjectIds: ids });
    },
    
    clearSelection: () => {
      set({ selectedObjectIds: [] });
    },
    
    duplicateObject: (id) => {
      const { objects } = get();
      const original = objects.find(obj => obj.id === id);
      if (original) {
        const duplicate: SceneObject = {
          ...original,
          id: `${original.id}_copy_${Date.now()}`,
          name: `${original.name} Copy`,
          position: new Vector3(
            original.position.x + 1,
            original.position.y,
            original.position.z
          )
        };
        get().addObject(duplicate);
      }
    },
    
    groupObjects: (ids) => {
      const { objects } = get();
      const toGroup = objects.filter(obj => ids.includes(obj.id));
      if (toGroup.length < 2) return;
      
      const groupId = `group_${Date.now()}`;
      const groupObject: SceneObject = {
        id: groupId,
        name: 'Group',
        type: 'group',
        position: new Vector3(0, 0, 0),
        rotation: new Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1),
        children: toGroup,
        visible: true,
        locked: false
      };
      
      set((state) => ({
        objects: [
          ...state.objects.filter(obj => !ids.includes(obj.id)),
          groupObject
        ],
        selectedObjectIds: [groupId]
      }));
    },
    
    ungroupObject: (id) => {
      const { objects } = get();
      const group = objects.find(obj => obj.id === id && obj.type === 'group');
      if (group && group.children) {
        set((state) => ({
          objects: [
            ...state.objects.filter(obj => obj.id !== id),
            ...group.children!
          ]
        }));
      }
    },
    
    addPhotoObject: (result) => {
      const photoObject: SceneObject = {
        id: `photo3d_${Date.now()}`,
        name: 'Photo 3D Model',
        type: 'photo3d',
        position: new Vector3(0, 0, 0),
        rotation: new Euler(0, 0, 0),
        scale: new Vector3(1, 1, 1),
        geometry: result.mesh,
        visible: true,
        locked: false,
        userData: {
          confidence: result.confidence,
          processingTime: result.processingTime,
          pointCloud: result.pointCloud
        }
      };
      get().addObject(photoObject);
    }
  }))
);
