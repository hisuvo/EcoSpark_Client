"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getIdeas } from "@/services/idea.service";

export default function Testimonials() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["Testimonial_ideas"],
    queryFn: () => getIdeas(),
  });

  const ideasList = data?.data?.data || [];

  const topIdeas = [...ideasList]
    .filter((i) => i.status === "APPROVED")
    .sort((a, b) => b._count.votes - a._count.votes)
    .slice(0, 3);

  return (
    <section className="py-16 bg-green-50/50 dark:bg-green-950/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-green-600 mb-3">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Top Voted
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-3">Community Favorites</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The most popular sustainability ideas as chosen by our community
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {topIdeas.map((idea, index) => (
            <Card
              key={idea.id}
              className="relative overflow-hidden hover:shadow-lg transition-shadow"
            >
              {index === 0 && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                  #1 Top Voted
                </div>
              )}
              <CardHeader className="pb-2">
                <Badge
                  variant="secondary"
                  className="w-fit bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                >
                  {idea.category.name}
                </Badge>
                <h3 className="font-semibold text-lg mt-2">{idea.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {idea.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{idea._count.votes} votes</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    by {idea.author.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
