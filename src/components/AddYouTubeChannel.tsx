
import React from 'react';
import { useStore } from '@/lib/store';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface AddYouTubeChannelProps {
  closeModal?: () => void;
}

const formSchema = z.object({
  name: z.string().min(3, { message: "Channel name must be at least 3 characters" }),
  url: z.string().url({ message: "Please enter a valid YouTube URL" }),
  description: z.string().optional(),
  thumbnailUrl: z.string().url({ message: "Please enter a valid thumbnail URL" }).optional().or(z.literal('')),
  isPublic: z.boolean().default(true),
});

const AddYouTubeChannel: React.FC<AddYouTubeChannelProps> = ({ closeModal }) => {
  const { addYoutubeChannel, currentUser } = useStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
      description: '',
      thumbnailUrl: '',
      isPublic: true,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      addYoutubeChannel({
        name: values.name,
        url: values.url,
        description: values.description || undefined,
        thumbnailUrl: values.thumbnailUrl || undefined,
        isPublic: currentUser?.isAdmin ? values.isPublic : true,
      });
      
      toast.success('YouTube channel added successfully');
      form.reset();
      if (closeModal) closeModal();
    } catch (error) {
      console.error('Error adding YouTube channel:', error);
      toast.error('Failed to add channel. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter channel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.youtube.com/c/channelname" {...field} />
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
                <Textarea placeholder="Enter channel description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
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
                    Make this channel visible to all users
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
        
        <Button type="submit" className="w-full">Add YouTube Channel</Button>
      </form>
    </Form>
  );
};

export default AddYouTubeChannel;
