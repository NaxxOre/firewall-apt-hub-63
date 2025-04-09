
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { MessageSquare, Plus, Lock, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Forum = () => {
  const { posts, currentUser, isAuthenticated } = useStore();
  
  // Get visible posts based on user status
  const visiblePosts = posts.filter(post => {
    if (!isAuthenticated) return post.isPublic;
    if (currentUser?.isAdmin) return true;
    return post.isPublic;
  });

  // Sort posts by creation date (newest first)
  const sortedPosts = [...visiblePosts].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-muted-foreground">
            Discussions, questions, and sharing knowledge with the community
          </p>
        </div>
        {isAuthenticated && (
          <Link
            to="/forum/create"
            className="flex items-center bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md"
          >
            <Plus size={18} className="mr-2" />
            New Post
          </Link>
        )}
      </div>

      {!isAuthenticated && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8 flex items-center">
          <Lock className="mr-3 text-primary" />
          <div>
            <h3 className="font-medium mb-1">Limited Access</h3>
            <p className="text-sm text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">Log in</Link> to create posts and see all content.
            </p>
          </div>
        </div>
      )}

      {sortedPosts.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <MessageSquare className="mx-auto mb-3" size={32} />
          <h3 className="font-medium mb-1">No Posts Yet</h3>
          <p className="text-sm text-muted-foreground">
            Be the first to create a post in this forum.
          </p>
          {!isAuthenticated && (
            <Link to="/login" className="text-primary hover:underline block mt-2">
              Log in to create a post
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/forum/post/${post.id}`} 
              className="block bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="font-medium text-lg">{post.title}</h3>
                {currentUser?.isAdmin && !post.isPublic && (
                  <span className="inline-flex items-center bg-yellow-900/20 text-yellow-400 text-xs px-2 py-1 rounded-md">
                    Private
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {post.content.substring(0, 150)}
                {post.content.length > 150 ? '...' : ''}
              </p>
              
              <div className="flex items-center text-xs text-muted-foreground">
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum;
