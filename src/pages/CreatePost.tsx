
import React, { useState } from 'react';
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
import { ArrowLeft, Image, Link2, Code } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CodeDisplayBox from '@/components/CodeDisplayBox';

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }).optional().or(z.literal('')),
  codeSnippet: z.string().optional().or(z.literal('')),
  externalLink: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  isPublic: z.boolean().default(true),
});

const CreatePost = () => {
  const { addPost, currentUser, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  
  const [showCodePreview, setShowCodePreview] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: postId ? `Re: ` : '',
      content: '',
      imageUrl: '',
      codeSnippet: '',
      externalLink: '',
      isPublic: true,
    },
  });
  
  const codeSnippet = form.watch('codeSnippet');

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      addPost({
        title: values.title,
        content: values.content,
        isPublic: values.isPublic,
        imageUrl: values.imageUrl || undefined,
        codeSnippet: values.codeSnippet || undefined,
        externalLink: values.externalLink || undefined,
        ...(postId ? { parentId: postId } : {}),
      });
      
      toast.success(postId ? 'Reply posted successfully' : 'Post created successfully');
      navigate(postId ? `/forum/post/${postId}` : '/forum');
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image URL Field */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Image size={16} />
                      Image URL (optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add an image to your post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* External Link Field */}
              <FormField
                control={form.control}
                name="externalLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Link2 size={16} />
                      External Link (optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add a reference link
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
