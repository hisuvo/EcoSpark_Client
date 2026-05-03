"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Trophy } from "lucide-react";
import CommunityFavoritesSkeleton from "@/components/module/Home/CommunityFavoritesSkeleton";
import { useIdeas } from "@/hooks/useIdeas";
import SectionHeader from "@/components/shared/SectionHeader";

export default function Testimonials() {
  const { data, isLoading, isError } = useIdeas({
    limit: 3,
    status: "APPROVED",
    sortBy: "UPVOTE",
    sortOrder: "desc",
  });

  if (isLoading) {
    return <CommunityFavoritesSkeleton />;
  }
  if (isError) {
    console.error("Failed to fetch community favorites");
  }

  const topIdeas = data?.data ?? [];

  return (
    <section className="py-24 bg-green-50/30 dark:bg-green-950/5">
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Hall of Fame"
          badgeIcon={Trophy}
          title={<>Community <span className="text-primary">Favorites</span></>}
          description="The most impactful and highly-voted sustainability ideas, as recognized by our global community."
        />

        {topIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {topIdeas.map((idea, index) => (
              <Card
                key={idea.id}
                className="relative flex flex-col h-full border-none shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden bg-card/60 backdrop-blur-md group"
              >
                {/* Ranking Badge */}
                <div className="absolute top-0 right-0 z-10">
                  <div className={`px-4 py-2 text-xs font-bold text-white rounded-bl-2xl shadow-lg ${
                    index === 0 ? "bg-amber-500" : index === 1 ? "bg-slate-400" : "bg-orange-400"
                  }`}>
                    #{index + 1} Most Voted
                  </div>
                </div>

                <CardHeader className="pb-3 space-y-3 pt-8">
                  <Badge
                    variant="outline"
                    className="w-fit border-green-200 text-green-700 bg-green-50 dark:border-green-900 dark:text-green-400 dark:bg-green-900/20 px-3 py-1"
                  >
                    {idea.category.name}
                  </Badge>

                  <h3 className="font-bold text-xl leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {idea.title}
                  </h3>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 pb-6">
                  <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed mb-6">
                    {idea.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
                      <ThumbsUp className="h-5 w-5" />
                      <span className="text-lg">{idea._count.votes}</span>
                    </div>

                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {idea.author.name.charAt(0)}
                       </div>
                       <span className="text-xs font-medium text-muted-foreground truncate max-w-[100px]">
                        {idea.author.name}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 dark:bg-black/20 rounded-3xl border border-dashed border-muted-foreground/20 max-w-4xl mx-auto">
            <p className="text-muted-foreground italic">No top-voted ideas yet. Start voting to see them here!</p>
          </div>
        )}
      </div>
    </section>
  );
}
