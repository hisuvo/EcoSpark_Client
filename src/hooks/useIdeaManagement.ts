/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIdeaStatus, deleteComment } from "@/services/idea.service";
import { IdeaStatus } from "@/type/idea.type";
import { toast } from "sonner";

export const useUpdateIdeaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      feedback,
    }: {
      id: string;
      status: IdeaStatus;
      feedback?: string;
    }) => updateIdeaStatus(id, status, feedback),
    onMutate: () => {
      return { toastId: toast.loading("Updating idea status...") };
    },
    onSuccess: async (_, __, context) => {
      await queryClient.invalidateQueries({ queryKey: ["ideas"] });
      toast.success("Idea status updated successfully", {
        id: context?.toastId,
      });
    },
    onError: (error: any, __, context) => {
      console.error(error?.response?.data?.message);
      toast.error("Failed to update status", {
        id: context?.toastId,
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onMutate: () => {
      return { toastId: toast.loading("Deleting comment...") };
    },
    onSuccess: async (_, __, context) => {
      await queryClient.invalidateQueries({ queryKey: ["ideas"] });
      toast.success("Comment deleted successfully", { id: context?.toastId });
    },
    onError: (error: any, __, context) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete comment",
        { id: context?.toastId },
      );
    },
  });
};
