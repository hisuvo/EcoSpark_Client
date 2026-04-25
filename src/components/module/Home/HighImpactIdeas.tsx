"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import IdeaCard from "../idea/IdeaCard";
import FeaturedIdeasSkeleton from "./FeaturedIdeasSkeleton";
import { useIdeas } from "@/hooks/useIdeas";

export default function HighImpactIdeas() {
  const { data, isLoading, isError } = useIdeas({
    limit: 3,
    page: 1,
    status: "APPROVED",
    sortBy: "UPVOTE", // Assuming backend supports this
    sortOrder: "desc",
  });

  if (isLoading) return <FeaturedIdeasSkeleton />;

  if (isError || !data?.data || data.data.length === 0) {
    return null; // Don't show if error or no ideas
  }

  const ideas = data?.data ?? [];

  return (
    <section className="py-16 bg-green-50/50 dark:bg-green-950/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold mb-2">
            <TrendingUp className="h-5 w-5" />
            <span>Community Choice</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">High Impact Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These ideas have received the most up-votes from our community.
            Join the movement and support these high-potential projects.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/50"
          >
            <Link href="/ideas?sortBy=UPVOTE&sortOrder=desc&status=APPROVED">
              View All Trending
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
