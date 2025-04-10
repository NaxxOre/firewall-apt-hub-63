
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { CATEGORIES, CATEGORY_SECTIONS } from '@/lib/constants';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CategoryNav from '@/components/CategoryNav';
import AddCodeSnippet from '@/components/AddCodeSnippet';
import AddTestingTool from '@/components/AddTestingTool';
import AddContentModal from '@/components/AddContentModal';
import CodeSnippetDisplay from '@/components/CodeSnippetDisplay';
import TestingToolDisplay from '@/components/TestingToolDisplay';
import ContentCard from '@/components/ContentCard';
import ContentActions from '@/components/ContentActions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Category = () => {
  const { categoryId = '', sectionId = 'codes' } = useParams<{ categoryId: string; sectionId: string }>();
  const [codeSnippets, setCodeSnippets] = useState<any[]>([]);
  const [writeUps, setWriteUps] = useState<any[]>([]);
  const [testingTools, setTestingTools] = useState<any[]>([]);
  const { isAuthenticated, currentUser } = useStore();
  const [modalOpen, setModalOpen] = useState<{
    isOpen: boolean,
    type: 'code' | 'tool' | 'writeup',
    title: string
  }>({
    isOpen: false,
    type: 'code',
    title: ''
  });
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  
  const category = CATEGORIES.find((cat) => cat.slug === categoryId);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch data from Supabase based on category
        if (category) {
          const { data: snippetsData, error: snippetsError } = await supabase
            .from('code_snippets')
            .select('*')
            .eq('category_id', category.id);
            
          if (snippetsError) throw snippetsError;
          
          // Transform snippets to application format
          const formattedSnippets = snippetsData?.map(snippet => ({
            ...snippet,
            isPublic: snippet.is_public,
            categoryId: snippet.category_id,
            createdAt: new Date(snippet.created_at)
          })) || [];
          
          setCodeSnippets(formattedSnippets);
          
          const { data: writeUpsData, error: writeUpsError } = await supabase
            .from('write_ups')
            .select('*')
            .eq('category_id', category.id);
            
          if (writeUpsError) throw writeUpsError;
          
          // Transform write-ups to application format
          const formattedWriteUps = writeUpsData?.map(writeUp => ({
            ...writeUp,
            isPublic: writeUp.is_public,
            categoryId: writeUp.category_id,
            createdAt: new Date(writeUp.created_at)
          })) || [];
          
          setWriteUps(formattedWriteUps);
          
          const { data: toolsData, error: toolsError } = await supabase
            .from('testing_tools')
            .select('*')
            .eq('category_id', category.id);
            
          if (toolsError) throw toolsError;
          
          // Transform testing tools to application format
          const formattedTools = toolsData?.map(tool => ({
            ...tool,
            isPublic: tool.is_public,
            categoryId: tool.category_id,
            createdAt: new Date(tool.created_at)
          })) || [];
          
          setTestingTools(formattedTools);
        }
      } catch (error) {
        console.error('Error loading category data:', error);
        toast.error('Failed to load category data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [categoryId, category]);
  
  if (!category) {
    console.error(`Category not found for slug: ${categoryId}`);
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-6">The category you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }
  
  const openModal = (type: 'code' | 'tool' | 'writeup', title: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setModalOpen({
      isOpen: true,
      type,
      title
    });
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-10">
          <p>Loading {sectionId} content...</p>
        </div>
      );
    }
    
    switch (sectionId) {
      case 'codes':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Code Snippets</h2>
              <Button
                size="sm"
                onClick={() => openModal('code', 'Add Code Snippet')}
                className="flex items-center"
              >
                <Plus size={16} className="mr-1" />
                <span>Add Snippet</span>
              </Button>
            </div>
            
            {codeSnippets.length === 0 ? (
              <div className="text-center py-10 border border-dashed rounded-lg">
                <h3 className="text-lg font-medium mb-2">No Code Snippets</h3>
                <p className="text-muted-foreground mb-4">
                  No code snippets have been added to this category yet.
                </p>
                <Button 
                  onClick={() => openModal('code', 'Add Code Snippet')}
                  className="flex items-center mx-auto" 
                >
                  <Plus size={16} className="mr-1" />
                  <span>Add Code Snippet</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {codeSnippets.map((snippet) => (
                  <CodeSnippetDisplay key={snippet.id} snippet={snippet} />
                ))}
              </div>
            )}
          </>
        );
        
      case 'writeups':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Write-ups</h2>
              <Button
                size="sm"
                onClick={() => openModal('writeup', 'Add Write-up')}
                className="flex items-center"
              >
                <Plus size={16} className="mr-1" />
                <span>Add Write-up</span>
              </Button>
            </div>
            
            {writeUps.length === 0 ? (
              <div className="text-center py-10 border border-dashed rounded-lg">
                <h3 className="text-lg font-medium mb-2">No Write-ups</h3>
                <p className="text-muted-foreground mb-4">
                  No write-ups have been added to this category yet.
                </p>
                <Button 
                  onClick={() => openModal('writeup', 'Add Write-up')}
                  className="flex items-center mx-auto" 
                >
                  <Plus size={16} className="mr-1" />
                  <span>Add Write-up</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {writeUps.map((writeUp) => (
                  <ContentCard key={writeUp.id} title={writeUp.title} isPublic={writeUp.isPublic || writeUp.is_public}>
                    <a 
                      href={writeUp.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm mb-3 block"
                    >
                      {writeUp.url}
                    </a>
                    {writeUp.description && (
                      <p className="text-sm text-muted-foreground mb-3">{writeUp.description}</p>
                    )}
                    <div className="flex justify-end">
                      <ContentActions
                        id={writeUp.id}
                        title={writeUp.title}
                        type="writeup"
                        isPublic={writeUp.isPublic || writeUp.is_public}
                      />
                    </div>
                  </ContentCard>
                ))}
              </div>
            )}
          </>
        );
        
      case 'testing-tools':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Testing Tools</h2>
              <Button
                size="sm"
                onClick={() => openModal('tool', 'Add Testing Tool')}
                className="flex items-center"
              >
                <Plus size={16} className="mr-1" />
                <span>Add Tool</span>
              </Button>
            </div>
            
            {testingTools.length === 0 ? (
              <div className="text-center py-10 border border-dashed rounded-lg">
                <h3 className="text-lg font-medium mb-2">No Testing Tools</h3>
                <p className="text-muted-foreground mb-4">
                  No testing tools have been added to this category yet.
                </p>
                <Button 
                  onClick={() => openModal('tool', 'Add Testing Tool')}
                  className="flex items-center mx-auto" 
                >
                  <Plus size={16} className="mr-1" />
                  <span>Add Testing Tool</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testingTools.map((tool) => (
                  <TestingToolDisplay key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </>
        );
        
      default:
        return (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">Invalid Section</h3>
            <p>Please select a valid section from the navigation above.</p>
          </div>
        );
    }
  };
  
  const closeModalHandler = () => {
    setModalOpen({
      ...modalOpen,
      isOpen: false
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground">{category.description}</p>
      </div>
      
      <CategoryNav />
      
      <div className="bg-card border border-border rounded-lg p-6">
        {renderContent()}
      </div>
      
      {modalOpen.type === 'code' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={isOpen => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{modalOpen.title}</DialogTitle>
              <DialogDescription>
                Add a new code snippet to the {category.name} category.
              </DialogDescription>
            </DialogHeader>
            <AddCodeSnippet closeModal={closeModalHandler} />
          </DialogContent>
        </Dialog>
      )}
      
      {modalOpen.type === 'tool' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={isOpen => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{modalOpen.title}</DialogTitle>
              <DialogDescription>
                Add a new testing tool to the {category.name} category.
              </DialogDescription>
            </DialogHeader>
            <AddTestingTool closeModal={closeModalHandler} />
          </DialogContent>
        </Dialog>
      )}
      
      {modalOpen.type === 'writeup' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={isOpen => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{modalOpen.title}</DialogTitle>
              <DialogDescription>
                Add a new write-up to the {category.name} category.
              </DialogDescription>
            </DialogHeader>
            <AddContentModal 
              type="writeup" 
              onComplete={closeModalHandler}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Category;
