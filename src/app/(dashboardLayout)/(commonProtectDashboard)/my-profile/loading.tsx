"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="border rounded-xl p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>

        {/* Divider */}
        <Skeleton className="h-[1px] w-full" />

        {/* Account Info */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-40" />

          <div className="grid gap-5 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="space-y-1 w-full">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <Skeleton className="h-[1px] w-full" />

        {/* Metadata */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />

          <div className="grid gap-5 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
