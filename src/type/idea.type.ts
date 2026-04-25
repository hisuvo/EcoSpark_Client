import { ICategory } from "./category.type";
import { IUser } from "./user.type";

export type IdeaStatus = "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface IIdea {
  id: string;
  title: string;
  problem: string;
  solution: string;
  description: string;
  imageUrl: string | null;
  isPaid: boolean;
  price: number;
  status: IdeaStatus;
  feedback: string | null;
  authorId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: ICategory;
  author: {
    id: string;
    name: string;
  };
  _count: {
    votes: number;
    comments: number;
  };
  comments: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
    };
  }[];

  // IMPORTANT
  isHidden?: boolean;
  isPurchased?: boolean;
}

export interface IIdeaResponse {
  data: IIdea[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ICreateIdeaPayload {
  title: string;
  problem: string;
  solution: string;
  description: string;
  imageUrl?: string | undefined;
  isPaid?: boolean | undefined;
  price?: number | undefined;
  categoryId: string;
  status?: IdeaStatus;
}

export interface IUpdateIdeaPayload {
  title?: string;
  description?: string;
  categoryId?: string;
  status?: IdeaStatus;
  feedback?: string;
  isPremium?: boolean;
  price?: number;
}
