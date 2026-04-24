import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const AdminDashboardpage = async () => {
  const queryClient = new QueryClient();

  // await Promise.all([
  //   queryClient.prefetchQuery({
  //     queryKey: ["admin-dashboard-categories"],
  //     queryFn: () => console.log("this is categories"),
  //     staleTime: 30 * 1000,
  //     gcTime: 5 * 60 * 1000,
  //   }),

  //   queryClient.prefetchQuery({
  //     queryKey: ["admin-dashboard-allUsers"],
  //     queryFn: () => console.log("amdin dashboard all users"),
  //     staleTime: 30 * 1000,
  //     gcTime: 5 * 60 * 1000,
  //   }),

  //   queryClient.prefetchQuery({
  //     queryKey: ["admin-dashboard-comments"],
  //     queryFn: () => console.log("amdin dashboard all comments"),
  //     staleTime: 30 * 1000,
  //     gcTime: 5 * 60 * 1000,
  //   }),
  // ]);

  const dehydrateState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <div>This is admin dashboard hydration data</div>
    </HydrationBoundary>
  );
};

export default AdminDashboardpage;
