"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import IdeaCard from "../idea/IdeaCard";
import FeaturedIdeasSkeleton from "./FeaturedIdeasSkeleton";
import { useIdeas } from "@/hooks/useIdeas";
import SectionHeader from "@/components/shared/SectionHeader";

export default function HighImpactIdeas() {
  const { data, isLoading, isError } = useIdeas({
    limit: 3,
    page: 1,
    status: "APPROVED",
    sortBy: "UPVOTE",
    sortOrder: "desc",
  });

  if (isLoading) return <FeaturedIdeasSkeleton />;
  if (isError) {
    console.error("Failed to fetch high impact ideas");
  }

  const ideas = data?.data ?? [];

  return (
    <section className="py-24 bg-gradient-to-b from-green-50/50 to-white dark:from-green-950/10 dark:to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <SectionHeader
          badge="Trending Now"
          badgeIcon={TrendingUp}
          title={<>High Impact <span className="text-primary">Sustainability</span> Projects</>}
          description="Discover the most supported ideas that are paving the way for a greener future. Join the community in backing these high-potential initiatives."
        />

        {/* Grid or Empty State */}
        {ideas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 transition-all duration-300"
              >
                <Link href="/ideas?sortBy=UPVOTE&sortOrder=desc&status=APPROVED">
                  Explore More Trending Ideas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
            <div className="text-5xl mb-4">🍃</div>
            <h3 className="text-xl font-semibold mb-2">No High-Impact Ideas Yet</h3>
            <p className="text-muted-foreground">Be the first to share a groundbreaking eco-friendly idea!</p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/dashboard/post-idea">Post an Idea</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
