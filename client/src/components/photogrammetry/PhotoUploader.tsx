import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { photogrammetryProcessor } from '@/lib/photogrammetry/processor';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { Upload, X, Image, AlertCircle, CheckCircle } from 'lucide-react';

interface PhotoUploaderProps {
  onClose: () => void;
}

interface PhotoFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploaded' | 'error';
  error?: string;
}

export function PhotoUploader({ onClose }: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addPhotoObject } = useSceneStore();
  
  const handleFileSelect = useCallback((files: FileList) => {
    const newPhotos: PhotoFile[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        newPhotos.push({
          file,
          preview,
          status: 'pending'
        });
      }
    });
    
    setPhotos(prev => [...prev, ...newPhotos]);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);
  
  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].preview);
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };
  
  const uploadPhotos = async () => {
    if (photos.length < 2) {
      alert('Please upload at least 2 photos for photogrammetry');
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    try {
      // Clear previous photos from processor
      photogrammetryProcessor.clearPhotos();
      
      // Upload photos one by one
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        
        try {
          await photogrammetryProcessor.addPhoto(photo.file);
          setPhotos(prev => prev.map((p, idx) => 
            idx === i ? { ...p, status: 'uploaded' } : p
          ));
          setProgress(((i + 1) / photos.length) * 50); // 50% for upload
        } catch (error) {
          setPhotos(prev => prev.map((p, idx) => 
            idx === i ? { ...p, status: 'error', error: error.message } : p
          ));
        }
      }
      
      setUploading(false);
      setProcessing(true);
      setProgress(50);
      
      // Process to 3D
      const result = await photogrammetryProcessor.processTo3D();
      
      setProgress(100);
      
      // Add to scene
      addPhotoObject(result);
      
      // Clean up
      photos.forEach(photo => URL.revokeObjectURL(photo.preview));
      
      onClose();
      
    } catch (error) {
      console.error('Photogrammetry failed:', error);
      alert(`Processing failed: ${error.message}`);
    } finally {
      setUploading(false);
      setProcessing(false);
      setProgress(0);
    }
  };
  
  const isProcessing = uploading || processing;
  
  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop photos here, or click to select
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
              id="photo-upload"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('photo-upload')?.click()}
              disabled={isProcessing}
            >
              Select Photos
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Photo List */}
      {photos.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">
                Uploaded Photos ({photos.length})
              </h3>
              <Badge variant={photos.length >= 2 ? "default" : "secondary"}>
                {photos.length >= 2 ? "Ready" : "Need more photos"}
              </Badge>
            </div>
            
            <ScrollArea className="h-48">
              <div className="grid grid-cols-2 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded border">
                      <img
                        src={photo.preview}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index)}
                      disabled={isProcessing}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    
                    <div className="absolute bottom-1 left-1">
                      {photo.status === 'pending' && (
                        <Badge variant="secondary" className="text-xs">
                          <Image className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {photo.status === 'uploaded' && (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                      )}
                      {photo.status === 'error' && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {uploading ? 'Uploading photos...' : 'Processing 3D model...'}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button 
          onClick={uploadPhotos} 
          disabled={photos.length < 2 || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Create 3D Model'}
        </Button>
      </div>
      
      {/* Tips */}
      <Card className="bg-muted">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium mb-2">Photogrammetry Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Take photos from multiple angles around the object</li>
            <li>• Ensure good lighting and avoid shadows</li>
            <li>• Include at least 20-30 photos for best results</li>
            <li>• Overlap each photo by 60-80% with the next</li>
            <li>• Keep the object in focus and avoid motion blur</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
