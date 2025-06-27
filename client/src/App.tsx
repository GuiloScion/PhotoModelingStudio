import React, { useEffect } from 'react';
import { Scene } from '@/components/3d/Scene';
import { ToolPanel } from '@/components/panels/ToolPanel';
import { PropertiesPanel } from '@/components/panels/PropertiesPanel';
import { SceneHierarchy } from '@/components/panels/SceneHierarchy';
import { FileManager } from '@/components/panels/FileManager';
import { PrimitiveTools } from '@/components/modeling/PrimitiveTools';
import { MaterialEditor } from '@/components/modeling/MaterialEditor';
import { BooleanOperations } from '@/components/modeling/BooleanOperations';
import { PhotoTo3D } from '@/components/photogrammetry/PhotoTo3D';
import { useToolStore } from '@/lib/stores/useToolStore';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { createPrimitiveGeometry } from '@/lib/geometry/primitives';
import { SceneObject } from '@/types/modeling';
import { Vector3, Euler, MeshStandardMaterial } from 'three';
import * as THREE from 'three';

function App() {
  const { activeTool, setActiveTool } = useToolStore();
  const { addObject } = useSceneStore();
  
  // Initialize with a default cube
  useEffect(() => {
    const geometry = createPrimitiveGeometry({
      type: 'box',
      parameters: { width: 1, height: 1, depth: 1 }
    });
    
    const material = new MeshStandardMaterial({
      color: '#4f8ff7',
      metalness: 0.1,
      roughness: 0.7
    });
    
    const defaultObject: SceneObject = {
      id: 'default_cube',
      name: 'Default Cube',
      type: 'primitive',
      position: new Vector3(0, 0.5, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      geometry,
      material,
      visible: true,
      locked: false
    };
    
    addObject(defaultObject);
  }, [addObject]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      
      switch (event.key.toLowerCase()) {
        case 'v':
          setActiveTool('select');
          break;
        case 'g':
          setActiveTool('move');
          break;
        case 'r':
          setActiveTool('rotate');
          break;
        case 's':
          setActiveTool('scale');
          break;
        case 'b':
          setActiveTool('box');
          break;
        case 'u':
          setActiveTool('sphere');
          break;
        case 'c':
          setActiveTool('cylinder');
          break;
        case 'm':
          setActiveTool('measure');
          break;
        case 'escape':
          setActiveTool('select');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setActiveTool]);
  
  const getRightPanelContent = () => {
    switch (activeTool) {
      case 'box':
      case 'sphere':
      case 'cylinder':
      case 'cone':
      case 'plane':
      case 'torus':
        return <PrimitiveTools />;
      case 'material':
        return <MaterialEditor />;
      case 'photo_to_3d':
        return <PhotoTo3D />;
      default:
        return null;
    }
  };
  
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="h-12 bg-card border-b border-border flex items-center px-4">
        <h1 className="text-lg font-semibold">Advanced 3D Modeling Studio</h1>
        <div className="flex-1" />
        <div className="text-xs text-muted-foreground">
          Active Tool: <span className="capitalize">{activeTool?.replace('_', ' ') || 'None'}</span>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          <div className="flex-1 p-4">
            <FileManager />
          </div>
          <div className="flex-1 p-4">
            <SceneHierarchy />
          </div>
        </div>
        
        {/* Tool Panel */}
        <ToolPanel />
        
        {/* Main Viewport */}
        <div className="flex-1 relative">
          <Scene className="w-full h-full" />
          
          {/* Floating panels for specific tools */}
          {(activeTool === 'measure' || activeTool === 'align') && (
            <div className="absolute top-4 left-4 w-64">
              <BooleanOperations />
            </div>
          )}
        </div>
        
        {/* Right Sidebar */}
        <div className="flex">
          {/* Dynamic Tool Panel */}
          {getRightPanelContent() && (
            <div className="w-64 bg-card border-l border-border p-4">
              {getRightPanelContent()}
            </div>
          )}
          
          {/* Properties Panel */}
          <PropertiesPanel />
        </div>
      </div>
      
      {/* Footer/Status Bar */}
      <footer className="h-8 bg-card border-t border-border flex items-center px-4 text-xs text-muted-foreground">
        <span>Ready</span>
        <div className="flex-1" />
        <span>Objects: {useSceneStore.getState().objects.length}</span>
        <span className="ml-4">Selected: {useSceneStore.getState().selectedObjectIds.length}</span>
      </footer>
    </div>
  );
}

export default App;
