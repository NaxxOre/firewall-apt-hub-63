
import React from 'react';
import { useStore } from '@/lib/store';
import { Copy, Lock, Unlock, MoveRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CTF = () => {
  const { ctfComponents, isAuthenticated } = useStore();
  const navigate = useNavigate();

  // Group CTF components by base name (removing the " - Link", " - Team", etc.)
  const groupedComponents = ctfComponents.reduce((acc, component) => {
    const baseName = component.title.split(' - ')[0];
    
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    
    acc[baseName].push(component);
    return acc;
  }, {} as Record<string, typeof ctfComponents>);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Filter out components that should not be shown to non-authenticated users
  const filterComponents = (components: typeof ctfComponents) => {
    return components.filter(comp => isAuthenticated || comp.isPublic);
  };

  // Check if a CTF has specific component type
  const hasComponentType = (components: typeof ctfComponents, type: string) => {
    return components.some(comp => comp.type === type);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CTF Resources</h1>
        {isAuthenticated && (
          <Button onClick={() => navigate('/user')}>Add CTF</Button>
        )}
      </div>

      {!isAuthenticated && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <Lock className="mr-3 text-primary h-5 w-5" />
            <p className="text-muted-foreground">Some CTF resources are only available to authenticated users.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedComponents).map(([baseName, components]) => {
          const visibleComponents = filterComponents(components);
          
          if (visibleComponents.length === 0) return null;
          
          return (
            <div key={baseName} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">{baseName}</h2>
                  {isAuthenticated ? (
                    <Unlock className="h-4 w-4 text-green-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {/* Link */}
                  {hasComponentType(visibleComponents, 'link') && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">CTF Link:</div>
                      {visibleComponents
                        .filter(comp => comp.type === 'link')
                        .map(comp => (
                          <div key={comp.id} className="flex items-center justify-between gap-2">
                            <a 
                              href={comp.content} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center"
                            >
                              {comp.content}
                              <MoveRight className="ml-1 h-3 w-3" />
                            </a>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCopy(comp.content)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                  
                  {/* Team Name */}
                  {hasComponentType(visibleComponents, 'teamName') && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Team Name:</div>
                      {visibleComponents
                        .filter(comp => comp.type === 'teamName')
                        .map(comp => (
                          <div key={comp.id} className="flex items-center justify-between gap-2">
                            <span className="text-sm">{comp.content}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCopy(comp.content)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                  
                  {/* Password */}
                  {hasComponentType(visibleComponents, 'password') && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Password:</div>
                      {visibleComponents
                        .filter(comp => comp.type === 'password')
                        .map(comp => (
                          <div key={comp.id} className="flex items-center justify-between gap-2">
                            <span className="text-sm font-mono">{comp.content}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCopy(comp.content)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {Object.keys(groupedComponents).length === 0 && (
          <div className="col-span-full">
            <div className="text-center p-10 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-2">No CTF components available yet.</p>
              {isAuthenticated && (
                <Button onClick={() => navigate('/user')}>Add CTF Components</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CTF;
