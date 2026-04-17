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
  author: IUser;
  _count: {
    votes: number;
    comments: number;
  };
}

export interface ICreateIdeaPayload {
  title: string;
  description: string;
  categoryId: string;
  isPremium?: boolean;
  price?: number;
}

export interface IUpdateIdeaPayload {
  title?: string;
  description?: string;
  categoryId?: string;
  status?: IdeaStatus;
  isPremium?: boolean;
  price?: number;
}
