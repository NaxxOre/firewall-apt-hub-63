
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

const CreatePost = () => {
  const { currentUser, isAuthenticated, addPost } = useStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter content');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Regular users can only create public posts
      const isPublic = currentUser?.isAdmin ? true : true;
      
      addPost({
        title: title.trim(),
        content: content.trim(),
        isPublic,
      });
      
      toast.success('Post created successfully!');
      navigate('/forum');
    } catch (error) {
      toast.error('Failed to create post');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
        <p className="text-muted-foreground">
          Share knowledge, ask questions, or discuss topics with the community
        </p>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-hacker-darkgray border border-border rounded-md"
              placeholder="Enter post title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 bg-hacker-darkgray border border-border rounded-md min-h-[200px]"
              placeholder="Enter your post content"
              required
            ></textarea>
            <p className="text-xs text-muted-foreground mt-1">
              You can use markdown for formatting.
            </p>
          </div>
          
          {currentUser?.isAdmin && (
            <div className="mb-4">
              <p className="text-sm text-yellow-400">
                As an admin, you can set post visibility in the admin panel after creation.
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/forum')}
              className="mr-2 px-4 py-2 border border-border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
