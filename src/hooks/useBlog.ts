"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/services/blog.service";
import { CreateBlogPayload, UpdateBlogPayload } from "@/type/blog.type";

// GET ALL

export const useBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });
};

// GET SINGLE

export const useBlog = (blogId: string) => {
  return useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => getBlogById(blogId),
    enabled: !!blogId,
  });
};

// CREATE

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogPayload) => createBlog(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
    },
  });
};

// UPDATE

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      blogId,
      data,
    }: {
      blogId: string;
      data: UpdateBlogPayload;
    }) => updateBlog(blogId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["blog", variables.blogId],
      });
    },
  });
};

// DELETE

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blogId: string) => deleteBlog(blogId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["blogs"],
      });
    },
  });
};
