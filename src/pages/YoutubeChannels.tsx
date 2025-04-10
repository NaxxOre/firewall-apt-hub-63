
import React from 'react';
import { useStore } from '@/lib/store';
import { ExternalLink, Lock, Youtube } from 'lucide-react';

const YoutubeChannels = () => {
  const { youtubeChannels, currentUser, isAuthenticated } = useStore();
  
  // Get visible channels based on user status
  const visibleChannels = youtubeChannels.filter(channel => {
    if (!isAuthenticated) return channel.isPublic;
    if (currentUser?.isAdmin) return true;
    return channel.isPublic;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">YouTube Channels</h1>
        <p className="text-muted-foreground">
          Curated YouTube channels for cybersecurity learning and research
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

      {visibleChannels.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <Youtube className="mx-auto mb-3 text-red-500" size={32} />
          <h3 className="font-medium mb-1">No Channels Available</h3>
          <p className="text-sm text-muted-foreground">
            Check back later for YouTube channel recommendations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleChannels.map((channel) => (
            <div key={channel.id} className="bg-card border border-border rounded-lg overflow-hidden">
              {channel.thumbnailUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={channel.thumbnailUrl} 
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium mb-1 flex items-center">
                  <Youtube className="text-red-500 mr-2" size={18} />
                  {channel.name}
                </h3>
                {channel.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {channel.description}
                  </p>
                )}
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline text-sm"
                >
                  Visit Channel
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YoutubeChannels;
