
import React from 'react';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/constants';
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

interface AddTestingToolProps {
  closeModal?: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  categoryId: z.string().min(1, { message: "Please select a category" }),
  code: z.string().min(1, { message: "Tool code is required" }),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
});

const AddTestingTool: React.FC<AddTestingToolProps> = ({ closeModal }) => {
  const { addTestingTool, currentUser } = useStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      code: '',
      description: '',
      isPublic: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      addTestingTool({
        title: values.title,
        code: values.code,
        content: values.code,
        categoryId: values.categoryId,
        description: values.description || '',
        isPublic: currentUser?.isAdmin ? values.isPublic : true,
      });
      
      toast.success('Testing tool added successfully');
      form.reset();
      if (closeModal) closeModal();
    } catch (error) {
      console.error('Error adding testing tool:', error);
      toast.error('Failed to add testing tool. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool Code</FormLabel>
              <FormControl>
                <div className="border rounded-md overflow-hidden">
                  <ScrollArea className="h-60 w-full">
                    <Textarea 
                      placeholder="Enter your testing tool code" 
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
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a description for your testing tool" 
                  {...field} 
                  className="min-h-[100px]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {currentUser?.isAdmin && (
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Visibility</FormLabel>
                  <FormDescription>
                    Make this testing tool visible to all users
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
        
        <Button type="submit" className="w-full">Add Testing Tool</Button>
      </form>
    </Form>
  );
};

export default AddTestingTool;
