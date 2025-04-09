
import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  Users,
  FolderOpen,
  PlusCircle,
  Youtube,
  Flag,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { 
    pendingUsers,
    approveUser,
    rejectUser,
    currentUser
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'users' | 'content'>('users');

  // Redirect non-admin users
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  const handleApproveUser = (userId: string) => {
    approveUser(userId);
    toast.success('User approved');
  };

  const handleRejectUser = (userId: string) => {
    rejectUser(userId);
    toast.success('User rejected');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, content, and site settings</p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-hacker-darkgray md:border-r border-border">
            <nav className="p-4">
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center w-full text-left px-4 py-3 rounded-md mb-2 ${
                  activeTab === 'users'
                    ? 'bg-hacker-lightgray text-primary'
                    : 'hover:bg-hacker-lightgray/50'
                }`}
              >
                <Users size={18} className="mr-3" />
                <span>User Management</span>
                {pendingUsers.length > 0 && (
                  <span className="ml-auto bg-primary text-white text-xs py-0.5 px-2 rounded-full">
                    {pendingUsers.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center w-full text-left px-4 py-3 rounded-md mb-2 ${
                  activeTab === 'content'
                    ? 'bg-hacker-lightgray text-primary'
                    : 'hover:bg-hacker-lightgray/50'
                }`}
              >
                <FolderOpen size={18} className="mr-3" />
                <span>Content Management</span>
              </button>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-grow p-6">
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold mb-4">User Approval Requests</h2>
                
                {pendingUsers.length === 0 ? (
                  <div className="bg-card border border-border rounded-lg p-6 text-center">
                    <p className="text-muted-foreground">No pending approval requests</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-hacker-darkgray">
                        <tr>
                          <th className="py-3 px-4 text-left">Username</th>
                          <th className="py-3 px-4 text-left">Email</th>
                          <th className="py-3 px-4 text-left">Registration Date</th>
                          <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingUsers.map((user) => (
                          <tr key={user.id} className="border-b border-border">
                            <td className="py-3 px-4">{user.username}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApproveUser(user.id)}
                                  className="bg-green-900/30 hover:bg-green-900/50 text-green-400 px-3 py-1 rounded text-sm"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectUser(user.id)}
                                  className="bg-primary/30 hover:bg-primary/40 text-primary px-3 py-1 rounded text-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Content Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer">
                    <div className="flex items-center mb-2">
                      <PlusCircle size={18} className="mr-2 text-primary" />
                      <h3 className="font-medium">Add Category Content</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add code snippets, write-ups, or tools to categories
                    </p>
                  </div>
                  
                  <div className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer">
                    <div className="flex items-center mb-2">
                      <Youtube size={18} className="mr-2 text-primary" />
                      <h3 className="font-medium">Manage YouTube Channels</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add or edit YouTube channel listings
                    </p>
                  </div>
                  
                  <div className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer">
                    <div className="flex items-center mb-2">
                      <Flag size={18} className="mr-2 text-primary" />
                      <h3 className="font-medium">Manage CTF Components</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add links, team names, and passwords for CTF
                    </p>
                  </div>
                  
                  <div className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer">
                    <div className="flex items-center mb-2">
                      <MessageSquare size={18} className="mr-2 text-primary" />
                      <h3 className="font-medium">Manage Forum Posts</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Create, edit, or moderate forum content
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
