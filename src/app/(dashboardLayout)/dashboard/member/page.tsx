import MemberDashboardContent from "@/components/module/Dashboard/MemberDashboardContent";
import { getIdeas } from "@/services/idea.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const MemberDashboardpage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["member-dasboard-data"],
    queryFn: () => getIdeas(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MemberDashboardContent />
    </HydrationBoundary>
  );
};

export default MemberDashboardpage;
