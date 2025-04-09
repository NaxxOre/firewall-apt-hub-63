
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { ArrowLeft, Calendar, User, Lock } from 'lucide-react';

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const { posts, currentUser, isAuthenticated } = useStore();
  const navigate = useNavigate();
  
  const post = posts.find(p => p.id === postId);
  
  // Check if user can view this post
  const canViewPost = () => {
    if (!post) return false;
    if (post.isPublic) return true;
    if (!isAuthenticated) return false;
    if (currentUser?.isAdmin) return true;
    return false;
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
        
        <div className="p-6">
          <div className="prose prose-invert max-w-none">
            {/* This is a simple implementation - for production, use a markdown renderer */}
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
