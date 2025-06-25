import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToolStore } from '@/lib/stores/useToolStore';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial } from 'three';

export function MaterialEditor() {
  const { materialSettings, updateMaterialSettings } = useToolStore();
  const { selectedObjectIds, updateObject, objects } = useSceneStore();
  
  const selectedObject = selectedObjectIds.length === 1 
    ? objects.find(obj => obj.id === selectedObjectIds[0])
    : null;
  
  const applyMaterial = () => {
    if (!selectedObject) return;
    
    let material;
    
    switch (materialSettings.type) {
      case 'basic':
        material = new MeshBasicMaterial({
          color: materialSettings.color,
          transparent: materialSettings.transparent,
          opacity: materialSettings.opacity
        });
        break;
      case 'physical':
        material = new MeshPhysicalMaterial({
          color: materialSettings.color,
          metalness: materialSettings.metalness || 0,
          roughness: materialSettings.roughness || 0.5,
          transparent: materialSettings.transparent,
          opacity: materialSettings.opacity
        });
        break;
      default:
        material = new MeshStandardMaterial({
          color: materialSettings.color,
          metalness: materialSettings.metalness || 0,
          roughness: materialSettings.roughness || 0.5,
          transparent: materialSettings.transparent,
          opacity: materialSettings.opacity
        });
    }
    
    updateObject(selectedObject.id, { material });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Material Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs">Material Type</Label>
          <Select 
            value={materialSettings.type} 
            onValueChange={(value) => updateMaterialSettings({ type: value as any })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="physical">Physical</SelectItem>
              <SelectItem value="pbr">PBR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="color" className="text-xs">Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="color"
              type="color"
              value={materialSettings.color}
              onChange={(e) => updateMaterialSettings({ color: e.target.value })}
              className="h-8 w-16 p-1"
            />
            <Input
              type="text"
              value={materialSettings.color}
              onChange={(e) => updateMaterialSettings({ color: e.target.value })}
              className="h-8 text-xs flex-1"
            />
          </div>
        </div>
        
        {(materialSettings.type === 'standard' || materialSettings.type === 'physical' || materialSettings.type === 'pbr') && (
          <>
            <div>
              <Label className="text-xs">Metalness: {materialSettings.metalness?.toFixed(2) || '0.00'}</Label>
              <Slider
                value={[materialSettings.metalness || 0]}
                onValueChange={([value]) => updateMaterialSettings({ metalness: value })}
                max={1}
                min={0}
                step={0.01}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-xs">Roughness: {materialSettings.roughness?.toFixed(2) || '0.50'}</Label>
              <Slider
                value={[materialSettings.roughness || 0.5]}
                onValueChange={([value]) => updateMaterialSettings({ roughness: value })}
                max={1}
                min={0}
                step={0.01}
                className="mt-2"
              />
            </div>
          </>
        )}
        
        <div>
          <Label className="text-xs">Opacity: {materialSettings.opacity?.toFixed(2) || '1.00'}</Label>
          <Slider
            value={[materialSettings.opacity || 1]}
            onValueChange={([value]) => updateMaterialSettings({ 
              opacity: value,
              transparent: value < 1
            })}
            max={1}
            min={0}
            step={0.01}
            className="mt-2"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="transparent"
            checked={materialSettings.transparent || false}
            onCheckedChange={(checked) => updateMaterialSettings({ transparent: checked })}
          />
          <Label htmlFor="transparent" className="text-xs">Transparent</Label>
        </div>
        
        <div className="pt-2">
          <button
            onClick={applyMaterial}
            disabled={!selectedObject}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Material
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
