"use client";

import { useQuery } from "@tanstack/react-query";
import { getIdeas } from "@/services/idea.service";
import { IIdea } from "@/type/idea.type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StatsCard from "@/shared/form/StatsCard";

const MemberDashboardClient = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-ideas"],
    queryFn: () => getIdeas(),
  });

  const ideas: IIdea[] = data?.data?.data ?? [];

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const stats = ideas.reduce(
    (acc, idea) => {
      switch (idea.status) {
        case "DRAFT":
          acc.drafts++;
          break;
        case "UNDER_REVIEW":
          acc.underReview++;
          break;
        case "APPROVED":
          acc.approved++;
          break;
        case "REJECTED":
          acc.rejected++;
          break;
      }
      return acc;
    },
    {
      drafts: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
    },
  );

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Member Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your ideas and activity
          </p>
        </div>

        <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
          <Link href="/dashboard/member/ideas/create">Create New Idea</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Drafts" value={stats.drafts} iconName={"Drafts"} />
        <StatsCard
          title="Under Review"
          value={stats.underReview}
          iconName={"UnderReview"}
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          iconName={"Drafts"}
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          iconName={"Drafts"}
        />
      </div>
    </div>
  );
};

export default MemberDashboardClient;
