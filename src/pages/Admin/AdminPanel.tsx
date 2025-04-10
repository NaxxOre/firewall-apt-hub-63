import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  FolderOpen,
  Youtube,
  Flag,
  MessageSquare,
  FileText,
  Code,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import AddContentModal from '@/components/AddContentModal';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddCodeSnippet from '@/components/AddCodeSnippet';
import AddTestingTool from '@/components/AddTestingTool';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { 
    pendingUsers,
    approveUser,
    rejectUser,
    currentUser,
    syncPendingUsers
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'users' | 'content'>('users');
  const [modalOpen, setModalOpen] = useState<{
    isOpen: boolean,
    type: 'writeup' | 'youtube' | 'ctf' | 'code' | 'tool',
    title: string
  }>({
    isOpen: false,
    type: 'writeup',
    title: ''
  });
  const [loading, setLoading] = useState(false);
  const [dbPendingUsers, setDbPendingUsers] = useState<any[]>([]);
  
  const navigate = useNavigate();

  // Sync pending users when admin panel loads
  useEffect(() => {
    if (currentUser?.isAdmin) {
      setLoading(true);
      syncPendingUsers();
      
      // Also fetch directly from Supabase for most up-to-date data
      const fetchPendingUsers = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_approved', false);
          
        if (error) {
          console.error("Error fetching pending users:", error);
          toast.error("Error loading pending users");
          setLoading(false);
          return;
        }
        
        console.log("Pending users from Supabase:", data);
        setDbPendingUsers(data || []);
        setLoading(false);
      };
      
      fetchPendingUsers();
    }
  }, [currentUser, syncPendingUsers]);

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

  // Combine local pending users with those fetched directly from DB
  const allPendingUsers = [...pendingUsers];
  // Add DB users that aren't already in the local state
  dbPendingUsers.forEach(dbUser => {
    if (!allPendingUsers.some(localUser => localUser.id === dbUser.id)) {
      allPendingUsers.push({
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        password: '',
        isAdmin: dbUser.is_admin,
        isApproved: false,
        createdAt: new Date(dbUser.created_at)
      });
    }
  });

  const handleApproveUser = async (userId: string) => {
    try {
      setLoading(true);
      
      // First update in Supabase directly
      if (!userId.startsWith('pending_')) {
        const { error } = await supabase
          .from('profiles')
          .update({ is_approved: true })
          .eq('id', userId);
          
        if (error) {
          console.error("Error approving user in Supabase:", error);
          toast.error("Failed to approve user");
          setLoading(false);
          return;
        }
      }
      
      // Then update local state via store function
      await approveUser(userId);
      toast.success('User approved');
      
      // Refresh the list
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', false);
        
      if (!error && data) {
        setDbPendingUsers(data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error in handleApproveUser:", error);
      toast.error("An error occurred while approving the user");
      setLoading(false);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      setLoading(true);
      
      // First update in Supabase directly if it's a Supabase user
      if (!userId.startsWith('pending_')) {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
          
        if (error) {
          console.error("Error rejecting user in Supabase:", error);
          toast.error("Failed to reject user");
          setLoading(false);
          return;
        }
      }
      
      // Then update local state
      rejectUser(userId);
      toast.success('User rejected');
      
      // Refresh the list
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', false);
        
      if (!error && data) {
        setDbPendingUsers(data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error in handleRejectUser:", error);
      toast.error("An error occurred while rejecting the user");
      setLoading(false);
    }
  };

  const openModal = (type: 'writeup' | 'youtube' | 'ctf' | 'code' | 'tool', title: string) => {
    setModalOpen({
      isOpen: true,
      type,
      title
    });
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
                {allPendingUsers.length > 0 && (
                  <span className="ml-auto bg-primary text-white text-xs py-0.5 px-2 rounded-full">
                    {allPendingUsers.length}
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
                
                {loading ? (
                  <div className="bg-card border border-border rounded-lg p-6 text-center">
                    <p className="text-muted-foreground">Loading pending users...</p>
                  </div>
                ) : allPendingUsers.length === 0 ? (
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
                        {allPendingUsers.map((user) => (
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
                                  disabled={loading}
                                >
                                  {loading ? 'Processing...' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => handleRejectUser(user.id)}
                                  className="bg-primary/30 hover:bg-primary/40 text-primary px-3 py-1 rounded text-sm"
                                  disabled={loading}
                                >
                                  {loading ? 'Processing...' : 'Reject'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
                    onClick={() => openModal('code', 'Add Code Snippet')}
                  >
                    <div className="flex items-center mb-2">
                      <Code size={18} className="mr-2 text-primary" />
                      <h3 className="font-medium">Add Code Snippet</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add code snippets for different categories
                    </p>
                  </div>
                  
                  <div 
                    className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
                    onClick={() => openModal('tool', 'Add Testing Tool')}
                  >
                    <div className="flex items-center mb-2">
                      <Wrench size={18} className="mr-2 text-primary" />
                      <h3 className="font-medium">Add Testing Tool</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add testing tools with code and descriptions
                    </p>
                  </div>
                  
                  <div 
                    className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
                    onClick={() => openModal('writeup', 'Add Write-up')}
                  >
                    <div className="flex items-center mb-2">
                      <FileText size={18} className="mr-2 text-primary" />
                      <h3 className="font-medium">Add Write-up</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add write-ups with external links
                    </p>
                  </div>
                  
                  <div 
                    className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
                    onClick={() => openModal('youtube', 'Add YouTube Channel')}
                  >
                    <div className="flex items-center mb-2">
                      <Youtube size={18} className="mr-2 text-primary" />
                      <h3 className="font-medium">Add YouTube Channel</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add YouTube channel listings
                    </p>
                  </div>
                  
                  <div 
                    className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
                    onClick={() => openModal('ctf', 'Add CTF Component')}
                  >
                    <div className="flex items-center mb-2">
                      <Flag size={18} className="mr-2 text-primary" />
                      <h3 className="font-medium">Add CTF Component</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add links, team names, and passwords for CTF
                    </p>
                  </div>
                  
                  <div 
                    className="bg-card hover:bg-card/90 border border-border rounded-lg p-4 cursor-pointer"
                    onClick={() => navigate('/admin/manage-posts')}
                  >
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

      {/* Content modals */}
      {(modalOpen.type === 'writeup' || modalOpen.type === 'youtube' || modalOpen.type === 'ctf') && (
        <AddContentModal
          open={modalOpen.isOpen}
          onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}
          type={modalOpen.type as 'writeup' | 'youtube' | 'ctf'}
          title={modalOpen.title}
        />
      )}

      {modalOpen.type === 'code' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Code Snippet</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new code snippet.
              </DialogDescription>
            </DialogHeader>
            <AddCodeSnippet closeModal={() => setModalOpen({ ...modalOpen, isOpen: false })} />
          </DialogContent>
        </Dialog>
      )}

      {modalOpen.type === 'tool' && (
        <Dialog open={modalOpen.isOpen} onOpenChange={(isOpen) => setModalOpen({ ...modalOpen, isOpen })}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Testing Tool</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new testing tool.
              </DialogDescription>
            </DialogHeader>
            <AddTestingTool closeModal={() => setModalOpen({ ...modalOpen, isOpen: false })} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPanel;
