"use client";

import { Button } from "@/components/ui/button";
import { castVote } from "@/services/idea.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoteControlProps {
  ideaId: string;
  initialVoteCount: number;
  userVote: "UPVOTE" | "DOWNVOTE" | null;
  isLoggedIn: boolean;
}

const VoteControl = ({
  ideaId,
  initialVoteCount,
  userVote,
  isLoggedIn,
}: VoteControlProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (type: "UPVOTE" | "DOWNVOTE" | null) => castVote(ideaId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    },
    onError: () => {
      toast.error("Failed to cast vote");
    },
  });

  const handleVote = (type: "UPVOTE" | "DOWNVOTE") => {
    if (!isLoggedIn) {
      toast.error("Please login to vote");
      return;
    }

    const newType = userVote === type ? null : type;
    mutation.mutate(newType);
  };

  return (
    <div className="flex items-center gap-0.5 bg-muted/40 p-1 rounded-full border border-border/50 shadow-sm backdrop-blur-sm transition-all hover:bg-muted/60">
      {/* UPVOTE */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-full transition-all duration-300",
          userVote === "UPVOTE"
            ? "text-orange-600 bg-orange-100/80 shadow-sm hover:bg-orange-200/80"
            : "text-muted-foreground hover:text-orange-600 hover:bg-orange-100/50"
        )}
        onClick={() => handleVote("UPVOTE")}
        disabled={mutation.isPending}
      >
        {mutation.isPending && userVote === null ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowBigUp
            className={cn(
              "h-5 w-5 transition-transform group-hover:-translate-y-0.5",
              userVote === "UPVOTE" && "fill-current"
            )}
          />
        )}
      </Button>

      {/* COUNT */}
      <div className="px-2 min-w-[32px] flex justify-center">
        <span className={cn(
          "font-bold text-sm tabular-nums transition-colors",
          userVote === "UPVOTE" && "text-orange-600",
          userVote === "DOWNVOTE" && "text-blue-600",
          !userVote && "text-foreground"
        )}>
          {initialVoteCount}
        </span>
      </div>

      {/* DOWNVOTE */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-full transition-all duration-300",
          userVote === "DOWNVOTE"
            ? "text-blue-600 bg-blue-100/80 shadow-sm hover:bg-blue-200/80"
            : "text-muted-foreground hover:text-blue-600 hover:bg-blue-100/50"
        )}
        onClick={() => handleVote("DOWNVOTE")}
        disabled={mutation.isPending}
      >
        <ArrowBigDown
          className={cn(
            "h-5 w-5 transition-transform group-hover:translate-y-0.5",
            userVote === "DOWNVOTE" && "fill-current"
          )}
        />
      </Button>
    </div>
  );
};

export default VoteControl;
