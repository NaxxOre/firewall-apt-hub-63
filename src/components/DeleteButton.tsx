
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface DeleteButtonProps {
  id: string;
  title: string;
  type: 'code' | 'writeup' | 'tool' | 'post' | 'youtube' | 'ctf';
  onDelete: (id: string) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ id, title, type, onDelete }) => {
  const handleDelete = () => {
    onDelete(id);
    toast.success(`${getTypeLabel(type)} deleted successfully`);
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'code': return 'Code snippet';
      case 'writeup': return 'Write-up';
      case 'tool': return 'Testing tool';
      case 'post': return 'Post';
      case 'youtube': return 'YouTube channel';
      case 'ctf': return 'CTF component';
      default: return 'Item';
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full"
          title={`Delete ${getTypeLabel(type)}`}
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{title}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
