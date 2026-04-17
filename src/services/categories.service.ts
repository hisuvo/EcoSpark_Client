"use server";

import { httpClient } from "@/lib/axios/apiClient";
import { ICategory } from "@/type/category.type";

export const getCategories = async (params?: Record<string, unknown>) => {
  const response = await httpClient.get<ICategory[]>("/categories", params);
  return response;
};
