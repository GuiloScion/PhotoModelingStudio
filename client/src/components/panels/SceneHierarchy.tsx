import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { useSceneStore } from '@/lib/stores/useSceneStore';
import { Eye, EyeOff, Lock, Unlock, Copy, Trash2 } from 'lucide-react';

export function SceneHierarchy() {
  const { objects, selectedObjectIds, selectObjects, removeObject, duplicateObject, updateObject } = useSceneStore();
  
  const handleObjectClick = (objectId: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select
      const newSelection = selectedObjectIds.includes(objectId)
        ? selectedObjectIds.filter(id => id !== objectId)
        : [...selectedObjectIds, objectId];
      selectObjects(newSelection);
    } else {
      // Single select
      selectObjects([objectId]);
    }
  };
  
  const toggleVisibility = (objectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const object = objects.find(obj => obj.id === objectId);
    if (object) {
      updateObject(objectId, { visible: !object.visible });
    }
  };
  
  const toggleLock = (objectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const object = objects.find(obj => obj.id === objectId);
    if (object) {
      updateObject(objectId, { locked: !object.locked });
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Scene Hierarchy</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {objects.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No objects in scene
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {objects.map((object) => (
                <ContextMenu key={object.id}>
                  <ContextMenuTrigger>
                    <div
                      className={`
                        flex items-center gap-2 p-2 rounded text-sm cursor-pointer
                        hover:bg-accent/50 transition-colors
                        ${selectedObjectIds.includes(object.id) ? 'bg-accent' : ''}
                      `}
                      onClick={(e) => handleObjectClick(object.id, e)}
                    >
                      <span className="text-lg">
                        {getObjectIcon(object.type)}
                      </span>
                      <span className="flex-1 truncate">
                        {object.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => toggleVisibility(object.id, e)}
                      >
                        {object.visible ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => toggleLock(object.id, e)}
                      >
                        {object.locked ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Unlock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => duplicateObject(object.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => removeObject(object.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function getObjectIcon(type: string): string {
  switch (type) {
    case 'primitive':
      return '📦';
    case 'mesh':
      return '🔷';
    case 'group':
      return '📁';
    case 'photo3d':
      return '📷';
    default:
      return '⚫';
  }
}
