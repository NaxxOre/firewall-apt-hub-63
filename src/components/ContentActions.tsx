
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import DeleteButton from './DeleteButton';
import VisibilityToggle from './VisibilityToggle';
import { CATEGORIES } from '@/lib/constants';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentActionsProps {
  id: string;
  title: string;
  type: 'code' | 'writeup' | 'tool' | 'post' | 'youtube' | 'ctf';
  isPublic: boolean;
}

const ContentActions: React.FC<ContentActionsProps> = ({ id, title, type, isPublic }) => {
  const { currentUser } = useStore();
  const [updating, setUpdating] = useState(false);
  const { categoryId = '' } = useParams<{ categoryId: string }>();
  
  // The main category slugs that should not have delete buttons
  const protectedCategories = [
    'cryptography', 'web-security', 'reverse-engineering', 
    'forensics', 'binary-exploitation', 'pwn'
  ];
  
  // Check if we're in a category page and if it's a protected category
  const isProtectedCategory = categoryId && protectedCategories.includes(categoryId);

  const handleDelete = async (id: string) => {
    try {
      let table = '';
      
      switch (type) {
        case 'code':
          table = 'code_snippets';
          break;
        case 'writeup':
          table = 'write_ups';
          break;
        case 'tool':
          table = 'testing_tools';
          break;
        case 'post':
          table = 'posts';
          break;
        case 'youtube':
          table = 'youtube_channels';
          break;
        case 'ctf':
          table = 'ctf_components';
          break;
      }
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`${getTypeLabel(type)} deleted successfully`);
      
      // Refresh the page to reflect the deletion
      window.location.reload();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${getTypeLabel(type).toLowerCase()}`);
    }
  };

  const handleVisibilityChange = async (value: boolean) => {
    try {
      setUpdating(true);
      let table = '';
      
      switch (type) {
        case 'code':
          table = 'code_snippets';
          break;
        case 'writeup':
          table = 'write_ups';
          break;
        case 'tool':
          table = 'testing_tools';
          break;
        case 'post':
          table = 'posts';
          break;
        case 'youtube':
          table = 'youtube_channels';
          break;
        case 'ctf':
          table = 'ctf_components';
          break;
      }
      
      const { error } = await supabase
        .from(table)
        .update({ is_public: value })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success(`Visibility updated successfully`);
    } catch (error) {
      console.error(`Error updating ${type} visibility:`, error);
      toast.error('Failed to update visibility');
    } finally {
      setUpdating(false);
    }
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

  // Check if the user is authenticated before showing any actions
  const session = supabase.auth.getSession();
  const isAuthenticated = !!session;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Only show delete button if not in a protected category or if it's not a category page */}
      {(!isProtectedCategory || !categoryId) && (
        <DeleteButton 
          id={id}
          title={title}
          type={type}
          onDelete={handleDelete}
        />
      )}
      
      {currentUser?.isAdmin && (
        <VisibilityToggle 
          isPublic={isPublic} 
          onChange={handleVisibilityChange} 
          disabled={updating}
        />
      )}
    </div>
  );
};

export default ContentActions;
