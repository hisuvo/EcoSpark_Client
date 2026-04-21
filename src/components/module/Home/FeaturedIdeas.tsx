"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import IdeaCard from "../idea/IdeaCard";
import FeaturedIdeasSkeleton from "./FeaturedIdeasSkeleton";
import { useIdeas } from "@/hooks/useIdeas";

export default function FeaturedIdeas() {
  //pass params to hook (server-side filtering)
  const { data, isLoading, isError } = useIdeas({
    limit: 6,
    page: 1,
    status: "APPROVED",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isLoading) return <FeaturedIdeasSkeleton />;

  if (isError) {
    return (
      <div className="text-center py-20 text-destructive">
        Failed to load featured ideas
      </div>
    );
  }

  const ideas = data?.data ?? [];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Featured Ideas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the latest sustainability ideas from our community members
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/50"
          >
            <Link href="/ideas">
              View All Ideas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
