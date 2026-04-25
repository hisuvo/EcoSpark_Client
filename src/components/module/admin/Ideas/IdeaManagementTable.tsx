"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Trash2,
  Loader2,
} from "lucide-react";
import { IIdea, IdeaStatus } from "@/type/idea.type";
import {
  useUpdateIdeaStatus,
  useDeleteComment,
} from "@/hooks/useIdeaManagement";
import RejectFeedbackModal from "./RejectFeedbackModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IdeaManagementTableProps {
  ideas: IIdea[];
}

export default function IdeaManagementTable({
  ideas,
}: IdeaManagementTableProps) {
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateIdeaStatus();
  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteComment();

  const [selectedIdea, setSelectedIdea] = useState<IIdea | null>(null);
  const [updatingIdeaId, setUpdatingIdeaId] = useState<string | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  const handleStatusUpdate = (
    id: string,
    status: IdeaStatus,
    feedback?: string,
  ) => {
    setUpdatingIdeaId(id);
    updateStatus(
      { id, status, feedback },
      {
        onSettled: () => setUpdatingIdeaId(null),
      }
    );
    setIsRejectModalOpen(false);
  };

  const openRejectModal = (idea: IIdea) => {
    setSelectedIdea(idea);
    setIsRejectModalOpen(true);
  };

  const openCommentsModal = (idea: IIdea) => {
    setSelectedIdea(idea);
    setIsCommentsModalOpen(true);
  };

  const getStatusBadge = (status: IdeaStatus) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "UNDER_REVIEW":
        return <Badge className="bg-blue-500">Under Review</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Votes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-muted-foreground"
              >
                No ideas found.
              </TableCell>
            </TableRow>
          ) : (
            ideas.map((idea) => (
              <TableRow key={idea.id}>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {idea.title}
                </TableCell>
                <TableCell>{idea.author.name}</TableCell>
                <TableCell>{idea.category.name}</TableCell>
                <TableCell>{idea._count?.votes || 0}</TableCell>
                <TableCell>{getStatusBadge(idea.status)}</TableCell>
                <TableCell className="text-right">
                  {updatingIdeaId === idea.id ? (
                    <div className="flex justify-end pr-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(`/ideas/${idea.id}`, "_blank")
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Idea
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openCommentsModal(idea)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" /> Manage
                          Comments
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(idea.id, "APPROVED")}
                          disabled={
                            idea.status === "APPROVED" || isUpdatingStatus
                          }
                          className="text-green-600 focus:text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openRejectModal(idea)}
                          disabled={
                            idea.status === "REJECTED" || isUpdatingStatus
                          }
                          className="text-red-600 focus:text-red-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(idea.id, "UNDER_REVIEW")
                          }
                          disabled={
                            idea.status === "UNDER_REVIEW" || isUpdatingStatus
                          }
                          className="text-blue-600 focus:text-blue-600"
                        >
                          <Clock className="mr-2 h-4 w-4" /> Under Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Reject Modal */}
      {selectedIdea && (
        <RejectFeedbackModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={(feedback) =>
            handleStatusUpdate(selectedIdea.id, "REJECTED", feedback)
          }
          isLoading={isUpdatingStatus}
        />
      )}

      {/* Comments Modal */}
      <Dialog open={isCommentsModalOpen} onOpenChange={setIsCommentsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>`Comments for ${selectedIdea?.title}`</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] mt-4 pr-4">
            {selectedIdea?.comments && selectedIdea.comments.length > 0 ? (
              <div className="space-y-4">
                {selectedIdea.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex justify-between items-start border-b pb-2"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        {comment.author.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {comment.content}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteComment(comment.id)}
                      disabled={isDeletingComment}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-muted-foreground">
                No comments found.
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
