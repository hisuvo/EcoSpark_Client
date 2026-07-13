export interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  excerpt: string;
  category: string;
  status: "PUBLISHED" | "DRAFT";
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data: Blog[];
}

export interface SingleBlogResponse {
  success: boolean;
  message: string;
  data: Blog;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  excerpt: string;
  category: string;
}

export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
}
