"use server";

import { httpClient } from "@/lib/axios/apiClient";
import { ApiResponse } from "@/type/api.type";
import {
  ICategory,
  ICategoryCreatePayload,
  ICategoryUpdatePayload,
} from "@/type/category.type";

export const getCategories = async (params?: Record<string, unknown>) => {
  const response = await httpClient.get<ApiResponse<ICategory[]>>(
    "/categories",
    { params },
  );

  return response.data;
};

export const createCategory = async (params: ICategoryCreatePayload) => {
  try {
    const response = await httpClient.post<ICategory>("/categories", params);
    return response;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  params: ICategoryUpdatePayload,
) => {
  try {
    const response = await httpClient.patch<ICategory>(
      `/categories/${id}`,
      params,
    );
    return response;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await httpClient.delete<void>(`/categories/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
