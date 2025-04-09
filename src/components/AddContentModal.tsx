
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddCategoryContent from './AddCategoryContent';

interface AddContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'code' | 'writeup' | 'tool' | 'youtube' | 'ctf';
  title: string;
}

const AddContentModal = ({ open, onOpenChange, type, title }: AddContentModalProps) => {
  const closeModal = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details below to add new content.
          </DialogDescription>
        </DialogHeader>
        <AddCategoryContent type={type as 'code' | 'writeup' | 'tool'} closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
};

export default AddContentModal;
