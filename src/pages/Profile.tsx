
import React from 'react';
import { useStore } from '@/lib/store';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, MessageSquare, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { currentUser, isAuthenticated, logout, posts } = useStore();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  if (!isAuthenticated || !currentUser) {
    navigate('/login');
    return null;
  }
  
  // Get posts by current user
  const userPosts = posts.filter(post => post.authorId === currentUser.id);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and view your activity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-hacker-lightgray rounded-full p-6 mb-4">
                <User size={48} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold">{currentUser.username}</h2>
              <p className="text-muted-foreground">{currentUser.email}</p>
              {currentUser.isAdmin && (
                <span className="mt-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-md">
                  Admin
                </span>
              )}
            </div>
            
            <div className="border-t border-border pt-4 flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(currentUser.isAdmin ? '/admin' : '/dashboard')}
              >
                <Layout size={16} className="mr-2" />
                {currentUser.isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
              </Button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center bg-primary/20 hover:bg-primary/30 text-primary py-2 px-3 rounded-md transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Your Posts</h3>
              <span className="bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded-md">
                {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
            
            {userPosts.length === 0 ? (
              <div className="text-center py-6">
                <MessageSquare className="mx-auto mb-2" size={24} />
                <p className="text-muted-foreground">You haven't created any posts yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="border border-border bg-hacker-darkgray rounded-lg p-4"
                  >
                    <h4 className="font-medium mb-1">
                      <a 
                        href={`/forum/post/${post.id}`} 
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </a>
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {post.content}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
