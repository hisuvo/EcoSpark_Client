"use server";

import { httpClient } from "@/lib/axios/apiClient";
import { ApiResponse } from "@/type/api.type";
import {
  ICreateIdeaPayload,
  IIdea,
  IUpdateIdeaPayload,
} from "@/type/idea.type";

export const getIdeas = async (params?: Record<string, unknown>) => {
  try {
    const response = await httpClient.get<ApiResponse<IIdea[]>>("/ideas", {
      params,
    });
    return response;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    throw error;
  }
};

export const getIdeaById = async (id: string) => {
  try {
    const response = await httpClient.get<IIdea>(`/ideas/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching idea by id:", error);
    throw error;
  }
};

export const createIdea = async (payload: ICreateIdeaPayload) => {
  try {
    const response = await httpClient.post<IIdea>("/ideas", payload);
    return response;
  } catch (error) {
    console.error("Error creating idea:", error);
    throw error;
  }
};

export const updateIdea = async (id: string, payload: IUpdateIdeaPayload) => {
  try {
    const response = await httpClient.patch<IIdea>(`/ideas/${id}`, payload);
    return response;
  } catch (error) {
    console.error("Error updating idea:", error);
    throw error;
  }
};

export const deleteIdea = async (id: string) => {
  try {
    const response = await httpClient.delete<null>(`/ideas/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting idea:", error);
    throw error;
  }
};
