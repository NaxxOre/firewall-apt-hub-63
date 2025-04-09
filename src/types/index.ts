
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
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
  createdAt: Date;
  isPublic: boolean;
  parentId?: string;
  imageUrl?: string;
  codeSnippet?: string;
  externalLink?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  content: string;
  code: string;
  categoryId: string;
  description?: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface WriteUp {
  id: string;
  title: string;
  url: string;
  link: string;
  description?: string;
  categoryId: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface TestingTool {
  id: string;
  title: string;
  content: string;
  code: string;
  description?: string;
  categoryId: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface CTFComponent {
  id: string;
  title: string;
  type: 'link' | 'teamName' | 'password';
  content: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface YoutubeChannel {
  id: string;
  name: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  isPublic: boolean;
}
