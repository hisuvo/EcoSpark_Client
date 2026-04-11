export interface IUser {
  id: string;
  name: string;
  image?: string | null | undefined;
  email: string;
  emailVerified: boolean;
  needPasswordChange: boolean;
  role: string;
  status: string;
  isDeleted: boolean;
  deletedAt?: Date | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}