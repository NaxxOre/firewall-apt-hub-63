
import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, User, MessageSquare, ExternalLink, Code, Image } from 'lucide-react';
import ContentActions from '@/components/ContentActions';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Forum = () => {
  const { currentUser } = useStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .is('parent_id', null)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform posts to application format
        const formattedPosts = data?.map(post => ({
          ...post,
          isPublic: post.is_public,
          parentId: post.parent_id,
          codeSnippet: post.code_snippet,
          imageUrl: post.image_url,
          externalLink: post.external_link,
          authorId: post.author_id,
          createdAt: new Date(post.created_at)
        })) || [];
        
        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to load forum posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Get reply counts for each post
  const getReplyCount = async (postId: string) => {
    try {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', postId);
        
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error counting replies:', error);
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-8">
        <p>Loading forum posts...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Community Forum</h1>
        
        {currentUser && (
          <Button onClick={() => navigate('/forum/create')}>
            Create New Post
          </Button>
        )}
      </div>
      
      {posts.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-4">No posts yet. Be the first to create a post!</p>
          
          {currentUser ? (
            <Button onClick={() => navigate('/forum/create')}>
              Create New Post
            </Button>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-muted-foreground">You need to be logged in to create posts</p>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className={cn(
              "bg-card border border-border rounded-lg p-6",
              !post.is_public && !post.isPublic && "opacity-70"
            )}>
              <div className="flex justify-between items-start">
                <Link to={`/forum/post/${post.id}`} className="block hover:underline">
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                </Link>
                
                {currentUser && (currentUser.isAdmin || currentUser.id === post.author_id) && (
                  <ContentActions 
                    id={post.id}
                    title={post.title}
                    type="post"
                    isPublic={post.isPublic || post.is_public}
                  />
                )}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <User size={14} className="mr-1" />
                <span className="mr-4">{post.author_name || "Anonymous"}</span>
                <Calendar size={14} className="mr-1" />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              
              <p className="line-clamp-3 mb-4">{post.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {(post.image_url || post.imageUrl) && (
                  <div className="inline-flex items-center text-xs bg-secondary/50 px-2 py-1 rounded">
                    <Image size={12} className="mr-1" />
                    <span>Image</span>
                  </div>
                )}
                
                {(post.code_snippet || post.codeSnippet) && (
                  <div className="inline-flex items-center text-xs bg-secondary/50 px-2 py-1 rounded">
                    <Code size={12} className="mr-1" />
                    <span>Code</span>
                  </div>
                )}
                
                {(post.external_link || post.externalLink) && (
                  <div className="inline-flex items-center text-xs bg-secondary/50 px-2 py-1 rounded">
                    <ExternalLink size={12} className="mr-1" />
                    <span>Link</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare size={14} className="mr-1" />
                  <span>See replies</span>
                </div>
                
                <Link 
                  to={`/forum/post/${post.id}`} 
                  className="text-primary text-sm hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum;
