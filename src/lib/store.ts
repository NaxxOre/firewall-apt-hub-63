
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
import { CATEGORIES, initialUsers } from './constants';

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
  
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'authorId' | 'authorName'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  addCodeSnippet: (codeSnippet: Omit<CodeSnippet, 'id' | 'createdAt'>) => void;
  addWriteUp: (writeUp: Omit<WriteUp, 'id' | 'createdAt'>) => void;
  addTestingTool: (testingTool: Omit<TestingTool, 'id' | 'createdAt'>) => void;
  addCTFComponent: (ctfComponent: Omit<CTFComponent, 'id' | 'createdAt'>) => void;
  addYoutubeChannel: (channel: Omit<YoutubeChannel, 'id' | 'createdAt'>) => void;
  
  updatePostVisibility: (postId: string, isPublic: boolean) => void;
  updateCodeSnippetVisibility: (snippetId: string, isPublic: boolean) => void;
  updateWriteUpVisibility: (writeUpId: string, isPublic: boolean) => void;
  updateTestingToolVisibility: (toolId: string, isPublic: boolean) => void;
  updateCTFComponentVisibility: (componentId: string, isPublic: boolean) => void;
  updateYoutubeChannelVisibility: (channelId: string, isPublic: boolean) => void;
}

const initialCategories = CATEGORIES.map((category, index) => ({
  id: (index + 1).toString(),
  ...category,
}));

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
        const { users } = get();
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          if (!user.isApproved && !user.isAdmin) {
            console.log("User not approved yet");
            return false;
          }
          
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      register: async (username, email, password) => {
        const { users, pendingUsers } = get();
        
        const existingUser = [...users, ...pendingUsers].find(
          (u) => u.email === email || u.username === username
        );
        
        if (existingUser) {
          console.log("User already exists");
          return false;
        }
        
        const newUser: User = {
          id: Date.now().toString(),
          username,
          email,
          password,
          isAdmin: false,
          isApproved: false,
          createdAt: new Date(),
        };
        
        set({ pendingUsers: [...pendingUsers, newUser] });
        return true;
      },
      
      approveUser: (userId) => {
        const { pendingUsers, users } = get();
        const userToApprove = pendingUsers.find((u) => u.id === userId);
        
        if (userToApprove) {
          const approvedUser = { ...userToApprove, isApproved: true };
          set({
            users: [...users, approvedUser],
            pendingUsers: pendingUsers.filter((u) => u.id !== userId),
          });
        }
      },
      
      rejectUser: (userId) => {
        const { pendingUsers } = get();
        set({
          pendingUsers: pendingUsers.filter((u) => u.id !== userId),
        });
      },
      
      // Content Actions
      addPost: (postData) => {
        const { posts, currentUser } = get();
        if (!currentUser) return;
        
        const newPost: Post = {
          id: Date.now().toString(),
          ...postData,
          authorId: currentUser.id,
          authorName: currentUser.username,
          isPublic: currentUser.isAdmin ? postData.isPublic : true, // Regular users can only create public posts
          createdAt: new Date(),
        };
        
        set({ posts: [...posts, newPost] });
      },
      
      addCategory: (categoryData) => {
        const { categories } = get();
        
        const newCategory: Category = {
          id: Date.now().toString(),
          ...categoryData,
        };
        
        set({ categories: [...categories, newCategory] });
      },
      
      addCodeSnippet: (snippetData) => {
        const { codeSnippets } = get();
        
        const newSnippet: CodeSnippet = {
          id: Date.now().toString(),
          ...snippetData,
          createdAt: new Date(),
        };
        
        set({ codeSnippets: [...codeSnippets, newSnippet] });
      },
      
      addWriteUp: (writeUpData) => {
        const { writeUps } = get();
        
        const newWriteUp: WriteUp = {
          id: Date.now().toString(),
          ...writeUpData,
          createdAt: new Date(),
        };
        
        set({ writeUps: [...writeUps, newWriteUp] });
      },
      
      addTestingTool: (toolData) => {
        const { testingTools } = get();
        
        const newTool: TestingTool = {
          id: Date.now().toString(),
          ...toolData,
          createdAt: new Date(),
        };
        
        set({ testingTools: [...testingTools, newTool] });
      },
      
      addCTFComponent: (componentData) => {
        const { ctfComponents } = get();
        
        const newComponent: CTFComponent = {
          id: Date.now().toString(),
          ...componentData,
          createdAt: new Date(),
        };
        
        set({ ctfComponents: [...ctfComponents, newComponent] });
      },
      
      addYoutubeChannel: (channelData) => {
        const { youtubeChannels } = get();
        
        const newChannel: YoutubeChannel = {
          id: Date.now().toString(),
          ...channelData,
          createdAt: new Date(),
        };
        
        set({ youtubeChannels: [...youtubeChannels, newChannel] });
      },
      
      // Visibility Actions
      updatePostVisibility: (postId, isPublic) => {
        const { posts } = get();
        set({
          posts: posts.map((post) =>
            post.id === postId ? { ...post, isPublic } : post
          ),
        });
      },
      
      updateCodeSnippetVisibility: (snippetId, isPublic) => {
        const { codeSnippets } = get();
        set({
          codeSnippets: codeSnippets.map((snippet) =>
            snippet.id === snippetId ? { ...snippet, isPublic } : snippet
          ),
        });
      },
      
      updateWriteUpVisibility: (writeUpId, isPublic) => {
        const { writeUps } = get();
        set({
          writeUps: writeUps.map((writeUp) =>
            writeUp.id === writeUpId ? { ...writeUp, isPublic } : writeUp
          ),
        });
      },
      
      updateTestingToolVisibility: (toolId, isPublic) => {
        const { testingTools } = get();
        set({
          testingTools: testingTools.map((tool) =>
            tool.id === toolId ? { ...tool, isPublic } : tool
          ),
        });
      },
      
      updateCTFComponentVisibility: (componentId, isPublic) => {
        const { ctfComponents } = get();
        set({
          ctfComponents: ctfComponents.map((component) =>
            component.id === componentId ? { ...component, isPublic } : component
          ),
        });
      },
      
      updateYoutubeChannelVisibility: (channelId, isPublic) => {
        const { youtubeChannels } = get();
        set({
          youtubeChannels: youtubeChannels.map((channel) =>
            channel.id === channelId ? { ...channel, isPublic } : channel
          ),
        });
      },
    }),
    {
      name: 'firewall-apt-storage',
    }
  )
);
