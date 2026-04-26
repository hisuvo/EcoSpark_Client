/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus, changeUserRole } from "@/services/user.service";
import { toast } from "sonner";

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateUserStatus(id, status),
    onMutate: () => {
      return { toastId: toast.loading("Updating user status...") };
    },
    onSuccess: async (_, __, context) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated successfully", {
        id: context?.toastId,
      });
    },
    onError: (error: any, __, context) => {
      console.error(error?.response?.data?.message);
      toast.error("Failed to update user status", { id: context?.toastId });
    },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      changeUserRole(id, role),
    onMutate: () => {
      return { toastId: toast.loading("Changing user role...") };
    },
    onSuccess: async (_, __, context) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated successfully", {
        id: context?.toastId,
      });
    },
    onError: (error: any, __, context) => {
      console.error(error?.response?.data?.message);
      toast.error("Failed to change user role", { id: context?.toastId });
    },
  });
};
