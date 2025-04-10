
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'writeup' | 'youtube' | 'ctf';
  title: string;
}

const AddContentModal = ({ open, onOpenChange, type, title }: AddContentModalProps) => {
  const closeModal = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details below to add new content.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4 overflow-y-auto">
          {type === 'writeup' && (
            <AddCategoryContent type="writeup" closeModal={closeModal} />
          )}
          {type === 'youtube' && (
            <AddYouTubeChannel closeModal={closeModal} />
          )}
          {type === 'ctf' && (
            <AddCTFComponent closeModal={closeModal} />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddContentModal;
