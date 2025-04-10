
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
  author_id?: string;
  authorName: string;
  createdAt: Date;
  created_at?: string;
  isPublic: boolean;
  is_public?: boolean;
  parentId?: string;
  parent_id?: string;
  codeSnippet?: string;
  code_snippet?: string;
  imageUrl?: string;
  image_url?: string;
  imageUrls: string[];
  externalLink?: string;
  external_link?: string;
  externalLinks: string[];
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
  category_id?: string;
  description?: string;
  createdAt: Date;
  created_at?: string;
  isPublic: boolean;
  is_public?: boolean;
  author_id?: string;
}

export interface WriteUp {
  id: string;
  title: string;
  url: string;
  link: string;
  description?: string;
  categoryId: string;
  category_id?: string;
  createdAt: Date;
  created_at?: string;
  isPublic: boolean;
  is_public?: boolean;
  author_id?: string;
}

export interface TestingTool {
  id: string;
  title: string;
  content: string;
  code: string;
  description?: string;
  categoryId: string;
  category_id?: string;
  createdAt: Date;
  created_at?: string;
  isPublic: boolean;
  is_public?: boolean;
  author_id?: string;
}

export interface CTFComponent {
  id: string;
  title: string;
  type: 'link' | 'teamName' | 'password';
  content: string;
  createdAt: Date;
  created_at?: string;
  isPublic: boolean;
  is_public?: boolean;
  author_id?: string;
}

export interface YoutubeChannel {
  id: string;
  name: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  createdAt: Date;
  created_at?: string;
  isPublic: boolean;
  is_public?: boolean;
  author_id?: string;
}
