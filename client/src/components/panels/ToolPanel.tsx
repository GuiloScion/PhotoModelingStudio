import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToolStore } from '@/lib/stores/useToolStore';
import { Badge } from '@/components/ui/badge';

export function ToolPanel() {
  const { tools, activeTool, setActiveTool, snapEnabled, toggleSnap, showGrid, toggleGrid, showWireframe, toggleWireframe } = useToolStore();
  
  const toolCategories = {
    modify: tools.filter(t => t.category === 'modify'),
    create: tools.filter(t => t.category === 'create'),
    measure: tools.filter(t => t.category === 'measure'),
    material: tools.filter(t => t.category === 'material'),
    photo: tools.filter(t => t.category === 'photo')
  };
  
  return (
    <div className="w-16 bg-card border-r border-border flex flex-col py-2">
      <TooltipProvider delayDuration={300}>
        {/* Selection and Transform Tools */}
        <div className="px-2 mb-2">
          {toolCategories.modify.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  size="sm"
                  className="w-12 h-12 p-0 mb-1"
                  onClick={() => setActiveTool(tool.id)}
                >
                  <span className="text-lg">{tool.icon}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="flex items-center gap-2">
                  <span>{tool.name}</span>
                  {tool.shortcut && (
                    <Badge variant="secondary" className="text-xs">
                      {tool.shortcut}
                    </Badge>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <Separator className="mx-2 mb-2" />
        
        {/* Primitive Creation Tools */}
        <div className="px-2 mb-2">
          {toolCategories.create.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  size="sm"
                  className="w-12 h-12 p-0 mb-1"
                  onClick={() => setActiveTool(tool.id)}
                >
                  <span className="text-lg">{tool.icon}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="flex items-center gap-2">
                  <span>{tool.name}</span>
                  {tool.shortcut && (
                    <Badge variant="secondary" className="text-xs">
                      {tool.shortcut}
                    </Badge>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <Separator className="mx-2 mb-2" />
        
        {/* Measurement Tools */}
        <div className="px-2 mb-2">
          {toolCategories.measure.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  size="sm"
                  className="w-12 h-12 p-0 mb-1"
                  onClick={() => setActiveTool(tool.id)}
                >
                  <span className="text-lg">{tool.icon}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="flex items-center gap-2">
                  <span>{tool.name}</span>
                  {tool.shortcut && (
                    <Badge variant="secondary" className="text-xs">
                      {tool.shortcut}
                    </Badge>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <Separator className="mx-2 mb-2" />
        
        {/* Material Tools */}
        <div className="px-2 mb-2">
          {toolCategories.material.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  size="sm"
                  className="w-12 h-12 p-0 mb-1"
                  onClick={() => setActiveTool(tool.id)}
                >
                  <span className="text-lg">{tool.icon}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>{tool.name}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <Separator className="mx-2 mb-2" />
        
        {/* Photo Tools */}
        <div className="px-2 mb-2">
          {toolCategories.photo.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  size="sm"
                  className="w-12 h-12 p-0 mb-1"
                  onClick={() => setActiveTool(tool.id)}
                >
                  <span className="text-lg">{tool.icon}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>{tool.name}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <div className="flex-1" />
        
        {/* View Options */}
        <div className="px-2 mt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={snapEnabled ? "default" : "ghost"}
                size="sm"
                className="w-12 h-12 p-0 mb-1"
                onClick={toggleSnap}
              >
                <span className="text-lg">🧲</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Toggle Snap
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? "default" : "ghost"}
                size="sm"
                className="w-12 h-12 p-0 mb-1"
                onClick={toggleGrid}
              >
                <span className="text-lg">#</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Toggle Grid
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showWireframe ? "default" : "ghost"}
                size="sm"
                className="w-12 h-12 p-0 mb-1"
                onClick={toggleWireframe}
              >
                <span className="text-lg">📐</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Toggle Wireframe
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
