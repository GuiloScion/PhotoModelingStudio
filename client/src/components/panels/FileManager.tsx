import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PhotoUploader } from '@/components/photogrammetry/PhotoUploader';
import { ExportDialog } from '@/components/export/ExportDialog';
import { Upload, Download, FolderOpen, Save } from 'lucide-react';

export function FileManager() {
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">File Manager</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Tabs defaultValue="files" className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files" className="text-xs">Files</TabsTrigger>
            <TabsTrigger value="photos" className="text-xs">Photos</TabsTrigger>
            <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="files" className="mt-4">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {/* TODO: Implement file operations */}}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                Open Project
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {/* TODO: Implement save */}}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Project
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {/* TODO: Implement import */}}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import Model
              </Button>
            </div>
            
            <div className="mt-4">
              <h4 className="text-xs font-medium mb-2">Recent Files</h4>
              <ScrollArea className="h-32">
                <div className="text-xs text-muted-foreground text-center py-4">
                  No recent files
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="photos" className="mt-4">
            <div className="space-y-2">
              <Dialog open={showPhotoUploader} onOpenChange={setShowPhotoUploader}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload Photos for 3D Reconstruction</DialogTitle>
                  </DialogHeader>
                  <PhotoUploader onClose={() => setShowPhotoUploader(false)} />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mt-4">
              <h4 className="text-xs font-medium mb-2">Photo Sets</h4>
              <ScrollArea className="h-32">
                <div className="text-xs text-muted-foreground text-center py-4">
                  No photo sets uploaded
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="mt-4">
            <div className="space-y-2">
              <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Model
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export 3D Model</DialogTitle>
                  </DialogHeader>
                  <ExportDialog onClose={() => setShowExportDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mt-4">
              <h4 className="text-xs font-medium mb-2">Export History</h4>
              <ScrollArea className="h-32">
                <div className="text-xs text-muted-foreground text-center py-4">
                  No exports yet
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
