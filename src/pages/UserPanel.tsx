
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  FolderOpen,
  Code,
  FileText,
  Wrench,
  Youtube,
  Flag,
  MessageSquare,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddContentModal from '@/components/AddContentModal';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddYouTubeChannel from '@/components/AddYouTubeChannel';
import AddCTFComponent from '@/components/AddCTFComponent';
import { ScrollArea } from '@/components/ui/scroll-area';

const UserPanel = () => {
  const { currentUser, isAuthenticated } = useStore();
  const navigate = useNavigate();
  
  const [modalOpen, setModalOpen] = useState<{
    isOpen: boolean,
    type: 'code' | 'writeup' | 'tool' | 'youtube' | 'ctf',
    title: string
  }>({
    isOpen: false,
    type: 'code',
    title: ''
  });

  // Redirect if not authenticated
  if (!isAuthenticated || !currentUser) {
    navigate('/login');
    return null;
  }
  
  // Redirect admins to admin panel
  if (currentUser?.isAdmin) {
    navigate('/admin');
    return null;
  }

  const openModal = (type: 'code' | 'writeup' | 'tool' | 'youtube' | 'ctf', title: string) => {
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
          <p className="text-muted-foreground">Create and manage your content</p>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Content Creation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
              onClick={() => openModal('code', 'Add Code Snippet')}
            >
              <div className="flex items-center mb-2">
                <Code size={18} className="mr-2 text-primary" />
                <h3 className="font-medium">Add Code Snippet</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add code snippets to categories
              </p>
            </div>
            
            <div 
              className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
              onClick={() => openModal('writeup', 'Add Write-up')}
            >
              <div className="flex items-center mb-2">
                <FileText size={18} className="mr-2 text-primary" />
                <h3 className="font-medium">Add Write-up</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add write-ups with external links
              </p>
            </div>
            
            <div 
              className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
              onClick={() => openModal('tool', 'Add Testing Tool')}
            >
              <div className="flex items-center mb-2">
                <Wrench size={18} className="mr-2 text-primary" />
                <h3 className="font-medium">Add Testing Tool</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add testing tools to categories
              </p>
            </div>
            
            <div 
              className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
              onClick={() => openModal('youtube', 'Add YouTube Channel')}
            >
              <div className="flex items-center mb-2">
                <Youtube size={18} className="mr-2 text-primary" />
                <h3 className="font-medium">Add YouTube Channel</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add YouTube channel listings
              </p>
            </div>
            
            <div 
              className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
              onClick={() => openModal('ctf', 'Add CTF Component')}
            >
              <div className="flex items-center mb-2">
                <Flag size={18} className="mr-2 text-primary" />
                <h3 className="font-medium">Add CTF Component</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add links, team names, and passwords for CTF
              </p>
            </div>
            
            <div 
              className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
              onClick={() => navigate('/forum/create')}
            >
              <div className="flex items-center mb-2">
                <MessageSquare size={18} className="mr-2 text-primary" />
                <h3 className="font-medium">Create Forum Post</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create new posts on the forum
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content modals */}
      {modalOpen.type !== 'youtube' && modalOpen.type !== 'ctf' && (
        <AddContentModal
          open={modalOpen.isOpen}
          onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}
          type={modalOpen.type}
          title={modalOpen.title}
        />
      )}

      {modalOpen.type === 'youtube' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add YouTube Channel</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new YouTube channel.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <AddYouTubeChannel closeModal={() => setModalOpen({ ...modalOpen, isOpen: false })} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {modalOpen.type === 'ctf' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add CTF Component</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new CTF component.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <AddCTFComponent closeModal={() => setModalOpen({ ...modalOpen, isOpen: false })} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserPanel;
