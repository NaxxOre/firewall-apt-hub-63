
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Post, CodeSnippet, WriteUp, TestingTool, CTFComponent, YoutubeChannel } from '@/types';

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

// Code Snippets
export const fetchCodeSnippets = async () => {
  const { data, error } = await supabase
    .from('code_snippets')
    .select('*');
    
  if (error) {
    console.error('Error fetching code snippets:', error);
    toast.error('Failed to load code snippets');
    return [];
  }
  
  return data;
};

export const addCodeSnippetToDb = async (snippetData: Omit<CodeSnippet, 'id' | 'createdAt' | 'imageUrls' | 'externalLinks'>) => {
  const user = await getCurrentUser();
  
  if (!user) {
    toast.error('You must be logged in to add a code snippet');
    return null;
  }
  
  const { data, error } = await supabase
    .from('code_snippets')
    .insert({
      ...snippetData,
      author_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding code snippet:', error);
    toast.error('Failed to add code snippet');
    return null;
  }
  
  toast.success('Code snippet added successfully');
  return data;
};

export const deleteCodeSnippetFromDb = async (snippetId: string) => {
  const { error } = await supabase
    .from('code_snippets')
    .delete()
    .eq('id', snippetId);
    
  if (error) {
    console.error('Error deleting code snippet:', error);
    toast.error('Failed to delete code snippet');
    return false;
  }
  
  toast.success('Code snippet deleted successfully');
  return true;
};

export const updateCodeSnippetVisibility = async (snippetId: string, isPublic: boolean) => {
  const { error } = await supabase
    .from('code_snippets')
    .update({ is_public: isPublic })
    .eq('id', snippetId);
    
  if (error) {
    console.error('Error updating code snippet visibility:', error);
    toast.error('Failed to update visibility');
    return false;
  }
  
  return true;
};

// Testing Tools
export const fetchTestingTools = async () => {
  const { data, error } = await supabase
    .from('testing_tools')
    .select('*');
    
  if (error) {
    console.error('Error fetching testing tools:', error);
    toast.error('Failed to load testing tools');
    return [];
  }
  
  return data;
};

export const addTestingToolToDb = async (toolData: Omit<TestingTool, 'id' | 'createdAt' | 'imageUrls' | 'externalLinks'>) => {
  const user = await getCurrentUser();
  
  if (!user) {
    toast.error('You must be logged in to add a testing tool');
    return null;
  }
  
  const { data, error } = await supabase
    .from('testing_tools')
    .insert({
      ...toolData,
      author_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding testing tool:', error);
    toast.error('Failed to add testing tool');
    return null;
  }
  
  toast.success('Testing tool added successfully');
  return data;
};

export const deleteTestingToolFromDb = async (toolId: string) => {
  const { error } = await supabase
    .from('testing_tools')
    .delete()
    .eq('id', toolId);
    
  if (error) {
    console.error('Error deleting testing tool:', error);
    toast.error('Failed to delete testing tool');
    return false;
  }
  
  toast.success('Testing tool deleted successfully');
  return true;
};

export const updateTestingToolVisibility = async (toolId: string, isPublic: boolean) => {
  const { error } = await supabase
    .from('testing_tools')
    .update({ is_public: isPublic })
    .eq('id', toolId);
    
  if (error) {
    console.error('Error updating testing tool visibility:', error);
    toast.error('Failed to update visibility');
    return false;
  }
  
  return true;
};

// Write-ups
export const fetchWriteUps = async () => {
  const { data, error } = await supabase
    .from('write_ups')
    .select('*');
    
  if (error) {
    console.error('Error fetching write-ups:', error);
    toast.error('Failed to load write-ups');
    return [];
  }
  
  return data;
};

export const addWriteUpToDb = async (writeUpData: Omit<WriteUp, 'id' | 'createdAt' | 'imageUrls' | 'externalLinks'>) => {
  const user = await getCurrentUser();
  
  if (!user) {
    toast.error('You must be logged in to add a write-up');
    return null;
  }
  
  const { data, error } = await supabase
    .from('write_ups')
    .insert({
      ...writeUpData,
      author_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding write-up:', error);
    toast.error('Failed to add write-up');
    return null;
  }
  
  toast.success('Write-up added successfully');
  return data;
};

export const deleteWriteUpFromDb = async (writeUpId: string) => {
  const { error } = await supabase
    .from('write_ups')
    .delete()
    .eq('id', writeUpId);
    
  if (error) {
    console.error('Error deleting write-up:', error);
    toast.error('Failed to delete write-up');
    return false;
  }
  
  toast.success('Write-up deleted successfully');
  return true;
};

export const updateWriteUpVisibility = async (writeUpId: string, isPublic: boolean) => {
  const { error } = await supabase
    .from('write_ups')
    .update({ is_public: isPublic })
    .eq('id', writeUpId);
    
  if (error) {
    console.error('Error updating write-up visibility:', error);
    toast.error('Failed to update visibility');
    return false;
  }
  
  return true;
};

// CTF Components
export const fetchCTFComponents = async () => {
  const { data, error } = await supabase
    .from('ctf_components')
    .select('*');
    
  if (error) {
    console.error('Error fetching CTF components:', error);
    toast.error('Failed to load CTF components');
    return [];
  }
  
  return data;
};

export const addCTFComponentToDb = async (componentData: Omit<CTFComponent, 'id' | 'createdAt' | 'imageUrls' | 'externalLinks'>) => {
  const user = await getCurrentUser();
  
  if (!user) {
    toast.error('You must be logged in to add a CTF component');
    return null;
  }
  
  const { data, error } = await supabase
    .from('ctf_components')
    .insert({
      ...componentData,
      author_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding CTF component:', error);
    toast.error('Failed to add CTF component');
    return null;
  }
  
  toast.success('CTF component added successfully');
  return data;
};

export const deleteCTFComponentFromDb = async (componentId: string) => {
  const { error } = await supabase
    .from('ctf_components')
    .delete()
    .eq('id', componentId);
    
  if (error) {
    console.error('Error deleting CTF component:', error);
    toast.error('Failed to delete CTF component');
    return false;
  }
  
  toast.success('CTF component deleted successfully');
  return true;
};

export const updateCTFComponentVisibility = async (componentId: string, isPublic: boolean) => {
  const { error } = await supabase
    .from('ctf_components')
    .update({ is_public: isPublic })
    .eq('id', componentId);
    
  if (error) {
    console.error('Error updating CTF component visibility:', error);
    toast.error('Failed to update visibility');
    return false;
  }
  
  return true;
};

// YouTube Channels
export const fetchYoutubeChannels = async () => {
  const { data, error } = await supabase
    .from('youtube_channels')
    .select('*');
    
  if (error) {
    console.error('Error fetching YouTube channels:', error);
    toast.error('Failed to load YouTube channels');
    return [];
  }
  
  return data;
};

export const addYoutubeChannelToDb = async (channelData: Omit<YoutubeChannel, 'id' | 'createdAt' | 'imageUrls' | 'externalLinks'>) => {
  const user = await getCurrentUser();
  
  if (!user) {
    toast.error('You must be logged in to add a YouTube channel');
    return null;
  }
  
  const { data, error } = await supabase
    .from('youtube_channels')
    .insert({
      ...channelData,
      author_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding YouTube channel:', error);
    toast.error('Failed to add YouTube channel');
    return null;
  }
  
  toast.success('YouTube channel added successfully');
  return data;
};

export const deleteYoutubeChannelFromDb = async (channelId: string) => {
  const { error } = await supabase
    .from('youtube_channels')
    .delete()
    .eq('id', channelId);
    
  if (error) {
    console.error('Error deleting YouTube channel:', error);
    toast.error('Failed to delete YouTube channel');
    return false;
  }
  
  toast.success('YouTube channel deleted successfully');
  return true;
};

export const updateYoutubeChannelVisibility = async (channelId: string, isPublic: boolean) => {
  const { error } = await supabase
    .from('youtube_channels')
    .update({ is_public: isPublic })
    .eq('id', channelId);
    
  if (error) {
    console.error('Error updating YouTube channel visibility:', error);
    toast.error('Failed to update visibility');
    return false;
  }
  
  return true;
};

// Posts
export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*');
    
  if (error) {
    console.error('Error fetching posts:', error);
    toast.error('Failed to load posts');
    return [];
  }
  
  return data;
};

export const addPostToDb = async (postData: Omit<Post, 'id' | 'createdAt' | 'authorId' | 'authorName'>) => {
  const user = await getCurrentUser();
  
  if (!user) {
    toast.error('You must be logged in to add a post');
    return null;
  }
  
  // Get user profile to get username
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();
    
  const username = profiles?.username || user.email?.split('@')[0] || 'Anonymous';
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: postData.title,
      content: postData.content,
      is_public: postData.isPublic,
      parent_id: postData.parentId,
      code_snippet: postData.codeSnippet,
      image_url: postData.imageUrl,
      external_link: postData.externalLink,
      author_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding post:', error);
    toast.error('Failed to add post');
    return null;
  }
  
  toast.success('Post added successfully');
  return data;
};

export const deletePostFromDb = async (postId: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
    
  if (error) {
    console.error('Error deleting post:', error);
    toast.error('Failed to delete post');
    return false;
  }
  
  toast.success('Post deleted successfully');
  return true;
};

export const updatePostVisibility = async (postId: string, isPublic: boolean) => {
  const { error } = await supabase
    .from('posts')
    .update({ is_public: isPublic })
    .eq('id', postId);
    
  if (error) {
    console.error('Error updating post visibility:', error);
    toast.error('Failed to update visibility');
    return false;
  }
  
  return true;
};
