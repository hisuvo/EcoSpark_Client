"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import IdeaCard from "../idea/IdeaCard";
import FeaturedIdeasSkeleton from "./FeaturedIdeasSkeleton";
import { useIdeas } from "@/hooks/useIdeas";
import SectionHeader from "@/components/shared/SectionHeader";
import { Sparkles } from "lucide-react";

export default function FeaturedIdeas() {
  const { data, isLoading, isError } = useIdeas({
    limit: 6,
    page: 1,
    status: "APPROVED",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isLoading) return <FeaturedIdeasSkeleton />;

  const ideas = data?.data ?? [];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <SectionHeader
          badge="Innovation Hub"
          badgeIcon={Sparkles}
          title={
            <>
              Featured <span className="text-primary">Sustainable</span> Ideas
            </>
          }
          description="Explore the latest and most innovative solutions shared by our global community of eco-innovators."
          className="mb-0"
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
                <Link href="/ideas" className="flex items-center">
                  Browse All Ideas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-muted/10 rounded-3xl border border-border">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold mb-2">
              No Featured Ideas Found
            </h3>
            <p className="text-muted-foreground">
              We are waiting for the next big sustainable idea to be shared.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
