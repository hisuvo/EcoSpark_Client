import { getAdminStats } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(),
  });
};
