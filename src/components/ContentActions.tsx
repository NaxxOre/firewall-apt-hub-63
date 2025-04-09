
import React from 'react';
import { useStore } from '@/lib/store';
import DeleteButton from './DeleteButton';
import VisibilityToggle from './VisibilityToggle';

interface ContentActionsProps {
  id: string;
  title: string;
  type: 'code' | 'writeup' | 'tool' | 'post' | 'youtube' | 'ctf';
  isPublic: boolean;
}

const ContentActions: React.FC<ContentActionsProps> = ({ id, title, type, isPublic }) => {
  const { 
    deleteCodeSnippet, deleteWriteUp, deleteTestingTool, deletePost, 
    deleteCTFComponent, deleteYoutubeChannel, currentUser,
    updateCodeSnippetVisibility, updateWriteUpVisibility, updateTestingToolVisibility,
    updatePostVisibility, updateCTFComponentVisibility, updateYoutubeChannelVisibility
  } = useStore();

  const handleDelete = (id: string) => {
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
  };

  const handleVisibilityChange = (value: boolean) => {
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
  };

  return (
    <div className="flex items-center space-x-2">
      <DeleteButton 
        id={id}
        title={title}
        type={type}
        onDelete={handleDelete}
      />
      
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
