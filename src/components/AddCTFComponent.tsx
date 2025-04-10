
import React from 'react';
import { useStore } from '@/lib/store';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddCTFComponentProps {
  closeModal?: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  link: z.string().url({ message: "Please enter a valid URL" }).or(z.string().length(0)),
  teamName: z.string().min(1, { message: "Team name is required" }).or(z.string().length(0)),
  password: z.string().min(1, { message: "Password is required" }).or(z.string().length(0)),
  isPublic: z.boolean().default(true),
});

const AddCTFComponent: React.FC<AddCTFComponentProps> = ({ closeModal }) => {
  const { addCTFComponent, currentUser } = useStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      link: '',
      teamName: '',
      password: '',
      isPublic: true,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      const isValid = values.link || values.teamName || values.password;
      
      if (!isValid) {
        toast.error('Please fill at least one field (Link, Team Name, or Password)');
        return;
      }

      // Add components based on filled fields
      const baseProps = {
        title: values.title,
        isPublic: currentUser?.isAdmin ? values.isPublic : true,
      };
      
      // Link component
      if (values.link) {
        addCTFComponent({
          ...baseProps,
          title: `${values.title}`,
          type: 'link',
          content: values.link,
        });
      }
      
      // Team name component
      if (values.teamName) {
        addCTFComponent({
          ...baseProps,
          title: `${values.title}`,
          type: 'teamName',
          content: values.teamName,
        });
      }
      
      // Password component
      if (values.password) {
        addCTFComponent({
          ...baseProps,
          title: `${values.title}`,
          type: 'password',
          content: values.password,
        });
      }
      
      toast.success('CTF components added successfully');
      form.reset();
      if (closeModal) closeModal();
    } catch (error) {
      console.error('Error adding CTF component:', error);
      toast.error('Failed to add component. Please try again.');
    }
  };

  return (
    <ScrollArea className="h-[65vh] pr-4">
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
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTF Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter CTF URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter team name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} />
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
          
          <Button type="submit" className="w-full">Add CTF Components</Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default AddCTFComponent;
