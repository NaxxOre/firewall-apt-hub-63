
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

  // Group components by title (without the " - Type" suffix)
  const groupedComponents = visibleComponents.reduce((acc, component) => {
    // Extract base title by removing " - Type" if present
    const baseTitle = component.title.split(' - ')[0];
    if (!acc[baseTitle]) {
      acc[baseTitle] = {
        title: baseTitle,
        link: null,
        teamName: null,
        password: null
      };
    }
    
    // Add the specific component based on type
    if (component.type === 'link') {
      acc[baseTitle].link = component.content;
    } else if (component.type === 'team') {
      acc[baseTitle].teamName = component.content;
    } else if (component.type === 'password') {
      acc[baseTitle].password = component.content;
    }
    
    return acc;
  }, {} as Record<string, { title: string, link: string | null, teamName: string | null, password: string | null }>);

  const ctfGroups = Object.values(groupedComponents);

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

      <div className="grid gap-6">
        {ctfGroups.length > 0 ? (
          ctfGroups.map((group, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="border-b border-border p-4">
                <h3 className="font-medium text-lg">{group.title}</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 p-4">
                {/* CTF Link */}
                <div className="bg-hacker-darkgray rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Flag className="text-primary mr-2" size={18} />
                    <h4 className="font-medium">CTF Platform Link</h4>
                  </div>
                  {group.link ? (
                    <a 
                      href={group.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      {group.link}
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
                  ) : (
                    <p className="text-muted-foreground italic text-sm">
                      No CTF link available
                    </p>
                  )}
                </div>

                {/* Team Name */}
                <div className="bg-hacker-darkgray rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Users className="text-primary mr-2" size={18} />
                    <h4 className="font-medium">Team Name</h4>
                  </div>
                  {group.teamName ? (
                    <>
                      <div className="bg-hacker-dark border border-hacker-lightgray rounded-md p-3 mb-2 font-mono text-sm">
                        {group.teamName}
                      </div>
                      <button
                        onClick={() => handleCopy(group.teamName!, 'Team name')}
                        className="flex items-center text-xs bg-secondary/30 hover:bg-secondary/50 text-secondary-foreground px-3 py-1.5 rounded-md"
                      >
                        <Copy size={14} className="mr-1.5" />
                        Copy team name
                      </button>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic text-sm">
                      No team name available
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="bg-hacker-darkgray rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Key className="text-primary mr-2" size={18} />
                    <h4 className="font-medium">Team Password</h4>
                  </div>
                  {group.password ? (
                    <>
                      <div className="bg-hacker-dark border border-hacker-lightgray rounded-md p-3 mb-2 font-mono text-sm">
                        {group.password}
                      </div>
                      <button
                        onClick={() => handleCopy(group.password!, 'Password')}
                        className="flex items-center text-xs bg-secondary/30 hover:bg-secondary/50 text-secondary-foreground px-3 py-1.5 rounded-md"
                      >
                        <Copy size={14} className="mr-1.5" />
                        Copy password
                      </button>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic text-sm">
                      No password available
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No CTF information available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CTF;
