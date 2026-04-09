import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "./role.type";

export type TokenPayload = JwtPayload & {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  status: string;
  isDeleted: boolean;
  emailVerified: boolean;
};
