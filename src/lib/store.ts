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
}

const initialCategories = CATEGORIES;

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
          imageUrl: postData.imageUrl || undefined,
          imageUrls: postData.imageUrls || [],
          externalLink: postData.externalLink || undefined,
          externalLinks: postData.externalLinks || [],
          authorId: currentUser.id,
          authorName: currentUser.username,
          isPublic: currentUser.isAdmin ? postData.isPublic : true,
          createdAt: new Date(),
        };
        
        set({ posts: [...posts, newPost] });
      },
      
      deletePost: (postId) => {
        const { posts } = get();
        set({
          posts: posts.filter((post) => post.id !== postId && post.parentId !== postId),
        });
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
          content: snippetData.code,
          createdAt: new Date(),
        };
        
        set({ codeSnippets: [...codeSnippets, newSnippet] });
      },
      
      deleteCodeSnippet: (snippetId) => {
        const { codeSnippets } = get();
        set({
          codeSnippets: codeSnippets.filter((snippet) => snippet.id !== snippetId),
        });
      },
      
      addWriteUp: (writeUpData) => {
        const { writeUps } = get();
        
        const newWriteUp: WriteUp = {
          id: Date.now().toString(),
          ...writeUpData,
          url: writeUpData.link,
          createdAt: new Date(),
        };
        
        set({ writeUps: [...writeUps, newWriteUp] });
      },
      
      deleteWriteUp: (writeUpId) => {
        const { writeUps } = get();
        set({
          writeUps: writeUps.filter((writeUp) => writeUp.id !== writeUpId),
        });
      },
      
      addTestingTool: (toolData) => {
        const { testingTools } = get();
        
        const newTool: TestingTool = {
          id: Date.now().toString(),
          ...toolData,
          content: toolData.code,
          createdAt: new Date(),
        };
        
        set({ testingTools: [...testingTools, newTool] });
      },
      
      deleteTestingTool: (toolId) => {
        const { testingTools } = get();
        set({
          testingTools: testingTools.filter((tool) => tool.id !== toolId),
        });
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
      
      deleteCTFComponent: (componentId) => {
        const { ctfComponents } = get();
        set({
          ctfComponents: ctfComponents.filter((component) => component.id !== componentId),
        });
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
      
      deleteYoutubeChannel: (channelId) => {
        const { youtubeChannels } = get();
        set({
          youtubeChannels: youtubeChannels.filter((channel) => channel.id !== channelId),
        });
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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        pendingUsers: state.pendingUsers,
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
