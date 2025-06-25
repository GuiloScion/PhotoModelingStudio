import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToolStore } from '@/lib/stores/useToolStore';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { createPrimitiveGeometry, primitiveDefaults } from '@/lib/geometry/primitives';
import { SceneObject } from '@/types/modeling';
import { Vector3, Euler, MeshStandardMaterial } from 'three';

export function PrimitiveTools() {
  const { primitiveSettings, updatePrimitiveSettings, materialSettings } = useToolStore();
  const { addObject } = useSceneStore();
  
  const handleParameterChange = (param: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    updatePrimitiveSettings({
      parameters: {
        ...primitiveSettings.parameters,
        [param]: numValue
      }
    });
  };
  
  const handleTypeChange = (type: string) => {
    updatePrimitiveSettings({
      type: type as any,
      parameters: primitiveDefaults[type] || {}
    });
  };
  
  const createPrimitive = () => {
    const geometry = createPrimitiveGeometry(primitiveSettings);
    const material = new MeshStandardMaterial({
      color: materialSettings.color,
      metalness: materialSettings.metalness || 0,
      roughness: materialSettings.roughness || 0.5
    });
    
    const newObject: SceneObject = {
      id: `${primitiveSettings.type}_${Date.now()}`,
      name: `${primitiveSettings.type.charAt(0).toUpperCase() + primitiveSettings.type.slice(1)}`,
      type: 'primitive',
      position: new Vector3(0, 0, 0),
      rotation: new Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
      geometry,
      material,
      visible: true,
      locked: false
    };
    
    addObject(newObject);
  };
  
  const renderParameterInputs = () => {
    const params = primitiveDefaults[primitiveSettings.type] || {};
    
    return Object.entries(params).map(([key, defaultValue]) => (
      <div key={key} className="grid grid-cols-2 gap-2 items-center">
        <Label htmlFor={key} className="text-xs capitalize">
          {key.replace(/([A-Z])/g, ' $1').trim()}
        </Label>
        <Input
          id={key}
          type="number"
          step="0.1"
          min={key.includes('Segments') ? 1 : 0.1}
          value={primitiveSettings.parameters[key] || defaultValue}
          onChange={(e) => handleParameterChange(key, e.target.value)}
          className="h-7 text-xs"
        />
      </div>
    ));
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Primitive Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs">Primitive Type</Label>
          <Select value={primitiveSettings.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="box">Box</SelectItem>
              <SelectItem value="sphere">Sphere</SelectItem>
              <SelectItem value="cylinder">Cylinder</SelectItem>
              <SelectItem value="cone">Cone</SelectItem>
              <SelectItem value="plane">Plane</SelectItem>
              <SelectItem value="torus">Torus</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs font-medium">Parameters</Label>
          <div className="space-y-2">
            {renderParameterInputs()}
          </div>
        </div>
        
        <Button
          onClick={createPrimitive}
          className="w-full"
          size="sm"
        >
          Create {primitiveSettings.type.charAt(0).toUpperCase() + primitiveSettings.type.slice(1)}
        </Button>
      </CardContent>
    </Card>
  );
}
