"use client";

import React, { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import UserManagementTable from "@/components/module/admin/users/UserManagementTable";

export default function AdminManageUsersPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useUsers({
    searchTerm: search,
  });

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground">
            View and manage user accounts and permissions.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <UserManagementTable users={users} />
      )}
    </div>
  );
}
