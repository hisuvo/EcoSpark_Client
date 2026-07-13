import { httpClient } from "@/lib/axios/apiClient";
import {
  Blog,
  CreateBlogPayload,
  SingleBlogResponse,
  UpdateBlogPayload,
} from "@/type/blog.type";

export const getBlogs = async (): Promise<Blog[]> => {
  const response = await httpClient.get<Blog[]>("/blogs");

  return response.data;
};

export const getBlogById = async (blogId: string): Promise<Blog> => {
  const response = await httpClient.get<SingleBlogResponse>(`/blogs/${blogId}`);

  return response.data.data;
};

export const createBlog = async (payload: CreateBlogPayload): Promise<Blog> => {
  const response = await httpClient.post<SingleBlogResponse>("/blogs", payload);

  return response.data.data;
};

export const updateBlog = async (
  blogId: string,
  payload: UpdateBlogPayload,
): Promise<Blog> => {
  const response = await httpClient.put<SingleBlogResponse>(
    `/blogs/${blogId}`,
    payload,
  );

  return response.data.data;
};

export const deleteBlog = async (blogId: string): Promise<void> => {
  await httpClient.delete(`/blogs/${blogId}`);
};
