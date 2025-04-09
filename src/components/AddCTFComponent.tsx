
import React from 'react';
import { useStore } from '@/lib/store';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddCTFComponentProps {
  closeModal?: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  type: z.enum(['link', 'teamName', 'password']),
  content: z.string().min(1, { message: "Content is required" }),
  isPublic: z.boolean().default(true),
});

const AddCTFComponent: React.FC<AddCTFComponentProps> = ({ closeModal }) => {
  const { addCTFComponent, currentUser } = useStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'link',
      content: '',
      isPublic: true,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      addCTFComponent({
        title: values.title,
        type: values.type,
        content: values.content,
        isPublic: currentUser?.isAdmin ? values.isPublic : true,
      });
      
      toast.success('CTF component added successfully');
      form.reset();
      if (closeModal) closeModal();
    } catch (error) {
      console.error('Error adding CTF component:', error);
      toast.error('Failed to add component. Please try again.');
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
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Component Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select component type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="teamName">Team Name</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                </SelectContent>
              </Select>
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
                <Input 
                  placeholder={
                    form.watch('type') === 'link' 
                      ? "Enter URL" 
                      : form.watch('type') === 'teamName' 
                        ? "Enter team name" 
                        : "Enter password"
                  } 
                  type={form.watch('type') === 'password' ? "password" : "text"}
                  {...field} 
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
                    Make this component visible to all users
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
        
        <Button type="submit" className="w-full">Add CTF Component</Button>
      </form>
    </Form>
  );
};

export default AddCTFComponent;
