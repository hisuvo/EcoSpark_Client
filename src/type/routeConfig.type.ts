import { UserRole } from "./role.type";

// Route configaratin define for overlopping route confict
export interface RouteConfig {
  role: UserRole;
  exact: string[];
  pattern: RegExp[];
  priority: number; // Higher number = Higher priority
}
