
import React from 'react';
import { useStore } from '@/lib/store';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, User, MessageSquare, ExternalLink, Code, Image } from 'lucide-react';
import ContentActions from '@/components/ContentActions';
import { cn } from '@/lib/utils';

const Forum = () => {
  const { posts, currentUser } = useStore();
  const navigate = useNavigate();
  
  // Only show top-level posts (not replies)
  const topLevelPosts = posts.filter(post => !post.parentId);
  
  // Get reply counts for each post
  const getReplyCount = (postId: string) => {
    return posts.filter(post => post.parentId === postId).length;
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
      
      {topLevelPosts.length === 0 ? (
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
          {topLevelPosts.map((post) => (
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
