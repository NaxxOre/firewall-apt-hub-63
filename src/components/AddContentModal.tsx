
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddCategoryContent from './AddCategoryContent';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddYouTubeChannel from './AddYouTubeChannel';
import AddCTFComponent from './AddCTFComponent';

interface AddContentModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  type: 'writeup' | 'youtube' | 'ctf';
  title?: string;
  closeModal?: () => void;
  onComplete?: () => void;
}

const AddContentModal = ({ 
  open, 
  onOpenChange, 
  type, 
  title = "Add Content", 
  closeModal, 
  onComplete
}: AddContentModalProps) => {
  const handleClose = () => {
    if (closeModal) closeModal();
    if (onComplete) onComplete();
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <>
      <ScrollArea className="max-h-[70vh] pr-4 overflow-y-auto">
        {type === 'writeup' && (
          <AddCategoryContent type="writeup" closeModal={handleClose} />
        )}
        {type === 'youtube' && (
          <AddYouTubeChannel closeModal={handleClose} />
        )}
        {type === 'ctf' && (
          <AddCTFComponent closeModal={handleClose} />
        )}
      </ScrollArea>
    </>
  );
};

export default AddContentModal;
