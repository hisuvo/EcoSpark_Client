"use server";

import { httpClient } from "@/lib/axios/apiClient";
import { ApiResponse } from "@/type/api.type";
import {
  ICreateIdeaPayload,
  IIdea,
  IIdeaResponse,
  IUpdateIdeaPayload,
  IdeaStatus,
} from "@/type/idea.type";

export const getIdeas = async (
  params?: Record<string, unknown>,
): Promise<IIdeaResponse> => {
  try {
    const response = await httpClient.get<ApiResponse<IIdea[]>>("/ideas", {
      params,
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
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

export const updateIdeaStatus = async (
  id: string,
  status: IdeaStatus,
  feedback?: string,
) => {
  try {
    const response = await httpClient.patch<IIdea>(`/ideas/${id}`, {
      status,
      feedback,
    });
    return response;
  } catch (error) {
    console.error("Error updating idea status:", error);
    throw error;
  }
};

export const createComment = async (ideaId: string, content: string) => {
  try {
    const response = await httpClient.post(`/comments/${ideaId}/comments`, {
      content,
    });
    return response;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const response = await httpClient.delete<null>(`/comments/${commentId}`);
    return response;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const castVote = async (
  ideaId: string,
  type: "UPVOTE" | "DOWNVOTE" | null,
) => {
  try {
    const response = await httpClient.post(`/votes/${ideaId}/vote`, {
      type,
    });
    return response;
  } catch (error) {
    console.error("Error casting vote:", error);
    throw error;
  }
};
