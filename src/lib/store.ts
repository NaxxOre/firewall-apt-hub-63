import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  User, 
  Post, 
  Category, 
  CodeSnippet, 
  WriteUp, 
  TestingTool, 
  CTFComponent,
  YoutubeChannel
} from '../types';
import { CATEGORIES, initialUsers, ADMIN_USER } from './constants';
import { supabase } from '@/integrations/supabase/client';

interface AppState {
  // Auth
  currentUser: User | null;
  users: User[];
  pendingUsers: User[];
  isAuthenticated: boolean;
  
  // Content
  posts: Post[];
  categories: Category[];
  codeSnippets: CodeSnippet[];
  writeUps: WriteUp[];
  testingTools: TestingTool[];
  ctfComponents: CTFComponent[];
  youtubeChannels: YoutubeChannel[];
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'authorId' | 'authorName' | 'imageUrl' | 'imageUrls' | 'externalLink' | 'externalLinks'> & { imageUrls?: string[], externalLinks?: string[] }) => void;
  deletePost: (postId: string) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  
  addCodeSnippet: (codeSnippet: Omit<CodeSnippet, 'id' | 'createdAt'>) => void;
  deleteCodeSnippet: (snippetId: string) => void;
  
  addWriteUp: (writeUp: Omit<WriteUp, 'id' | 'createdAt'>) => void;
  deleteWriteUp: (writeUpId: string) => void;
  
  addTestingTool: (testingTool: Omit<TestingTool, 'id' | 'createdAt'>) => void;
  deleteTestingTool: (toolId: string) => void;
  
  addCTFComponent: (ctfComponent: Omit<CTFComponent, 'id' | 'createdAt'>) => void;
  deleteCTFComponent: (componentId: string) => void;
  
  addYoutubeChannel: (channel: Omit<YoutubeChannel, 'id' | 'createdAt'>) => void;
  deleteYoutubeChannel: (channelId: string) => void;
  
  updatePostVisibility: (postId: string, isPublic: boolean) => void;
  updateCodeSnippetVisibility: (snippetId: string, isPublic: boolean) => void;
  updateWriteUpVisibility: (writeUpId: string, isPublic: boolean) => void;
  updateTestingToolVisibility: (toolId: string, isPublic: boolean) => void;
  updateCTFComponentVisibility: (componentId: string, isPublic: boolean) => void;
  updateYoutubeChannelVisibility: (channelId: string, isPublic: boolean) => void;
  
  syncPendingUsers: () => void;
}

const initialCategories = CATEGORIES;

const PENDING_USERS_KEY = 'firewall-apt-pending-users';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      users: initialUsers,
      pendingUsers: [],
      isAuthenticated: false,
      
      posts: [],
      categories: initialCategories,
      codeSnippets: [],
      writeUps: [],
      testingTools: [],
      ctfComponents: [],
      youtubeChannels: [],
      
      // Authentication Actions
      login: async (email, password) => {
        try {
          // First try Supabase authentication
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
            console.error("Supabase login error:", error);
            // Fallback to local authentication
            const { users } = get();
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
              if (!user.isApproved && !user.isAdmin) {
                console.log("User not approved yet");
                return false;
              }
              
              set({ currentUser: user, isAuthenticated: true });
              return true;
            }
            
            return false;
          }
          
          if (data.user) {
            // Get user profile from profiles table
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              return false;
            }
            
            if (!profileData.is_approved && !profileData.is_admin) {
              console.log("User not approved yet");
              return false;
            }
            
            const userData: User = {
              id: data.user.id,
              username: profileData.username,
              email: profileData.email,
              password: '', // We don't store passwords
              isAdmin: profileData.is_admin || false,
              isApproved: profileData.is_approved || false,
              createdAt: new Date(profileData.created_at)
            };
            
            set({ currentUser: userData, isAuthenticated: true });
            return true;
          }
          
          return false;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },
      
      logout: async () => {
        // Sign out from Supabase
        await supabase.auth.signOut();
        set({ currentUser: null, isAuthenticated: false });
      },
      
      register: async (username, email, password) => {
        // Note: The actual registration is now handled in Register.tsx
        // This function now just maintains local state after registration
        
        const { users, pendingUsers, syncPendingUsers } = get();
        
        syncPendingUsers();
        
        const existingUser = [...users, ...get().pendingUsers].find(
          (u) => u.email === email || u.username === username
        );
        
        if (existingUser) {
          console.log("User already exists");
          return false;
        }
        
        const newUser: User = {
          id: `pending_${Date.now().toString()}`,
          username,
          email,
          password,
          isAdmin: false,
          isApproved: false,
          createdAt: new Date(),
        };
        
        set({ pendingUsers: [...get().pendingUsers, newUser] });
        
        const existingPendingUsers = JSON.parse(localStorage.getItem(PENDING_USERS_KEY) || '[]');
        localStorage.setItem(PENDING_USERS_KEY, JSON.stringify([...existingPendingUsers, newUser]));
        
        return true;
      },
      
      approveUser: async (userId) => {
        const { pendingUsers, users } = get();
        const userToApprove = pendingUsers.find((u) => u.id === userId);
        
        if (userToApprove) {
          // Update user approval status in Supabase
          if (userId.startsWith('pending_')) {
            // This is a legacy user from localStorage, handle accordingly
            const approvedUser = { ...userToApprove, isApproved: true };
            
            set({
              users: [...users, approvedUser],
              pendingUsers: pendingUsers.filter((u) => u.id !== userId),
            });
            
            const existingPendingUsers = JSON.parse(localStorage.getItem(PENDING_USERS_KEY) || '[]');
            localStorage.setItem(
              PENDING_USERS_KEY, 
              JSON.stringify(existingPendingUsers.filter((u: User) => u.id !== userId))
            );
          } else {
            // This is a Supabase user, update the database
            const { error } = await supabase
              .from('profiles')
              .update({ is_approved: true })
              .eq('id', userId);
            
            if (error) {
              console.error("Error approving user:", error);
              return;
            }
            
            set({
              pendingUsers: pendingUsers.filter((u) => u.id !== userId),
            });
          }
        }
      },
      
      rejectUser: async (userId) => {
        const { pendingUsers } = get();
        
        if (userId.startsWith('pending_')) {
          // Legacy user, just remove from localStorage
          set({
            pendingUsers: pendingUsers.filter((u) => u.id !== userId),
          });
          
          const existingPendingUsers = JSON.parse(localStorage.getItem(PENDING_USERS_KEY) || '[]');
          localStorage.setItem(
            PENDING_USERS_KEY, 
            JSON.stringify(existingPendingUsers.filter((u: User) => u.id !== userId))
          );
        } else {
          // Supabase user, delete from profiles
          const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);
          
          if (error) {
            console.error("Error rejecting user:", error);
            return;
          }
          
          set({
            pendingUsers: pendingUsers.filter((u) => u.id !== userId),
          });
        }
      },
      
      syncPendingUsers: async () => {
        try {
          // Get pending users from localStorage (legacy)
          const storedPendingUsers = JSON.parse(localStorage.getItem(PENDING_USERS_KEY) || '[]');
          
          // Get pending users from Supabase
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('is_approved', false);
          
          if (error) {
            console.error("Error fetching pending users:", error);
            set({ pendingUsers: storedPendingUsers });
            return;
          }
          
          console.log("Pending users from Supabase:", data);
          
          // Convert Supabase users to our User format
          const supabasePendingUsers = data.map(profile => ({
            id: profile.id,
            username: profile.username,
            email: profile.email,
            password: '',
            isAdmin: profile.is_admin || false,
            isApproved: false,
            createdAt: new Date(profile.created_at)
          }));
          
          // Combine both sources
          set({ pendingUsers: [...storedPendingUsers, ...supabasePendingUsers] });
        } catch (error) {
          console.error("Error syncing pending users:", error);
        }
      },
      
      // Content Actions - Update to use Supabase
      addPost: async (postData) => {
        const { posts, currentUser } = get();
        if (!currentUser) return;
        
        const newPost: Post = {
          id: Date.now().toString(),
          title: postData.title,
          content: postData.content,
          authorId: currentUser.id,
          authorName: currentUser.username,
          isPublic: currentUser.isAdmin ? postData.isPublic : true,
          createdAt: new Date(),
          parentId: postData.parentId,
          codeSnippet: postData.codeSnippet,
          imageUrl: postData.imageUrls && postData.imageUrls.length > 0 ? postData.imageUrls[0] : undefined,
          imageUrls: postData.imageUrls || [],
          externalLink: postData.externalLinks && postData.externalLinks.length > 0 ? postData.externalLinks[0] : undefined,
          externalLinks: postData.externalLinks || [],
        };
        
        // Store in Supabase first
        try {
          const { error } = await supabase
            .from('posts')
            .insert({
              id: newPost.id,
              title: newPost.title,
              content: newPost.content,
              author_id: newPost.authorId,
              is_public: newPost.isPublic,
              parent_id: newPost.parentId,
              code_snippet: newPost.codeSnippet,
              image_url: newPost.imageUrl,
              image_urls: newPost.imageUrls,
              external_link: newPost.externalLink,
              external_links: newPost.externalLinks
            });
          
          if (error) {
            console.error("Error adding post to Supabase:", error);
            throw error;
          }
        } catch (error) {
          console.error("Error in addPost:", error);
        }
        
        // Update local state for immediate UI feedback
        set({ posts: [...posts, newPost] });
      },
      
      deletePost: async (postId) => {
        const { posts } = get();
        
        // Delete from Supabase
        try {
          const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);
          
          if (error) {
            console.error("Error deleting post from Supabase:", error);
          }
          
          // Also delete any replies
          const { error: repliesError } = await supabase
            .from('posts')
            .delete()
            .eq('parent_id', postId);
          
          if (repliesError) {
            console.error("Error deleting replies from Supabase:", repliesError);
          }
        } catch (error) {
          console.error("Error in deletePost:", error);
        }
        
        // Update local state
        set({
          posts: posts.filter((post) => post.id !== postId && post.parentId !== postId),
        });
      },
      
      addCategory: (category: Omit<Category, 'id'>) => {
        const { categories } = get();
        
        const newCategory: Category = {
          id: Date.now().toString(),
          ...category,
        };
        
        set({ categories: [...categories, newCategory] });
      },
      
      addCodeSnippet: async (snippetData) => {
        const { codeSnippets, currentUser } = get();
        if (!currentUser) return;
        
        const newSnippet: CodeSnippet = {
          id: Date.now().toString(),
          ...snippetData,
          content: snippetData.code,
          createdAt: new Date(),
        };
        
        // Store in Supabase
        try {
          const { error } = await supabase
            .from('code_snippets')
            .insert({
              id: newSnippet.id,
              title: newSnippet.title,
              description: newSnippet.description,
              code: newSnippet.code,
              content: newSnippet.content,
              category_id: newSnippet.categoryId,
              author_id: currentUser.id,
              is_public: newSnippet.isPublic
            });
          
          if (error) {
            console.error("Error adding code snippet to Supabase:", error);
            throw error;
          }
        } catch (error) {
          console.error("Error in addCodeSnippet:", error);
        }
        
        // Update local state
        set({ codeSnippets: [...codeSnippets, newSnippet] });
      },
      
      deleteCodeSnippet: (snippetId) => {
        const { codeSnippets } = get();
        set({
          codeSnippets: codeSnippets.filter((snippet) => snippet.id !== snippetId),
        });
      },
      
      addWriteUp: async (writeUpData) => {
        const { writeUps, currentUser } = get();
        if (!currentUser) return;
        
        const newWriteUp: WriteUp = {
          id: Date.now().toString(),
          ...writeUpData,
          url: writeUpData.link,
          createdAt: new Date(),
        };
        
        // Store in Supabase
        try {
          const { error } = await supabase
            .from('write_ups')
            .insert({
              id: newWriteUp.id,
              title: newWriteUp.title,
              description: newWriteUp.description || '',
              url: newWriteUp.url,
              link: newWriteUp.link,
              category_id: newWriteUp.categoryId,
              author_id: currentUser.id,
              is_public: newWriteUp.isPublic
            });
          
          if (error) {
            console.error("Error adding write-up to Supabase:", error);
            throw error;
          }
        } catch (error) {
          console.error("Error in addWriteUp:", error);
        }
        
        set({ writeUps: [...writeUps, newWriteUp] });
      },
      
      deleteWriteUp: (writeUpId: string) => {
        const { writeUps } = get();
        set({
          writeUps: writeUps.filter((writeUp) => writeUp.id !== writeUpId),
        });
      },
      
      addTestingTool: async (testingToolData) => {
        const { testingTools, currentUser } = get();
        if (!currentUser) return;
        
        const newTool: TestingTool = {
          id: Date.now().toString(),
          ...testingToolData,
          content: testingToolData.code,
          createdAt: new Date(),
        };
        
        // Store in Supabase
        try {
          const { error } = await supabase
            .from('testing_tools')
            .insert({
              id: newTool.id,
              title: newTool.title,
              description: newTool.description || '',
              code: newTool.code,
              content: newTool.content,
              category_id: newTool.categoryId,
              author_id: currentUser.id,
              is_public: newTool.isPublic
            });
          
          if (error) {
            console.error("Error adding testing tool to Supabase:", error);
            throw error;
          }
        } catch (error) {
          console.error("Error in addTestingTool:", error);
        }
        
        set({ testingTools: [...testingTools, newTool] });
      },
      
      deleteTestingTool: (toolId: string) => {
        const { testingTools } = get();
        set({
          testingTools: testingTools.filter((tool) => tool.id !== toolId),
        });
      },
      
      addCTFComponent: async (ctfComponentData) => {
        const { ctfComponents, currentUser } = get();
        if (!currentUser) return;
        
        const newComponent: CTFComponent = {
          id: Date.now().toString(),
          ...ctfComponentData,
          createdAt: new Date(),
        };
        
        // Store in Supabase
        try {
          const { error } = await supabase
            .from('ctf_components')
            .insert({
              id: newComponent.id,
              title: newComponent.title,
              type: newComponent.type,
              content: newComponent.content,
              author_id: currentUser.id,
              is_public: newComponent.isPublic
            });
          
          if (error) {
            console.error("Error adding CTF component to Supabase:", error);
            throw error;
          }
        } catch (error) {
          console.error("Error in addCTFComponent:", error);
        }
        
        set({ ctfComponents: [...ctfComponents, newComponent] });
      },
      
      deleteCTFComponent: (componentId: string) => {
        const { ctfComponents } = get();
        set({
          ctfComponents: ctfComponents.filter((component) => component.id !== componentId),
        });
      },
      
      addYoutubeChannel: async (channelData) => {
        const { youtubeChannels, currentUser } = get();
        if (!currentUser) return;
        
        const newChannel: YoutubeChannel = {
          id: Date.now().toString(),
          ...channelData,
          createdAt: new Date(),
        };
        
        // Store in Supabase
        try {
          const { error } = await supabase
            .from('youtube_channels')
            .insert({
              id: newChannel.id,
              name: newChannel.name,
              url: newChannel.url,
              description: newChannel.description || '',
              thumbnail_url: newChannel.thumbnailUrl,
              author_id: currentUser.id,
              is_public: newChannel.isPublic
            });
          
          if (error) {
            console.error("Error adding YouTube channel to Supabase:", error);
            throw error;
          }
        } catch (error) {
          console.error("Error in addYoutubeChannel:", error);
        }
        
        set({ youtubeChannels: [...youtubeChannels, newChannel] });
      },
      
      deleteYoutubeChannel: async (channelId: string) => {
        const { youtubeChannels } = get();
        
        // Delete from Supabase
        try {
          const { error } = await supabase
            .from('youtube_channels')
            .delete()
            .eq('id', channelId);
          
          if (error) {
            console.error("Error deleting YouTube channel from Supabase:", error);
          }
        } catch (error) {
          console.error("Error in deleteYoutubeChannel:", error);
        }
        
        // Update local state
        set({
          youtubeChannels: youtubeChannels.filter((channel) => channel.id !== channelId),
        });
      },
      
      updatePostVisibility: async (postId: string, isPublic: boolean) => {
        const { posts } = get();
        
        // Update in Supabase
        try {
          const { error } = await supabase
            .from('posts')
            .update({ is_public: isPublic })
            .eq('id', postId);
          
          if (error) {
            console.error("Error updating post visibility in Supabase:", error);
          }
        } catch (error) {
          console.error("Error in updatePostVisibility:", error);
        }
        
        // Update local state
        set({
          posts: posts.map((post) =>
            post.id === postId ? { ...post, isPublic } : post
          ),
        });
      },
      
      updateCodeSnippetVisibility: async (snippetId: string, isPublic: boolean) => {
        const { codeSnippets } = get();
        
        // Update in Supabase
        try {
          const { error } = await supabase
            .from('code_snippets')
            .update({ is_public: isPublic })
            .eq('id', snippetId);
          
          if (error) {
            console.error("Error updating code snippet visibility in Supabase:", error);
          }
        } catch (error) {
          console.error("Error in updateCodeSnippetVisibility:", error);
        }
        
        // Update local state
        set({
          codeSnippets: codeSnippets.map((snippet) =>
            snippet.id === snippetId ? { ...snippet, isPublic } : snippet
          ),
        });
      },
      
      updateWriteUpVisibility: async (writeUpId: string, isPublic: boolean) => {
        const { writeUps } = get();
        
        // Update in Supabase
        try {
          const { error } = await supabase
            .from('write_ups')
            .update({ is_public: isPublic })
            .eq('id', writeUpId);
          
          if (error) {
            console.error("Error updating write-up visibility in Supabase:", error);
          }
        } catch (error) {
          console.error("Error in updateWriteUpVisibility:", error);
        }
        
        // Update local state
        set({
          writeUps: writeUps.map((writeUp) =>
            writeUp.id === writeUpId ? { ...writeUp, isPublic } : writeUp
          ),
        });
      },
      
      updateTestingToolVisibility: async (toolId: string, isPublic: boolean) => {
        const { testingTools } = get();
        
        // Update in Supabase
        try {
          const { error } = await supabase
            .from('testing_tools')
            .update({ is_public: isPublic })
            .eq('id', toolId);
          
          if (error) {
            console.error("Error updating testing tool visibility in Supabase:", error);
          }
        } catch (error) {
          console.error("Error in updateTestingToolVisibility:", error);
        }
        
        // Update local state
        set({
          testingTools: testingTools.map((tool) =>
            tool.id === toolId ? { ...tool, isPublic } : tool
          ),
        });
      },
      
      updateCTFComponentVisibility: async (componentId: string, isPublic: boolean) => {
        const { ctfComponents } = get();
        
        // Update in Supabase
        try {
          const { error } = await supabase
            .from('ctf_components')
            .update({ is_public: isPublic })
            .eq('id', componentId);
          
          if (error) {
            console.error("Error updating CTF component visibility in Supabase:", error);
          }
        } catch (error) {
          console.error("Error in updateCTFComponentVisibility:", error);
        }
        
        // Update local state
        set({
          ctfComponents: ctfComponents.map((component) =>
            component.id === componentId ? { ...component, isPublic } : component
          ),
        });
      },
      
      updateYoutubeChannelVisibility: async (channelId: string, isPublic: boolean) => {
        const { youtubeChannels } = get();
        
        // Update in Supabase
        try {
          const { error } = await supabase
            .from('youtube_channels')
            .update({ is_public: isPublic })
            .eq('id', channelId);
          
          if (error) {
            console.error("Error updating YouTube channel visibility in Supabase:", error);
          }
        } catch (error) {
          console.error("Error in updateYoutubeChannelVisibility:", error);
        }
        
        // Update local state
        set({
          youtubeChannels: youtubeChannels.map((channel) =>
            channel.id === channelId ? { ...channel, isPublic } : channel
          ),
        });
      },
    }),
    {
      name: 'firewall-apt-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        posts: state.posts,
        categories: state.categories,
        codeSnippets: state.codeSnippets,
        writeUps: state.writeUps,
        testingTools: state.testingTools,
        ctfComponents: state.ctfComponents,
        youtubeChannels: state.youtubeChannels,
      }),
    }
  )
);
