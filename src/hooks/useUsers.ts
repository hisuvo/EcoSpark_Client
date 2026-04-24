import { getAllUsers } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsers(params),
  });
};
