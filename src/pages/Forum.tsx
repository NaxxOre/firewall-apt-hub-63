
import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, User, MessageSquare, ExternalLink, Code, Image } from 'lucide-react';
import ContentActions from '@/components/ContentActions';
import { cn } from '@/lib/utils';

const Forum = () => {
  const { posts: localPosts, currentUser } = useStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // First try to fetch from Supabase
        const { data, error } = await supabase
          .from('posts')
          .select('*, profiles:author_id(username)')
          .filter('parent_id', 'is', null)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching posts from Supabase:", error);
          // Fallback to local posts
          setPosts(localPosts.filter(post => !post.parentId));
        } else if (data && data.length > 0) {
          // Map Supabase data to our Post format
          const formattedPosts = data.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.author_id,
            authorName: post.profiles?.username || 'Unknown', // Get username from the joined profiles table
            isPublic: post.is_public,
            createdAt: new Date(post.created_at),
            parentId: post.parent_id,
            codeSnippet: post.code_snippet,
            imageUrl: post.image_url,
            imageUrls: post.image_urls || [],
            externalLink: post.external_link,
            externalLinks: post.external_links || []
          }));
          
          setPosts(formattedPosts);
          
          // Fetch reply counts for all posts at once
          fetchReplyCounts(data.map(post => post.id));
        } else {
          // If no posts in Supabase, use local posts
          setPosts(localPosts.filter(post => !post.parentId));
        }
      } catch (error) {
        console.error("Error in fetchPosts:", error);
        setPosts(localPosts.filter(post => !post.parentId));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [localPosts]);
  
  // Get reply counts for all posts at once
  const fetchReplyCounts = async (postIds: string[]) => {
    try {
      // For each post ID, we need to count the number of replies
      const counts: Record<string, number> = {};
      
      // Using Promise.all to fetch counts for all posts in parallel
      await Promise.all(
        postIds.map(async (postId) => {
          const { data, error, count } = await supabase
            .from('posts')
            .select('id', { count: 'exact' })
            .eq('parent_id', postId);
          
          if (error) {
            console.error(`Error fetching reply count for post ${postId}:`, error);
            counts[postId] = localPosts.filter(post => post.parentId === postId).length;
          } else {
            counts[postId] = count || 0;
          }
        })
      );
      
      setReplyCounts(counts);
    } catch (error) {
      console.error("Error in fetchReplyCounts:", error);
    }
  };
  
  // Get reply count for a specific post
  const getReplyCount = (postId: string) => {
    return replyCounts[postId] || 0;
  };

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
      
      {loading ? (
        <div className="text-center py-10">
          <p>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
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
              !post.isPublic && "opacity-70"
            )}>
              <div className="flex justify-between items-start">
                <Link to={`/forum/post/${post.id}`} className="block hover:underline">
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                </Link>
                
                {currentUser && (currentUser.isAdmin || currentUser.id === post.authorId) && (
                  <ContentActions 
                    id={post.id}
                    title={post.title}
                    type="post"
                    isPublic={post.isPublic}
                  />
                )}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <User size={14} className="mr-1" />
                <span className="mr-4">{post.authorName}</span>
                <Calendar size={14} className="mr-1" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              
              <p className="line-clamp-3 mb-4">{post.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.imageUrl && (
                  <div className="inline-flex items-center text-xs bg-secondary/50 px-2 py-1 rounded">
                    <Image size={12} className="mr-1" />
                    <span>Image</span>
                  </div>
                )}
                
                {post.codeSnippet && (
                  <div className="inline-flex items-center text-xs bg-secondary/50 px-2 py-1 rounded">
                    <Code size={12} className="mr-1" />
                    <span>Code</span>
                  </div>
                )}
                
                {post.externalLink && (
                  <div className="inline-flex items-center text-xs bg-secondary/50 px-2 py-1 rounded">
                    <ExternalLink size={12} className="mr-1" />
                    <span>Link</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare size={14} className="mr-1" />
                  <span>{getReplyCount(post.id)} replies</span>
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
