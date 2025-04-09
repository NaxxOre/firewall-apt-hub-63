import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Code, Wrench } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddCodeSnippet from '@/components/AddCodeSnippet';
import AddTestingTool from '@/components/AddTestingTool';
import CodeSnippetDisplay from '@/components/CodeSnippetDisplay';
import TestingToolDisplay from '@/components/TestingToolDisplay';
import ContentCard from '@/components/ContentCard';
import AddContentModal from '@/components/AddContentModal';

const UserPanel = () => {
  const { currentUser, isAuthenticated, codeSnippets, testingTools, writeUps, ctfComponents } = useStore();
  const [activeTab, setActiveTab] = useState('snippets');
  const [modalOpen, setModalOpen] = useState<{
    isOpen: boolean,
    type: 'code' | 'tool' | 'writeup' | 'ctf',
    title: string
  }>({
    isOpen: false,
    type: 'code',
    title: ''
  });
  
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const userCodeSnippets = codeSnippets.filter(snippet => true);
  const userTestingTools = testingTools.filter(tool => true);
  const userWriteUps = writeUps.filter(writeUp => true);
  const userCTFComponents = ctfComponents.filter(component => true);

  const openModal = (type: 'code' | 'tool' | 'writeup' | 'ctf', title: string) => {
    setModalOpen({
      isOpen: true,
      type,
      title
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <p className="text-muted-foreground">Manage your content and resources</p>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="snippets">Code Snippets</TabsTrigger>
                <TabsTrigger value="tools">Testing Tools</TabsTrigger>
                <TabsTrigger value="writeups">Write-ups</TabsTrigger>
                <TabsTrigger value="ctf">CTF Components</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2">
                {activeTab === 'snippets' && (
                  <Button 
                    onClick={() => openModal('code', 'Add Code Snippet')}
                    className="flex items-center" 
                    size="sm"
                  >
                    <Plus size={16} className="mr-1" />
                    <span>Add Snippet</span>
                  </Button>
                )}
                
                {activeTab === 'tools' && (
                  <Button 
                    onClick={() => openModal('tool', 'Add Testing Tool')}
                    className="flex items-center" 
                    size="sm"
                  >
                    <Plus size={16} className="mr-1" />
                    <span>Add Tool</span>
                  </Button>
                )}
                
                {activeTab === 'writeups' && (
                  <Button 
                    onClick={() => openModal('writeup', 'Add Write-up')}
                    className="flex items-center" 
                    size="sm"
                  >
                    <Plus size={16} className="mr-1" />
                    <span>Add Write-up</span>
                  </Button>
                )}
                
                {activeTab === 'ctf' && (
                  <Button 
                    onClick={() => openModal('ctf', 'Add CTF Component')}
                    className="flex items-center" 
                    size="sm"
                  >
                    <Plus size={16} className="mr-1" />
                    <span>Add CTF</span>
                  </Button>
                )}
              </div>
            </div>
            
            <TabsContent value="snippets" className="pt-2">
              {userCodeSnippets.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <Code size={40} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Code Snippets</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any code snippets yet.
                  </p>
                  <Button 
                    onClick={() => openModal('code', 'Add Code Snippet')}
                    className="flex items-center mx-auto" 
                  >
                    <Plus size={16} className="mr-1" />
                    <span>Add Your First Snippet</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userCodeSnippets.map((snippet) => (
                    <CodeSnippetDisplay key={snippet.id} snippet={snippet} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tools" className="pt-2">
              {userTestingTools.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <Wrench size={40} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Testing Tools</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any testing tools yet.
                  </p>
                  <Button 
                    onClick={() => openModal('tool', 'Add Testing Tool')}
                    className="flex items-center mx-auto" 
                  >
                    <Plus size={16} className="mr-1" />
                    <span>Add Your First Tool</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userTestingTools.map((tool) => (
                    <TestingToolDisplay key={tool.id} tool={tool} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="writeups" className="pt-2">
              {userWriteUps.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No Write-ups</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any write-ups yet.
                  </p>
                  <Button 
                    onClick={() => openModal('writeup', 'Add Write-up')}
                    className="flex items-center mx-auto" 
                  >
                    <Plus size={16} className="mr-1" />
                    <span>Add Your First Write-up</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userWriteUps.map((writeUp) => (
                    <ContentCard key={writeUp.id} title={writeUp.title} isPublic={writeUp.isPublic}>
                      <a 
                        href={writeUp.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm inline-block mb-3"
                      >
                        {writeUp.url}
                      </a>
                      {writeUp.description && (
                        <p className="text-sm text-muted-foreground mb-3">{writeUp.description}</p>
                      )}
                    </ContentCard>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ctf" className="pt-2">
              {userCTFComponents.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No CTF Components</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any CTF components yet.
                  </p>
                  <Button 
                    onClick={() => openModal('ctf', 'Add CTF Component')}
                    className="flex items-center mx-auto" 
                  >
                    <Plus size={16} className="mr-1" />
                    <span>Add Your First CTF Component</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userCTFComponents.map((component) => (
                    <ContentCard key={component.id} title={component.title} isPublic={component.isPublic}>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Type:</span> {component.type}
                      </p>
                      <div className="bg-hacker-darkgray rounded-md p-3 mb-3 font-mono text-sm">
                        {component.content}
                      </div>
                    </ContentCard>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {modalOpen.type === 'code' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Code Snippet</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new code snippet.
              </DialogDescription>
            </DialogHeader>
            <AddCodeSnippet closeModal={() => setModalOpen({ ...modalOpen, isOpen: false })} />
          </DialogContent>
        </Dialog>
      )}

      {modalOpen.type === 'tool' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Testing Tool</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new testing tool.
              </DialogDescription>
            </DialogHeader>
            <AddTestingTool closeModal={() => setModalOpen({ ...modalOpen, isOpen: false })} />
          </DialogContent>
        </Dialog>
      )}

      {(modalOpen.type === 'writeup' || modalOpen.type === 'ctf') && (
        <AddContentModal
          open={modalOpen.isOpen}
          onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}
          type={modalOpen.type as 'writeup' | 'ctf' | 'youtube'}
          title={modalOpen.title}
        />
      )}
    </div>
  );
};

export default UserPanel;
