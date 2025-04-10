
import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Copy, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddContentModal from '@/components/AddContentModal';
import { copyToClipboard } from '@/lib/utils';
import { toast } from 'sonner';
import ContentActions from '@/components/ContentActions';
import { supabase } from '@/integrations/supabase/client';

const CTF = () => {
  const { currentUser } = useStore();
  const [ctfComponents, setCTFComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchCTFComponents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ctf_components')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform from database format to application format if needed
        const formattedData = data?.map(item => ({
          ...item,
          isPublic: item.is_public,
          createdAt: new Date(item.created_at)
        })) || [];
        
        setCTFComponents(formattedData);
      } catch (error) {
        console.error('Error fetching CTF components:', error);
        toast.error('Failed to load CTF components');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCTFComponents();
  }, []);

  const handleCopy = (content: string) => {
    copyToClipboard(content);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading CTF components...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">CTF Resources</h1>
          <p className="text-muted-foreground">
            Manage your CTF tools, team names, and links
          </p>
        </div>
        
        {currentUser && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add CTF Component
          </Button>
        )}
      </div>

      {ctfComponents && ctfComponents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ctfComponents.map((component) => (
            <div 
              key={component.id} 
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">{component.title}</h3>
                
                {currentUser && (currentUser.isAdmin || currentUser.id === component.author_id) && (
                  <ContentActions
                    id={component.id}
                    title={component.title}
                    type="ctf"
                    isPublic={component.isPublic || component.is_public}
                  />
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                Type: <span className="font-medium">{component.type}</span>
              </p>
              
              <div className="bg-background rounded-md p-3 font-mono text-sm relative mb-4">
                <code>{component.content}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => handleCopy(component.content)}
                >
                  <Copy size={12} />
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Added on {new Date(component.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="font-medium mb-2">No CTF Components</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't added any CTF components yet. Add links, team names, or other 
            resources to keep track of them for your CTF competitions.
          </p>
          
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add First CTF Component
          </Button>
        </div>
      )}
      
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add CTF Component</DialogTitle>
            <DialogDescription>
              Add a new CTF component to your collection.
            </DialogDescription>
          </DialogHeader>
          <AddContentModal 
            type="ctf" 
            onComplete={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CTF;
