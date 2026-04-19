"use client";

import { logoutService } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};
