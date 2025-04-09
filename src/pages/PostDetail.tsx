
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { ArrowLeft, Calendar, User, Lock, MessageCircle, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import CodeDisplayBox from '@/components/CodeDisplayBox';

interface Reply {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const { posts, currentUser, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState<Reply[]>([]);
  
  const post = posts.find(p => p.id === postId);
  
  // Check if user can view this post
  const canViewPost = () => {
    if (!post) return false;
    if (post.isPublic) return true;
    if (!isAuthenticated) return false;
    if (currentUser?.isAdmin) return true;
    return false;
  };

  const handleAddReply = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to reply');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      content: replyContent.trim(),
      authorName: currentUser?.username || 'Anonymous',
      createdAt: new Date().toISOString()
    };

    setReplies([...replies, newReply]);
    setReplyContent('');
    toast.success('Reply added successfully');
  };

  const renderCustomField = (field: any) => {
    switch (field.type) {
      case 'code':
        return (
          <div className="mb-4" key={field.id}>
            <h4 className="text-sm font-medium mb-2">Code Snippet</h4>
            <CodeDisplayBox content={field.content} maxHeight="300px" />
          </div>
        );
      case 'link':
        return (
          <div className="mb-4" key={field.id}>
            <h4 className="text-sm font-medium mb-2">Link</h4>
            <a 
              href={field.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm inline-block"
            >
              {field.content}
            </a>
          </div>
        );
      case 'image':
        return (
          <div className="mb-4" key={field.id}>
            <h4 className="text-sm font-medium mb-2">Image</h4>
            <div className="border border-border rounded-md overflow-hidden">
              <img 
                src={field.content} 
                alt="User provided" 
                className="max-w-full h-auto"
                onError={(e) => {
                  e.currentTarget.src = 'public/placeholder.svg';
                  e.currentTarget.alt = 'Image could not be loaded';
                }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Post Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/forum')}
            className="inline-flex items-center text-primary hover:underline"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Forum
          </button>
        </div>
      </div>
    );
  }
  
  if (!canViewPost()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <Lock className="mx-auto mb-2" size={24} />
          <h2 className="text-xl font-bold mb-2">Private Content</h2>
          <p className="text-muted-foreground mb-4">
            You don't have permission to view this post.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/forum')}
              className="inline-flex items-center text-primary hover:underline"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Forum
            </button>
            {!isAuthenticated && (
              <Link 
                to="/login" 
                className="text-primary hover:underline"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/forum')}
        className="mb-6 inline-flex items-center text-primary hover:underline"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Forum
      </button>
      
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="border-b border-border p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            {!post.isPublic && currentUser?.isAdmin && (
              <span className="inline-flex items-center bg-yellow-900/20 text-yellow-400 text-xs px-2 py-1 rounded-md">
                Private
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="flex items-center mr-4">
              <User size={14} className="mr-1" />
              <span>{post.authorName}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <ScrollArea className="px-6" style={{ maxHeight: '400px' }}>
          <div className="py-6">
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
            
            {post.customFields && post.customFields.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-4">Attachments & Resources</h3>
                {post.customFields.map((field: any) => renderCustomField(field))}
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t border-border p-6">
          <h2 className="flex items-center text-xl font-bold mb-4">
            <MessageCircle className="mr-2" size={20} />
            Replies
          </h2>
          
          {replies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No replies yet. Be the first to reply!
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {replies.map(reply => (
                <div key={reply.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center text-sm">
                      <User size={14} className="mr-1" />
                      <span className="font-medium">{reply.authorName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
          
          {isAuthenticated ? (
            <div className="mt-4">
              <div className="mb-2">
                <label htmlFor="reply" className="block text-sm font-medium mb-1">
                  Add a reply
                </label>
                <Textarea
                  id="reply"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply here..."
                  className="w-full p-2 bg-hacker-darkgray border border-border rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddReply}
                  className="flex items-center"
                >
                  <Send size={16} className="mr-1" />
                  Post Reply
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-hacker-darkgray border border-border rounded-lg p-4 text-center">
              <p className="text-sm mb-2">You need to be logged in to reply.</p>
              <Link 
                to="/login" 
                className="text-primary hover:underline text-sm"
              >
                Login to join the conversation
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
