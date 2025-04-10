
import React from 'react';
import { useStore } from '@/lib/store';
import DeleteButton from './DeleteButton';
import VisibilityToggle from './VisibilityToggle';
import { CATEGORIES } from '@/lib/constants';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface ContentActionsProps {
  id: string;
  title: string;
  type: 'code' | 'writeup' | 'tool' | 'post' | 'youtube' | 'ctf';
  isPublic: boolean;
}

const getTableName = (type: string): string => {
  switch (type) {
    case 'code':
      return 'code_snippets';
    case 'writeup':
      return 'write_ups';
    case 'tool':
      return 'testing_tools';
    case 'post':
      return 'posts';
    case 'youtube':
      return 'youtube_channels';
    case 'ctf':
      return 'ctf_components';
    default:
      return '';
  }
};

const ContentActions: React.FC<ContentActionsProps> = ({ id, title, type, isPublic }) => {
  const { 
    deleteCodeSnippet, deleteWriteUp, deleteTestingTool, deletePost, 
    deleteCTFComponent, deleteYoutubeChannel, currentUser,
    updateCodeSnippetVisibility, updateWriteUpVisibility, updateTestingToolVisibility,
    updatePostVisibility, updateCTFComponentVisibility, updateYoutubeChannelVisibility
  } = useStore();
  
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
      const tableName = getTableName(type);
      if (!tableName) return;
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error(`Error deleting ${type}:`, error);
        toast.error(`Failed to delete: ${error.message}`);
        return;
      }
      
      // Also update local store for immediate UI update
      switch (type) {
        case 'code':
          deleteCodeSnippet(id);
          break;
        case 'writeup':
          deleteWriteUp(id);
          break;
        case 'tool':
          deleteTestingTool(id);
          break;
        case 'post':
          deletePost(id);
          break;
        case 'youtube':
          deleteYoutubeChannel(id);
          break;
        case 'ctf':
          deleteCTFComponent(id);
          break;
      }
      
      toast.success(`${type} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  const handleVisibilityChange = async (value: boolean) => {
    try {
      const tableName = getTableName(type);
      if (!tableName) return;
      
      const { error } = await supabase
        .from(tableName)
        .update({ is_public: value })
        .eq('id', id);
        
      if (error) {
        console.error(`Error updating ${type} visibility:`, error);
        toast.error(`Failed to update visibility: ${error.message}`);
        return;
      }
      
      // Also update local store for immediate UI update
      switch (type) {
        case 'code':
          updateCodeSnippetVisibility(id, value);
          break;
        case 'writeup':
          updateWriteUpVisibility(id, value);
          break;
        case 'tool':
          updateTestingToolVisibility(id, value);
          break;
        case 'post':
          updatePostVisibility(id, value);
          break;
        case 'youtube':
          updateYoutubeChannelVisibility(id, value);
          break;
        case 'ctf':
          updateCTFComponentVisibility(id, value);
          break;
      }
      
      toast.success(`Visibility updated successfully`);
    } catch (error) {
      console.error(`Error updating ${type} visibility:`, error);
      toast.error(`Failed to update visibility`);
    }
  };

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
        />
      )}
    </div>
  );
};

export default ContentActions;
