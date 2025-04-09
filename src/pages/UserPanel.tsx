
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  FileText, 
  Youtube, 
  Flag, 
  PlusCircle, 
  BookOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddContentModal from '@/components/AddContentModal';
import AddYouTubeChannel from '@/components/AddYouTubeChannel';
import AddCTFComponent from '@/components/AddCTFComponent';
import ContentCard from '@/components/ContentCard';
import ContentActions from '@/components/ContentActions';

const UserPanel = () => {
  const { 
    currentUser, 
    isAuthenticated,
    writeUps,
    youtubeChannels,
    ctfComponents
  } = useStore();
  
  const navigate = useNavigate();
  
  const [modalOpen, setModalOpen] = useState<{
    isOpen: boolean,
    type: 'writeup' | 'youtube' | 'ctf',
    title: string
  }>({
    isOpen: false,
    type: 'writeup',
    title: ''
  });
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Filter content belonging to the current user (for future implementation)
  const userWriteUps = writeUps;
  const userYoutubeChannels = youtubeChannels;
  const userCTFComponents = ctfComponents;

  const openModal = (type: 'writeup' | 'youtube' | 'ctf', title: string) => {
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
          <p className="text-muted-foreground">Manage your content and submissions</p>
        </div>

        <div className="p-6">
          <Tabs defaultValue="writeups" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <TabsList className="mb-4 md:mb-0 overflow-x-auto flex">
                <TabsTrigger value="writeups" className="px-3 py-2">
                  <FileText size={16} className="mr-2" />
                  Write-ups
                </TabsTrigger>
                <TabsTrigger value="youtube" className="px-3 py-2">
                  <Youtube size={16} className="mr-2" />
                  YouTube
                </TabsTrigger>
                <TabsTrigger value="ctf" className="px-3 py-2">
                  <Flag size={16} className="mr-2" />
                  CTF
                </TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => openModal('writeup', 'Add Write-up')}
                  variant="secondary"
                  className="flex items-center text-sm"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Add Write-up
                </Button>
              </div>
            </div>
            
            <TabsContent value="writeups">
              {userWriteUps.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Write-ups Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Share your knowledge by adding write-ups
                  </p>
                  <Button 
                    onClick={() => openModal('writeup', 'Add Write-up')}
                    variant="default"
                  >
                    Add Your First Write-up
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userWriteUps.map((writeUp) => (
                    <ContentCard 
                      key={writeUp.id} 
                      title={writeUp.title} 
                      isPublic={writeUp.isPublic}
                    >
                      <div className="flex flex-col">
                        <a 
                          href={writeUp.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm mb-2 truncate"
                        >
                          {writeUp.url}
                        </a>
                        {writeUp.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {writeUp.description}
                          </p>
                        )}
                        <div className="mt-auto pt-3 border-t border-border">
                          <ContentActions 
                            id={writeUp.id} 
                            title={writeUp.title} 
                            type="writeup" 
                            isPublic={writeUp.isPublic} 
                          />
                        </div>
                      </div>
                    </ContentCard>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="youtube">
              <div className="flex justify-end mb-4">
                <Button 
                  onClick={() => openModal('youtube', 'Add YouTube Channel')}
                  variant="secondary"
                  className="flex items-center text-sm"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Add YouTube Channel
                </Button>
              </div>
              
              {userYoutubeChannels.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg">
                  <Youtube className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No YouTube Channels</h3>
                  <p className="text-muted-foreground mb-4">
                    Share your favorite cybersecurity channels
                  </p>
                  <Button 
                    onClick={() => openModal('youtube', 'Add YouTube Channel')}
                    variant="default"
                  >
                    Add Your First Channel
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userYoutubeChannels.map((channel) => (
                    <ContentCard 
                      key={channel.id} 
                      title={channel.name} 
                      isPublic={channel.isPublic}
                    >
                      <div className="flex flex-col">
                        <a 
                          href={channel.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm mb-2 truncate"
                        >
                          {channel.url}
                        </a>
                        {channel.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {channel.description}
                          </p>
                        )}
                        <div className="mt-auto pt-3 border-t border-border">
                          <ContentActions 
                            id={channel.id} 
                            title={channel.name} 
                            type="youtube" 
                            isPublic={channel.isPublic} 
                          />
                        </div>
                      </div>
                    </ContentCard>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ctf">
              <div className="flex justify-end mb-4">
                <Button 
                  onClick={() => openModal('ctf', 'Add CTF Component')}
                  variant="secondary"
                  className="flex items-center text-sm"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Add CTF Component
                </Button>
              </div>
              
              {userCTFComponents.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg">
                  <Flag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No CTF Components</h3>
                  <p className="text-muted-foreground mb-4">
                    Add CTF links, team names, and passwords
                  </p>
                  <Button 
                    onClick={() => openModal('ctf', 'Add CTF Component')}
                    variant="default"
                  >
                    Add Your First CTF Component
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userCTFComponents.map((component) => (
                    <ContentCard 
                      key={component.id} 
                      title={component.title} 
                      isPublic={component.isPublic}
                    >
                      <div className="flex flex-col">
                        <div className="bg-hacker-darkgray p-3 rounded-md mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground capitalize">
                              {component.type}
                            </span>
                          </div>
                          <p className="font-mono text-sm break-all">
                            {component.content}
                          </p>
                        </div>
                        <div className="mt-auto pt-3 border-t border-border">
                          <ContentActions 
                            id={component.id} 
                            title={component.title} 
                            type="ctf" 
                            isPublic={component.isPublic} 
                          />
                        </div>
                      </div>
                    </ContentCard>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Content modals */}
      {modalOpen.type === 'writeup' && (
        <AddContentModal
          open={modalOpen.isOpen}
          onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}
          type="writeup"
          title={modalOpen.title}
        />
      )}

      {modalOpen.type === 'youtube' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add YouTube Channel</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new YouTube channel.
              </DialogDescription>
            </DialogHeader>
            <AddYouTubeChannel closeModal={() => setModalOpen({ ...modalOpen, isOpen: false })} />
          </DialogContent>
        </Dialog>
      )}

      {modalOpen.type === 'ctf' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add CTF Component</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new CTF component.
              </DialogDescription>
            </DialogHeader>
            <AddCTFComponent closeModal={() => setModalOpen({ ...modalOpen, isOpen: false })} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserPanel;
