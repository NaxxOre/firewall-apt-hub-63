
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ContentActions from '@/components/ContentActions';

const ManagePosts = () => {
  const { posts, currentUser } = useStore();
  const navigate = useNavigate();
  
  // Redirect non-admin users
  if (!currentUser?.isAdmin) {
    navigate('/admin');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/admin')}
          className="mr-2"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Manage Forum Posts</h1>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="public">Public Posts</TabsTrigger>
          <TabsTrigger value="private">Private Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="py-4">
          {posts.length === 0 ? (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-muted-foreground">No posts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {post.authorName} · {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ContentActions 
                      id={post.id} 
                      title={post.title} 
                      type="post" 
                      isPublic={post.isPublic} 
                    />
                  </div>
                  <p className="text-sm line-clamp-2">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="public" className="py-4">
          {posts.filter(post => post.isPublic).length === 0 ? (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-muted-foreground">No public posts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts
                .filter(post => post.isPublic)
                .map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          By {post.authorName} · {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ContentActions 
                        id={post.id} 
                        title={post.title} 
                        type="post" 
                        isPublic={post.isPublic} 
                      />
                    </div>
                    <p className="text-sm line-clamp-2">{post.content}</p>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="private" className="py-4">
          {posts.filter(post => !post.isPublic).length === 0 ? (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-muted-foreground">No private posts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts
                .filter(post => !post.isPublic)
                .map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          By {post.authorName} · {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ContentActions 
                        id={post.id} 
                        title={post.title} 
                        type="post" 
                        isPublic={post.isPublic} 
                      />
                    </div>
                    <p className="text-sm line-clamp-2">{post.content}</p>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagePosts;
