import React, { useState } from 'react';
import { Scene } from '@/components/3d/Scene';
import { PhotoTo3D } from '@/components/photogrammetry/PhotoTo3D';
import { ExportDialog } from '@/components/export/ExportDialog';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

function App() {
  const [showExport, setShowExport] = useState(false);
  const { objects } = useSceneStore();
  
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="h-12 bg-card border-b border-border flex items-center px-4">
        <h1 className="text-lg font-semibold">3D Scanner and Visualizer</h1>
        <div className="flex-1" />
        <div className="text-xs text-muted-foreground">
          Models: {objects.length}
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar with Tabs */}
        <div className="w-80 bg-card border-r border-border">
          <Tabs defaultValue="photos" className="h-full">
            <TabsList className="grid w-full grid-cols-2 m-2">
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            
            <TabsContent value="photos" className="h-full p-4 mt-0">
              <PhotoTo3D />
            </TabsContent>
            
            <TabsContent value="export" className="h-full p-4 mt-0">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Export 3D Models</h3>
                <p className="text-xs text-muted-foreground">
                  Export your 3D models in various formats for use in other applications.
                </p>
                <Button 
                  onClick={() => setShowExport(true)}
                  disabled={objects.length === 0}
                  className="w-full"
                >
                  Open Export Dialog
                </Button>
                {objects.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Create a 3D model from photos first to enable export.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Main Viewport - View Only */}
        <div className="flex-1 relative">
          <Scene className="w-full h-full" />
        </div>
      </div>
      
      {/* Export Dialog */}
      {showExport && (
        <ExportDialog onClose={() => setShowExport(false)} />
      )}
      
      {/* Footer/Status Bar */}
      <footer className="h-8 bg-card border-t border-border flex items-center px-4 text-xs text-muted-foreground">
        <span>3D Scanner and Visualizer - View Only Mode</span>
        <div className="flex-1" />
        <span>Objects: {objects.length}</span>
      </footer>
    </div>
  );
}

export default App;