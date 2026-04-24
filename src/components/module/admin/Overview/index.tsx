"use client";

import React from "react";
import { Users, Lightbulb, CreditCard, Activity } from "lucide-react";
import StatsCard from "./StatsCard";
import UsersTable from "./UsersTable";
import { useUsers } from "@/hooks/useUsers";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import Link from "next/link";

const AdminOverview = () => {
  const { data: usersData, isLoading: isUsersLoading } = useUsers({
    limit: 5,
  });
  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats();

  const users = usersData?.data || [];
  const stats = statsData?.data || {
    totalUsers: 0,
    totalIdeas: 0,
    totalPayments: 0,
    activeSessions: 0,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Welcome back to the admin dashboard. Here&apos;s what&apos;s happening
          today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered platform users"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Ideas"
          value={stats.totalIdeas}
          icon={Lightbulb}
          description="Innovations shared"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalPayments}`}
          icon={CreditCard}
          description="Gross platform revenue"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Now"
          value={stats.activeSessions || 42}
          icon={Activity}
          description="Current online users"
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Users</h2>
          <button className="text-sm font-medium text-primary hover:underline">
            <Link href={"admin/users"}>View all</Link>
          </button>
        </div>
        <UsersTable users={users} isLoading={isUsersLoading} />
      </div>
    </div>
  );
};

export default AdminOverview;
