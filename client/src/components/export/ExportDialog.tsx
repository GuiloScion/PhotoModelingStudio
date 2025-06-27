import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { ModelExporter } from '@/lib/export/formats';
import { ExportFormat } from '@/types/modeling';
import { Download, FileText } from 'lucide-react';
import * as THREE from 'three';

interface ExportDialogProps {
  onClose: () => void;
}

export function ExportDialog({ onClose }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat['format']>('stl');
  const [filename, setFilename] = useState('model');
  const [includeTextures, setIncludeTextures] = useState(true);
  const [includeMaterials, setIncludeMaterials] = useState(true);
  const [binary, setBinary] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  const { objects, selectedObjectIds } = useSceneStore();
  
  const objectsToExport = selectedObjectIds.length > 0
    ? objects.filter(obj => selectedObjectIds.includes(obj.id))
    : objects;
  
  const handleExport = async () => {
    if (objectsToExport.length === 0) {
      alert('No objects to export');
      return;
    }
    
    setExporting(true);
    
    try {
      let content = '';
      let mimeType = 'text/plain';
      let fileExtension = format;
      
      // For simplicity, export the first object's geometry
      const firstObject = objectsToExport[0];
      if (!firstObject.geometry) {
        throw new Error('Selected object has no geometry');
      }
      
      const options = {
        includeTextures,
        includeMaterials,
        binary
      };
      
      switch (format) {
        case 'stl':
          content = await ModelExporter.exportSTL(firstObject.geometry, options);
          mimeType = 'application/octet-stream';
          break;
        case 'obj':
          content = await ModelExporter.exportOBJ(firstObject.geometry, options);
          mimeType = 'text/plain';
          break;
        case 'ply':
          content = await ModelExporter.exportPLY(firstObject.geometry, options);
          mimeType = 'text/plain';
          break;
        case 'gltf':
          // For GLTF, we need the full scene
          content = await ModelExporter.exportGLTF(new THREE.Scene(), options);
          mimeType = 'application/json';
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
      
      const fullFilename = `${filename}.${fileExtension}`;
      ModelExporter.downloadFile(content, fullFilename, mimeType);
      
      onClose();
      
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };
  
  const getFormatInfo = (format: string) => {
    switch (format) {
      case 'stl':
        return 'STL - Standard format for 3D printing';
      case 'obj':
        return 'OBJ - Wavefront OBJ with materials';
      case 'ply':
        return 'PLY - Stanford PLY format';
      case 'gltf':
        return 'GLTF - Modern 3D format with animations';
      case 'fbx':
        return 'FBX - Autodesk FBX format';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Export Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Export Summary</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Objects to export: {objectsToExport.length}</p>
            <p>
              {selectedObjectIds.length > 0 
                ? 'Exporting selected objects only' 
                : 'Exporting all objects in scene'
              }
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Export Settings */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="filename" className="text-sm">Filename</Label>
          <Input
            id="filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm">Format</Label>
          <Select value={format} onValueChange={(value) => setFormat(value as any)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stl">STL (.stl)</SelectItem>
              <SelectItem value="obj">Wavefront OBJ (.obj)</SelectItem>
              <SelectItem value="ply">Stanford PLY (.ply)</SelectItem>
              <SelectItem value="gltf">GLTF 2.0 (.gltf)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {getFormatInfo(format)}
          </p>
        </div>
        
        {/* Format-specific options */}
        {(format === 'obj' || format === 'gltf') && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-materials"
                checked={includeMaterials}
                onCheckedChange={(checked) => setIncludeMaterials(checked as boolean)}
              />
              <Label htmlFor="include-materials" className="text-sm">
                Include materials
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-textures"
                checked={includeTextures}
                onCheckedChange={(checked) => setIncludeTextures(checked as boolean)}
              />
              <Label htmlFor="include-textures" className="text-sm">
                Include textures
              </Label>
            </div>
          </div>
        )}
        
        {format === 'stl' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="binary-format"
              checked={binary}
              onCheckedChange={(checked) => setBinary(checked as boolean)}
            />
            <Label htmlFor="binary-format" className="text-sm">
              Binary format (smaller file size)
            </Label>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={exporting}>
          Cancel
        </Button>
        <Button onClick={handleExport} disabled={exporting || objectsToExport.length === 0}>
          {exporting ? (
            'Exporting...'
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Model
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
