
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  isApproved: boolean;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  isPublic: boolean;
  createdAt: Date;
  category?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  content: string;
  description?: string; // Adding the missing description property
  categoryId: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface WriteUp {
  id: string;
  title: string;
  link: string;
  url: string;
  description?: string;
  categoryId: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface TestingTool {
  id: string;
  title: string;
  code: string;
  content: string;
  description?: string;
  categoryId: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface CTFComponent {
  id: string;
  type: 'link' | 'teamName' | 'password';
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface YoutubeChannel {
  id: string;
  name: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  createdAt: Date;
}

export type ContentType = 
  | 'post' 
  | 'codeSnippet'
  | 'writeUp'
  | 'testingTool'
  | 'ctfComponent'
  | 'youtubeChannel';
