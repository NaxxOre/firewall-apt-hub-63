
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { CATEGORIES, CATEGORY_SECTIONS } from '@/lib/constants';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddCategoryContentProps {
  type?: 'code' | 'writeup' | 'tool';
  closeModal?: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  categoryId: z.string().min(1, { message: "Please select a category" }),
  contentType: z.enum(['code', 'writeup', 'tool']),
  code: z.string().optional(),
  link: z.string().url({ message: "Please enter a valid URL" }).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
});

const AddCategoryContent: React.FC<AddCategoryContentProps> = ({ type = 'code', closeModal }) => {
  const { addCodeSnippet, addWriteUp, addTestingTool, currentUser } = useStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      contentType: type,
      code: '',
      link: '',
      description: '',
      isPublic: true,
    },
  });

  const contentType = form.watch('contentType');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      if (contentType === 'code') {
        if (!values.code || values.code.trim() === '') {
          toast.error('Code is required for code snippets');
          return;
        }
        
        addCodeSnippet({
          title: values.title,
          code: values.code,
          content: values.code,
          categoryId: values.categoryId,
          isPublic: currentUser?.isAdmin ? values.isPublic : true,
        });
        
        toast.success('Code snippet added successfully');
      } else if (contentType === 'writeup') {
        if (!values.link) {
          toast.error('Link is required for write-ups');
          return;
        }
        
        addWriteUp({
          title: values.title,
          link: values.link,
          url: values.link,
          description: values.description || '',
          categoryId: values.categoryId,
          isPublic: currentUser?.isAdmin ? values.isPublic : true,
        });
        
        toast.success('Write-up added successfully');
      } else if (contentType === 'tool') {
        if (!values.code || values.code.trim() === '') {
          toast.error('Code is required for testing tools');
          return;
        }
        
        addTestingTool({
          title: values.title,
          code: values.code,
          content: values.code,
          description: values.description || '',
          categoryId: values.categoryId,
          isPublic: currentUser?.isAdmin ? values.isPublic : true,
        });
        
        toast.success('Testing tool added successfully');
      }
      
      form.reset();
      if (closeModal) closeModal();
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('Failed to add content. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="contentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset form values when content type changes
                  if (value === 'code' || value === 'tool') {
                    form.setValue('link', '');
                  } else if (value === 'writeup') {
                    form.setValue('code', '');
                  }
                }}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="code">Code Snippet</SelectItem>
                  <SelectItem value="writeup">Write-up</SelectItem>
                  <SelectItem value="tool">Testing Tool</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {(contentType === 'code' || contentType === 'tool') && (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{contentType === 'code' ? 'Code' : 'Tool Code'}</FormLabel>
                <FormControl>
                  <div className="border rounded-md overflow-hidden">
                    <ScrollArea className="h-60 w-full">
                      <Textarea 
                        placeholder={contentType === 'code' ? "Enter code snippet" : "Enter tool code"} 
                        {...field} 
                        className="min-h-[240px] font-mono border-0 resize-none w-full" 
                      />
                    </ScrollArea>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {contentType === 'writeup' && (
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter URL to write-up" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {(contentType === 'writeup' || contentType === 'tool') && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <div className="border rounded-md overflow-hidden">
                    <ScrollArea className="h-32 w-full">
                      <Textarea 
                        placeholder="Enter a description" 
                        {...field} 
                        className="min-h-[120px] border-0 resize-none w-full" 
                      />
                    </ScrollArea>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {currentUser?.isAdmin && (
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Visibility</FormLabel>
                  <FormDescription>
                    Make this content visible to all users
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit" className="w-full">Add Content</Button>
      </form>
    </Form>
  );
};

export default AddCategoryContent;
