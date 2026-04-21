import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityFavoritesSkeleton() {
  return (
    <section className="py-16 bg-green-50/50 dark:bg-green-950/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-8 w-72 mx-auto mb-3" />
          <Skeleton className="h-4 w-[420px] max-w-full mx-auto" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden border rounded-xl p-4 space-y-4"
            >
              {/* Top badge (#1) */}
              {index === 0 && (
                <div className="absolute top-0 right-0">
                  <Skeleton className="h-6 w-24 rounded-bl-lg" />
                </div>
              )}

              {/* Category badge */}
              <Skeleton className="h-5 w-20 rounded-md" />

              {/* Title */}
              <Skeleton className="h-5 w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
