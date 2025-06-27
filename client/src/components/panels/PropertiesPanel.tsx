import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useSceneStore } from '@/lib/stores/useSceneStore';

export function PropertiesPanel() {
  const { objects, selectedObjectIds, updateObject } = useSceneStore();
  
  const selectedObject = selectedObjectIds.length === 1 
    ? objects.find(obj => obj.id === selectedObjectIds[0])
    : null;
  
  if (!selectedObject) {
    return (
      <div className="w-80 bg-card border-l border-border p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Select an object to view properties
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newPosition = selectedObject.position.clone();
    newPosition[axis] = numValue;
    updateObject(selectedObject.id, { position: newPosition });
  };
  
  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = (parseFloat(value) || 0) * (Math.PI / 180); // Convert to radians
    const newRotation = selectedObject.rotation.clone();
    newRotation[axis] = numValue;
    updateObject(selectedObject.id, { rotation: newRotation });
  };
  
  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 1;
    const newScale = selectedObject.scale.clone();
    newScale[axis] = numValue;
    updateObject(selectedObject.id, { scale: newScale });
  };
  
  return (
    <div className="w-80 bg-card border-l border-border p-4 overflow-y-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-sm">Object Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div>
            <Label htmlFor="object-name" className="text-xs">Name</Label>
            <Input
              id="object-name"
              value={selectedObject.name}
              onChange={(e) => updateObject(selectedObject.id, { name: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          
          <div>
            <Label className="text-xs">Type</Label>
            <p className="text-sm text-muted-foreground capitalize">{selectedObject.type}</p>
          </div>
          
          <Separator />
          
          {/* Transform */}
          <div>
            <Label className="text-xs font-medium">Position</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div>
                <Label htmlFor="pos-x" className="text-xs text-muted-foreground">X</Label>
                <Input
                  id="pos-x"
                  type="number"
                  step="0.1"
                  value={selectedObject.position.x.toFixed(2)}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="pos-y" className="text-xs text-muted-foreground">Y</Label>
                <Input
                  id="pos-y"
                  type="number"
                  step="0.1"
                  value={selectedObject.position.y.toFixed(2)}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="pos-z" className="text-xs text-muted-foreground">Z</Label>
                <Input
                  id="pos-z"
                  type="number"
                  step="0.1"
                  value={selectedObject.position.z.toFixed(2)}
                  onChange={(e) => handlePositionChange('z', e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-xs font-medium">Rotation (degrees)</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div>
                <Label htmlFor="rot-x" className="text-xs text-muted-foreground">X</Label>
                <Input
                  id="rot-x"
                  type="number"
                  step="1"
                  value={(selectedObject.rotation.x * (180 / Math.PI)).toFixed(1)}
                  onChange={(e) => handleRotationChange('x', e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="rot-y" className="text-xs text-muted-foreground">Y</Label>
                <Input
                  id="rot-y"
                  type="number"
                  step="1"
                  value={(selectedObject.rotation.y * (180 / Math.PI)).toFixed(1)}
                  onChange={(e) => handleRotationChange('y', e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="rot-z" className="text-xs text-muted-foreground">Z</Label>
                <Input
                  id="rot-z"
                  type="number"
                  step="1"
                  value={(selectedObject.rotation.z * (180 / Math.PI)).toFixed(1)}
                  onChange={(e) => handleRotationChange('z', e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-xs font-medium">Scale</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div>
                <Label htmlFor="scale-x" className="text-xs text-muted-foreground">X</Label>
                <Input
                  id="scale-x"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={selectedObject.scale.x.toFixed(2)}
                  onChange={(e) => handleScaleChange('x', e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="scale-y" className="text-xs text-muted-foreground">Y</Label>
                <Input
                  id="scale-y"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={selectedObject.scale.y.toFixed(2)}
                  onChange={(e) => handleScaleChange('y', e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="scale-z" className="text-xs text-muted-foreground">Z</Label>
                <Input
                  id="scale-z"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={selectedObject.scale.z.toFixed(2)}
                  onChange={(e) => handleScaleChange('z', e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Visibility and Lock */}
          <div className="flex gap-2">
            <Button
              variant={selectedObject.visible ? "default" : "outline"}
              size="sm"
              onClick={() => updateObject(selectedObject.id, { visible: !selectedObject.visible })}
              className="flex-1"
            >
              {selectedObject.visible ? "👁️ Visible" : "🙈 Hidden"}
            </Button>
            <Button
              variant={selectedObject.locked ? "default" : "outline"}
              size="sm"
              onClick={() => updateObject(selectedObject.id, { locked: !selectedObject.locked })}
              className="flex-1"
            >
              {selectedObject.locked ? "🔒 Locked" : "🔓 Unlocked"}
            </Button>
          </div>
          
          {/* Additional Info for Photo Objects */}
          {selectedObject.type === 'photo3d' && selectedObject.userData && (
            <>
              <Separator />
              <div>
                <Label className="text-xs font-medium">Photogrammetry Info</Label>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <div>Confidence: {(selectedObject.userData.confidence * 100).toFixed(1)}%</div>
                  <div>Processing Time: {selectedObject.userData.processingTime}ms</div>
                  {selectedObject.userData.pointCloud && (
                    <div>Points: {selectedObject.userData.pointCloud.length / 3}</div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
