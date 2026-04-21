"use client";

import { useQuery } from "@tanstack/react-query";
import { getIdeas } from "@/services/idea.service";
import { IIdea } from "@/type/idea.type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StatsCard from "@/shared/form/StatsCard";
import { useUser } from "@/hooks/useUser";

const MemberDashboardClient = () => {
  const { data: user, isLoading } = useUser();

  const ideas: IIdea[] = user?.ideas || [];

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
      total: ideas.length || 0,
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
        <StatsCard
          title="Total"
          value={stats.total}
          iconName="FileText"
          className="bg-blue-100 dark:bg-blue-900/30"
        />

        <StatsCard
          title="Drafts"
          value={stats.drafts}
          iconName={"Lightbulb"}
          className="bg-gray-100 dark:bg-gray-800"
        />

        <StatsCard
          title="Under Review"
          value={stats.underReview}
          iconName={"Clock"}
          className="bg-yellow-100 dark:bg-yellow-900/30"
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          iconName={"CheckCircle"}
          className="bg-green-100 dark:bg-green-900/30"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          iconName={"XCircle"}
          className="bg-red-100 dark:bg-red-900/30"
        />
      </div>
    </div>
  );
};

export default MemberDashboardClient;
