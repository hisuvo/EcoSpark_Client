import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import AdminOverview from "@/components/module/admin/Overview";
import { getAdminStats, getAllUsers } from "@/services/user.service";

const AdminDashboardpage = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["users", { limit: 5 }],
      queryFn: () => getAllUsers({ limit: 5 }),
    }),

    queryClient.prefetchQuery({
      queryKey: ["admin-stats"],
      queryFn: () => getAdminStats(),
    }),
  ]);

  const dehydrateState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <div className="p-6 lg:p-8">
        <AdminOverview />
      </div>
    </HydrationBoundary>
  );
};

export default AdminDashboardpage;
