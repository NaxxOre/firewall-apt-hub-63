
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Copy, Flag, Key, Lock, Users } from 'lucide-react';
import { toast } from 'sonner';

const CTF = () => {
  const { currentUser, isAuthenticated, ctfComponents } = useStore();
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  // Get visible CTF components based on user status
  const visibleComponents = ctfComponents.filter(component => {
    if (!isAuthenticated) return component.isPublic;
    if (currentUser?.isAdmin) return true;
    return component.isPublic;
  });

  // Find components by type
  const findComponent = (type: string) => {
    return visibleComponents.find(component => component.type === type);
  };

  const linkComponent = findComponent('link');
  const teamComponent = findComponent('team');
  const passwordComponent = findComponent('password');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Capture The Flag</h1>
        <p className="text-muted-foreground">
          Resources for CTF competitions - links, team names, and passwords
        </p>
      </div>

      {!isAuthenticated && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8 flex items-center">
          <Lock className="mr-3 text-primary" />
          <div>
            <h3 className="font-medium mb-1">Limited Access</h3>
            <p className="text-sm text-muted-foreground">
              Some content may be hidden. <a href="/login" className="text-primary hover:underline">Log in</a> to view more resources.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CTF Link */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="border-b border-border p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Flag className="text-primary mr-2" size={18} />
              <h3 className="font-medium">CTF Platform Link</h3>
            </div>
          </div>
          {linkComponent ? (
            <div className="p-4">
              <a 
                href={linkComponent.content} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                {linkComponent.title || 'CTF Platform'}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="ml-1"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          ) : (
            <div className="p-4 text-muted-foreground italic text-sm">
              No CTF link available
            </div>
          )}
        </div>

        {/* Team Name */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="border-b border-border p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Users className="text-primary mr-2" size={18} />
              <h3 className="font-medium">Team Name</h3>
            </div>
          </div>
          {teamComponent ? (
            <div className="p-4">
              <div className="bg-hacker-darkgray border border-hacker-lightgray rounded-md p-3 mb-2 font-mono text-sm">
                {teamComponent.content}
              </div>
              <button
                onClick={() => handleCopy(teamComponent.content, 'Team name')}
                className="flex items-center text-xs bg-secondary/30 hover:bg-secondary/50 text-secondary-foreground px-3 py-1.5 rounded-md"
              >
                <Copy size={14} className="mr-1.5" />
                Copy team name
              </button>
            </div>
          ) : (
            <div className="p-4 text-muted-foreground italic text-sm">
              No team name available
            </div>
          )}
        </div>

        {/* Password */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="border-b border-border p-4 flex justify-between items-center">
            <div className="flex items-center">
              <Key className="text-primary mr-2" size={18} />
              <h3 className="font-medium">Team Password</h3>
            </div>
          </div>
          {passwordComponent ? (
            <div className="p-4">
              <div className="bg-hacker-darkgray border border-hacker-lightgray rounded-md p-3 mb-2 font-mono text-sm">
                {passwordComponent.content}
              </div>
              <button
                onClick={() => handleCopy(passwordComponent.content, 'Password')}
                className="flex items-center text-xs bg-secondary/30 hover:bg-secondary/50 text-secondary-foreground px-3 py-1.5 rounded-md"
              >
                <Copy size={14} className="mr-1.5" />
                Copy password
              </button>
            </div>
          ) : (
            <div className="p-4 text-muted-foreground italic text-sm">
              No password available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CTF;
