
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ContentActions from '@/components/ContentActions';
import { ScrollArea } from '@/components/ui/scroll-area';

const ManagePosts = () => {
  const { 
    posts, 
    codeSnippets, 
    writeUps, 
    testingTools, 
    youtubeChannels, 
    ctfComponents,
    currentUser 
  } = useStore();
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
        <h1 className="text-2xl font-bold">Manage All Content</h1>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-4 overflow-x-auto flex w-full">
          <TabsTrigger value="posts">Forum Posts</TabsTrigger>
          <TabsTrigger value="code">Code Snippets</TabsTrigger>
          <TabsTrigger value="writeups">Write-ups</TabsTrigger>
          <TabsTrigger value="tools">Testing Tools</TabsTrigger>
          <TabsTrigger value="youtube">YouTube Channels</TabsTrigger>
          <TabsTrigger value="ctf">CTF Components</TabsTrigger>
        </TabsList>
        
        {/* Forum Posts */}
        <TabsContent value="posts" className="py-4">
          <ScrollArea className="h-[70vh]">
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
          </ScrollArea>
        </TabsContent>
        
        {/* Code Snippets */}
        <TabsContent value="code" className="py-4">
          <ScrollArea className="h-[70vh]">
            {codeSnippets.length === 0 ? (
              <div className="text-center p-6 border rounded-lg">
                <p className="text-muted-foreground">No code snippets found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {codeSnippets.map((snippet) => (
                  <div key={snippet.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{snippet.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(snippet.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ContentActions 
                        id={snippet.id} 
                        title={snippet.title} 
                        type="code" 
                        isPublic={snippet.isPublic} 
                      />
                    </div>
                    <div className="text-sm bg-hacker-darkgray p-3 rounded-md max-h-32 overflow-hidden">
                      <pre className="font-mono text-xs whitespace-pre-wrap">{snippet.content}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        {/* Write-ups */}
        <TabsContent value="writeups" className="py-4">
          <ScrollArea className="h-[70vh]">
            {writeUps.length === 0 ? (
              <div className="text-center p-6 border rounded-lg">
                <p className="text-muted-foreground">No write-ups found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {writeUps.map((writeUp) => (
                  <div key={writeUp.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{writeUp.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(writeUp.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ContentActions 
                        id={writeUp.id} 
                        title={writeUp.title} 
                        type="writeup" 
                        isPublic={writeUp.isPublic} 
                      />
                    </div>
                    <a 
                      href={writeUp.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center"
                    >
                      {writeUp.url}
                    </a>
                    {writeUp.description && (
                      <p className="text-sm mt-2">{writeUp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        {/* Testing Tools */}
        <TabsContent value="tools" className="py-4">
          <ScrollArea className="h-[70vh]">
            {testingTools.length === 0 ? (
              <div className="text-center p-6 border rounded-lg">
                <p className="text-muted-foreground">No testing tools found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {testingTools.map((tool) => (
                  <div key={tool.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{tool.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tool.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ContentActions 
                        id={tool.id} 
                        title={tool.title} 
                        type="tool" 
                        isPublic={tool.isPublic} 
                      />
                    </div>
                    <div className="text-sm bg-hacker-darkgray p-3 rounded-md max-h-32 overflow-hidden">
                      <pre className="font-mono text-xs whitespace-pre-wrap">{tool.content}</pre>
                    </div>
                    {tool.description && (
                      <p className="text-sm mt-2">{tool.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        {/* YouTube Channels */}
        <TabsContent value="youtube" className="py-4">
          <ScrollArea className="h-[70vh]">
            {youtubeChannels.length === 0 ? (
              <div className="text-center p-6 border rounded-lg">
                <p className="text-muted-foreground">No YouTube channels found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {youtubeChannels.map((channel) => (
                  <div key={channel.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{channel.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(channel.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ContentActions 
                        id={channel.id} 
                        title={channel.name} 
                        type="youtube" 
                        isPublic={channel.isPublic} 
                      />
                    </div>
                    <a 
                      href={channel.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center"
                    >
                      {channel.url}
                    </a>
                    {channel.description && (
                      <p className="text-sm mt-2">{channel.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        {/* CTF Components */}
        <TabsContent value="ctf" className="py-4">
          <ScrollArea className="h-[70vh]">
            {ctfComponents.length === 0 ? (
              <div className="text-center p-6 border rounded-lg">
                <p className="text-muted-foreground">No CTF components found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ctfComponents.map((component) => (
                  <div key={component.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{component.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {component.type} · {new Date(component.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ContentActions 
                        id={component.id} 
                        title={component.title} 
                        type="ctf" 
                        isPublic={component.isPublic} 
                      />
                    </div>
                    <div className="text-sm bg-hacker-darkgray p-3 rounded-md max-h-32 overflow-hidden">
                      <pre className="font-mono text-xs whitespace-pre-wrap">{component.content}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagePosts;
