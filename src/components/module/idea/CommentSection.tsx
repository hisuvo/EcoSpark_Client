"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment } from "@/services/idea.service";
import { toast } from "sonner";
import { IUser } from "@/type/user.type";
import { MessageSquare, MoreVertical, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
  ideaId: string;
  comments: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
    };
  }[];
  user: IUser | null;
}

const CommentSection = ({ ideaId, comments, user }: CommentSectionProps) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  // Create Comment Mutation
  const createMutation = useMutation({
    mutationFn: (newComment: string) => createComment(ideaId, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      setContent("");
      toast.success("Feedback posted successfully");
    },
    onError: () => {
      toast.error("Failed to post feedback");
    },
  });

  // Delete Comment Mutation
  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      toast.success("Comment deleted");
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createMutation.mutate(content);
  };

  return (
    <div className="mt-16 space-y-10 border-t pt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              Community Feedback
            </h3>
            <p className="text-sm text-muted-foreground">
              {comments.length} {comments.length === 1 ? "thought" : "thoughts"} shared by innovators
            </p>
          </div>
        </div>
      </div>

      {/* Modern Comment Form */}
      {user ? (
        <Card className="overflow-hidden border-none bg-muted/30 shadow-none ring-1 ring-border transition-all focus-within:ring-primary/30">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-4 p-4 items-start">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold uppercase">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Textarea
                    placeholder="Contribute your ideas or ask a question..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[110px] w-full border-none bg-transparent p-0 py-1.5 focus-visible:ring-0 resize-none text-base leading-relaxed placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3">
                <p className="text-xs text-muted-foreground italic">
                  Posting as <span className="font-semibold text-foreground">{user.name}</span>
                </p>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || !content.trim()}
                  size="sm"
                  className="rounded-full px-5 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {createMutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      Post Thought
                      <Send className="ml-2 h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="group border-dashed bg-muted/10 transition-colors hover:bg-muted/20">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <div className="rounded-full bg-muted p-4 transition-transform group-hover:scale-110">
              <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Join the conversation</p>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Log in to share your feedback and connect with other community members.
              </p>
            </div>
            <Button variant="outline" className="rounded-full px-8" asChild>
               <a href={`/login?redirect=/ideas/${ideaId}`}>Sign in to Feedback</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Elegant Comment List */}
      <div className="space-y-8">
        {comments.length > 0 ? (
          <div className="grid gap-6">
            {comments.map((comment, index) => {
              const isOwner = user?.id === comment.author.id;
              
              return (
                <div 
                  key={comment.id} 
                  className={cn(
                    "flex gap-5 group animate-in fade-in slide-in-from-bottom-4 duration-500",
                    `delay-[${index * 50}ms]`
                  )}
                >
                  <Avatar className="h-11 w-11 border-2 border-background shadow-md shrink-0 transition-transform group-hover:scale-105">
                    <AvatarFallback className="bg-accent text-accent-foreground font-bold uppercase text-base">
                      {comment.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-foreground tracking-tight">
                            {comment.author.name}
                          </h4>
                          {isOwner && (
                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                              You
                            </span>
                          )}
                        </div>
                        {/* Static date placeholder since API doesn't provide it yet */}
                        <span className="text-[11px] text-muted-foreground/70">
                          Recently Shared
                        </span>
                      </div>

                      {isOwner && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 rounded-xl">
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                              onClick={() => deleteMutation.mutate(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    
                    <div className="relative rounded-2xl rounded-tl-none bg-card border px-5 py-4 shadow-sm group-hover:shadow-md transition-all group-hover:border-primary/20">
                      <p className="text-[15px] leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border rounded-3xl border-dashed bg-muted/5 animate-in zoom-in-95 duration-700">
            <div className="bg-muted p-5 rounded-full mb-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h4 className="font-bold text-lg text-muted-foreground/80">No voices here yet</h4>
            <p className="text-muted-foreground text-sm max-w-[250px] text-center mt-1">
              Be the pioneer who starts the discussion on this brilliant idea!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
