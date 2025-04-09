
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, MessageSquare, ExternalLink, Code, Image } from 'lucide-react';
import ContentActions from '@/components/ContentActions';
import { cn } from '@/lib/utils';
import CodeDisplayBox from '@/components/CodeDisplayBox';

const PostDetail = () => {
  const { posts, currentUser } = useStore();
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  const post = posts.find(p => p.id === postId);
  
  // Get replies to this post
  const replies = posts.filter(p => p.parentId === postId);
  
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
        <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/forum')}>
          Return to Forum
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate('/forum')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Forum
        </Button>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          
          {currentUser && (currentUser.isAdmin || currentUser.id === post.authorId) && (
            <ContentActions 
              id={post.id}
              title={post.title}
              type="post"
              isPublic={post.isPublic}
            />
          )}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <User size={14} className="mr-1" />
          <span className="mr-4">{post.authorName}</span>
          <Calendar size={14} className="mr-1" />
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-line">{post.content}</p>
          
          {/* Display image if available */}
          {post.imageUrl && (
            <div className="my-6">
              <div className="flex items-center mb-2 text-sm text-muted-foreground">
                <Image size={14} className="mr-1" />
                <span>Attached Image</span>
              </div>
              <img 
                src={post.imageUrl} 
                alt="Post attachment" 
                className="max-w-full rounded-md border border-border max-h-[400px] object-contain bg-black"
              />
            </div>
          )}
          
          {/* Display code snippet if available */}
          {post.codeSnippet && (
            <div className="my-6">
              <div className="flex items-center mb-2 text-sm text-muted-foreground">
                <Code size={14} className="mr-1" />
                <span>Code Snippet</span>
              </div>
              <CodeDisplayBox content={post.codeSnippet} />
            </div>
          )}
          
          {/* Display external link if available */}
          {post.externalLink && (
            <div className="my-6 flex items-center">
              <a 
                href={post.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:underline"
              >
                <ExternalLink size={14} className="mr-1" />
                <span className="break-all">{post.externalLink}</span>
              </a>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Replies {replies.length > 0 && `(${replies.length})`}</h2>
        
        {currentUser && (
          <Button 
            onClick={() => navigate(`/forum/create/${postId}`)}
            className="flex items-center"
          >
            <MessageSquare size={16} className="mr-2" />
            Reply to Post
          </Button>
        )}
      </div>
      
      {replies.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No replies yet. Be the first to reply!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className={cn(
              "bg-card border border-border rounded-lg p-6",
              !reply.isPublic && "opacity-70"
            )}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{reply.title}</h3>
                
                {currentUser && (currentUser.isAdmin || currentUser.id === reply.authorId) && (
                  <ContentActions 
                    id={reply.id}
                    title={reply.title}
                    type="post"
                    isPublic={reply.isPublic}
                  />
                )}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <User size={14} className="mr-1" />
                <span className="mr-4">{reply.authorName}</span>
                <Calendar size={14} className="mr-1" />
                <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-line">{reply.content}</p>
                
                {/* Display image if available */}
                {reply.imageUrl && (
                  <div className="my-4">
                    <img 
                      src={reply.imageUrl} 
                      alt="Reply attachment" 
                      className="max-w-full rounded-md border border-border max-h-[300px] object-contain bg-black" 
                    />
                  </div>
                )}
                
                {/* Display code snippet if available */}
                {reply.codeSnippet && (
                  <div className="my-4">
                    <CodeDisplayBox content={reply.codeSnippet} maxHeight="200px" />
                  </div>
                )}
                
                {/* Display external link if available */}
                {reply.externalLink && (
                  <div className="my-4">
                    <a 
                      href={reply.externalLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      <span className="break-all">{reply.externalLink}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDetail;
