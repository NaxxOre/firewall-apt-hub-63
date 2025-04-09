
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { Plus, X, Code, Link, Image } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CodeDisplayBox from '@/components/CodeDisplayBox';

interface CustomField {
  id: string;
  type: 'code' | 'link' | 'image';
  content: string;
}

const CreatePost = () => {
  const { currentUser, isAuthenticated, addPost } = useStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const addCustomField = (type: 'code' | 'link' | 'image') => {
    const newField: CustomField = {
      id: `field-${Date.now()}`,
      type,
      content: ''
    };
    setCustomFields([...customFields, newField]);
  };

  const updateCustomField = (id: string, content: string) => {
    setCustomFields(
      customFields.map(field => 
        field.id === id ? { ...field, content } : field
      )
    );
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

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
        customFields: customFields
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

  const renderCustomField = (field: CustomField) => {
    switch (field.type) {
      case 'code':
        return (
          <div className="mb-4 relative" key={field.id}>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <Code size={16} className="mr-2" /> Code Snippet
              <button 
                onClick={() => removeCustomField(field.id)}
                className="ml-auto text-red-500 hover:text-red-400"
                type="button"
              >
                <X size={16} />
              </button>
            </label>
            <Textarea
              value={field.content}
              onChange={(e) => updateCustomField(field.id, e.target.value)}
              className="font-mono text-sm min-h-[150px] bg-hacker-darkgray"
              placeholder="Enter your code snippet"
            />
            {field.content && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                <CodeDisplayBox content={field.content} maxHeight="200px" />
              </div>
            )}
          </div>
        );
      case 'link':
        return (
          <div className="mb-4 relative" key={field.id}>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <Link size={16} className="mr-2" /> URL Link
              <button 
                onClick={() => removeCustomField(field.id)}
                className="ml-auto text-red-500 hover:text-red-400"
                type="button"
              >
                <X size={16} />
              </button>
            </label>
            <input
              type="url"
              value={field.content}
              onChange={(e) => updateCustomField(field.id, e.target.value)}
              className="w-full p-2 bg-hacker-darkgray border border-border rounded-md"
              placeholder="https://example.com"
            />
            {field.content && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                <a 
                  href={field.content} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm inline-block"
                >
                  {field.content}
                </a>
              </div>
            )}
          </div>
        );
      case 'image':
        return (
          <div className="mb-4 relative" key={field.id}>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <Image size={16} className="mr-2" /> Image URL
              <button 
                onClick={() => removeCustomField(field.id)}
                className="ml-auto text-red-500 hover:text-red-400"
                type="button"
              >
                <X size={16} />
              </button>
            </label>
            <input
              type="url"
              value={field.content}
              onChange={(e) => updateCustomField(field.id, e.target.value)}
              className="w-full p-2 bg-hacker-darkgray border border-border rounded-md"
              placeholder="https://example.com/image.jpg"
            />
            {field.content && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                <div className="border border-border rounded-md overflow-hidden">
                  <img 
                    src={field.content} 
                    alt="User provided" 
                    className="max-w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.src = 'public/placeholder.svg';
                      e.currentTarget.alt = 'Image could not be loaded';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
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
        <ScrollArea className="pr-4" style={{ maxHeight: 'calc(100vh - 220px)' }}>
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
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 bg-hacker-darkgray border border-border rounded-md min-h-[200px]"
                placeholder="Enter your post content"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can use markdown for formatting.
              </p>
            </div>
            
            {customFields.length > 0 && (
              <div className="mb-6 border-t border-border pt-4 mt-4">
                <h3 className="text-sm font-medium mb-3">Custom Fields</h3>
                {customFields.map(field => renderCustomField(field))}
              </div>
            )}
            
            <div className="mb-6 border-t border-border pt-4 mt-4">
              <h3 className="text-sm font-medium mb-3">Add Custom Fields</h3>
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  onClick={() => addCustomField('code')} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                >
                  <Code size={16} className="mr-1" />
                  Code Snippet
                </Button>
                <Button 
                  type="button" 
                  onClick={() => addCustomField('link')} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                >
                  <Link size={16} className="mr-1" />
                  URL Link
                </Button>
                <Button 
                  type="button" 
                  onClick={() => addCustomField('image')} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                >
                  <Image size={16} className="mr-1" />
                  Image
                </Button>
              </div>
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
        </ScrollArea>
      </div>
    </div>
  );
};

export default CreatePost;
