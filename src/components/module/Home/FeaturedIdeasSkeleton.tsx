import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedIdeasSkeleton() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Skeleton className="h-8 w-64 mx-auto mb-3" />
          <Skeleton className="h-4 w-[400px] max-w-full mx-auto" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border rounded-xl p-4 space-y-4">
              {/* Image */}
              <Skeleton className="h-40 w-full rounded-lg" />

              {/* Title */}
              <Skeleton className="h-5 w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-8">
          <Skeleton className="h-10 w-40 mx-auto rounded-md" />
        </div>
      </div>
    </section>
  );
}
