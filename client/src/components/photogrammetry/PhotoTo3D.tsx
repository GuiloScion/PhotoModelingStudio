import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { photogrammetryProcessor } from '@/lib/photogrammetry/processor';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { Camera, Zap, Settings } from 'lucide-react';

export function PhotoTo3D() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [algorithm, setAlgorithm] = useState('sfm');
  const [quality, setQuality] = useState([50]);
  const [density, setDensity] = useState([30]);
  const { addPhotoObject } = useSceneStore();
  
  const photoCount = photogrammetryProcessor.getPhotoCount();
  
  const processPhotos = async () => {
    if (photoCount < 2) {
      alert('Please upload at least 2 photos first');
      return;
    }
    
    setProcessing(true);
    setProgress(0);
    
    try {
      // Simulate progressive processing
      const intervals = [
        { progress: 20, message: 'Analyzing photos...' },
        { progress: 40, message: 'Extracting features...' },
        { progress: 60, message: 'Matching keypoints...' },
        { progress: 80, message: 'Reconstructing geometry...' },
        { progress: 90, message: 'Generating mesh...' },
        { progress: 100, message: 'Finalizing model...' }
      ];
      
      for (const interval of intervals) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(interval.progress);
      }
      
      const result = await photogrammetryProcessor.processTo3D();
      addPhotoObject(result);
      
      alert(`3D model created successfully!\nConfidence: ${(result.confidence * 100).toFixed(1)}%\nProcessing time: ${result.processingTime}ms`);
      
    } catch (error) {
      console.error('Processing failed:', error);
      alert(`Processing failed: ${error.message}`);
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Photo to 3D
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Photos loaded:</span>
          <Badge variant={photoCount >= 2 ? "default" : "secondary"}>
            {photoCount} photos
          </Badge>
        </div>
        
        {/* Algorithm Selection */}
        <div>
          <Label className="text-xs">Reconstruction Algorithm</Label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sfm">Structure from Motion</SelectItem>
              <SelectItem value="mvs">Multi-View Stereo</SelectItem>
              <SelectItem value="neural">Neural Reconstruction</SelectItem>
              <SelectItem value="hybrid">Hybrid Approach</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Quality Settings */}
        <div>
          <Label className="text-xs">Reconstruction Quality: {quality[0]}%</Label>
          <Slider
            value={quality}
            onValueChange={setQuality}
            max={100}
            min={10}
            step={10}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Fast</span>
            <span>High Quality</span>
          </div>
        </div>
        
        {/* Point Density */}
        <div>
          <Label className="text-xs">Point Cloud Density: {density[0]}%</Label>
          <Slider
            value={density}
            onValueChange={setDensity}
            max={100}
            min={10}
            step={10}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Sparse</span>
            <span>Dense</span>
          </div>
        </div>
        
        {/* Processing Progress */}
        {processing && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
        
        {/* Action Button */}
        <Button
          onClick={processPhotos}
          disabled={photoCount < 2 || processing}
          className="w-full"
          size="sm"
        >
          {processing ? (
            <>
              <Settings className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate 3D Model
            </>
          )}
        </Button>
        
        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Higher quality takes longer to process</p>
          <p>• Dense point clouds create more detailed models</p>
          <p>• Neural reconstruction works best with 20+ photos</p>
        </div>
      </CardContent>
    </Card>
  );
}
