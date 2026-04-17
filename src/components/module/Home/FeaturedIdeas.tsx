"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ArrowRight } from "lucide-react";
import IdeaCard from "../idea/IdeaCard";
import { useQuery } from "@tanstack/react-query";
import { getIdeas } from "@/services/idea.service";

export default function FeaturedIdeas() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["Testimonial_ideas"],
    queryFn: () => getIdeas(),
  });

  const ideasList = data?.data?.data || [];

  const featuredIdeas = ideasList
    .filter((i) => i.status === "APPROVED")
    .slice(0, 6);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Featured Ideas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the latest sustainability ideas from our community members
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
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
