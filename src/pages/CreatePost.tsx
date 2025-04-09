
import React, { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Image, Link2, Code, Plus, X, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CodeDisplayBox from '@/components/CodeDisplayBox';

// Define form schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  codeSnippet: z.string().optional().or(z.literal('')),
  externalLink: z.array(z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal(''))),
  isPublic: z.boolean().default(true),
});

const CreatePost = () => {
  const { addPost, currentUser, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  // Initialize the form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: postId ? `Re: ` : '',
      content: '',
      codeSnippet: '',
      externalLink: [''],
      isPublic: true,
    },
  });
  
  const codeSnippet = form.watch('codeSnippet');
  const externalLinks = form.watch('externalLink');

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Create preview URLs for the new files
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...newFiles]);
      setImagePreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  // Add a new external link field
  const addLinkField = () => {
    const currentLinks = form.getValues('externalLink');
    form.setValue('externalLink', [...currentLinks, '']);
  };
  
  // Remove an external link field
  const removeLinkField = (index: number) => {
    const currentLinks = form.getValues('externalLink');
    form.setValue('externalLink', currentLinks.filter((_, i) => i !== index));
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      // Convert images to base64 strings for storage
      const imagePromises = images.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
      
      // Wait for all image conversions to complete
      Promise.all(imagePromises).then(imageDataUrls => {
        // Filter out empty links
        const filteredLinks = values.externalLink.filter(link => link && link.trim() !== '');
        
        addPost({
          title: values.title,
          content: values.content,
          isPublic: values.isPublic,
          imageUrls: imageDataUrls,
          codeSnippet: values.codeSnippet || undefined,
          externalLinks: filteredLinks.length > 0 ? filteredLinks : undefined,
          ...(postId ? { parentId: postId } : {}),
        });
        
        toast.success(postId ? 'Reply posted successfully' : 'Post created successfully');
        navigate(postId ? `/forum/post/${postId}` : '/forum');
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="container max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate(postId ? `/forum/post/${postId}` : '/forum')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{postId ? 'Reply to Post' : 'Create New Post'}</h1>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write your post content here..." 
                      className="min-h-[200px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="flex items-center gap-2">
                  <Image size={16} />
                  Images (optional)
                </FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} className="mr-2" />
                  Upload Images
                </Button>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={url} 
                        alt={`Preview ${index}`} 
                        className="w-full h-24 object-cover rounded-md border border-border"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* External Links Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="flex items-center gap-2">
                  <Link2 size={16} />
                  External Links (optional)
                </FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addLinkField}
                >
                  <Plus size={16} className="mr-2" />
                  Add Link
                </Button>
              </div>
              
              {externalLinks.map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`externalLink.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeLinkField(index)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Code Snippet Field */}
            <FormField
              control={form.control}
              name="codeSnippet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Code size={16} />
                    Code Snippet (optional)
                  </FormLabel>
                  <FormControl>
                    <div className="border rounded-md overflow-hidden">
                      <Textarea 
                        placeholder="// Add your code here" 
                        className="font-mono min-h-[150px] border-0" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    <div className="flex justify-between">
                      <span>Add code snippet to your post</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        type="button" 
                        onClick={() => setShowCodePreview(!showCodePreview)}
                        disabled={!codeSnippet}
                      >
                        {showCodePreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                    </div>
                  </FormDescription>
                  {showCodePreview && codeSnippet && (
                    <div className="mt-2">
                      <CodeDisplayBox content={codeSnippet} maxHeight="200px" />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(postId ? `/forum/post/${postId}` : '/forum')}
              >
                Cancel
              </Button>
              <Button type="submit">
                {postId ? 'Post Reply' : 'Create Post'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;
