"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { IDEA_STATUS_COLORS, IDEA_STATUS_LABELS } from "@/lib/constants";
import { Edit, Trash2, Eye, Send, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { deleteIdea, updateIdea } from "@/services/idea.service";
import { useUser } from "@/hooks/useUser";
import { IIdea } from "@/type/idea.type";

export default function MyIdeas() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useUser();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      toast.success("Idea deleted successfully");
    },
    onError: () => toast.error("You can delete only DRAFT idea"),
  });

  const submitMutation = useMutation({
    mutationFn: (id: string) => updateIdea(id, { status: "UNDER_REVIEW" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      toast.success("Idea submitted for review!");
    },
    onError: () => toast.error("Failed to submit idea"),
  });

  const ideas: IIdea[] = user?.ideas || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Ideas</h1>
          <p className="text-muted-foreground">
            Manage your sustainability ideas
          </p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
          <Link href="/dashboard/member/ideas/create">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Idea
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-lg text-muted-foreground">
            You haven&apos;t created any ideas yet
          </p>
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Link href="/dashboard/member/ideas/create">
              Create Your First Idea
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ideas.map((idea) => (
                <TableRow key={idea.id}>
                  <TableCell className="font-medium max-w-50 truncate">
                    {idea.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">{idea.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={IDEA_STATUS_COLORS[idea.status] || ""}
                      variant="secondary"
                    >
                      {IDEA_STATUS_LABELS[idea.status] || idea.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {format(new Date(idea.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {idea.status === "APPROVED" && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/ideas/${idea.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {(idea.status === "DRAFT" ||
                        idea.status === "REJECTED") && (
                        <>
                          <Button variant="ghost" size="icon" asChild>
                            <Link
                              href={`/dashboard/member/ideas/${idea.id}/edit`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => submitMutation.mutate(idea.id)}
                            disabled={submitMutation.isPending}
                            title="Submit for Review"
                          >
                            <Send className="h-4 w-4 text-green-600" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Idea?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your idea.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(idea.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Feedback section for rejected ideas */}
      {ideas.some((i) => i.status === "REJECTED" && i.feedback) && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-red-600">Admin Feedback</h3>
          {ideas
            .filter((i) => i.status === "REJECTED" && i.feedback)
            .map((idea) => (
              <div
                key={idea.id}
                className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50/50 dark:bg-red-950/20"
              >
                <p className="font-medium text-sm mb-1">{idea.title}</p>
                <p className="text-sm text-muted-foreground">{idea.feedback}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
