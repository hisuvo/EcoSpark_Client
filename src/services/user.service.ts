"use server";

import { httpClient } from "@/lib/axios/apiClient";
import { IUser } from "@/type/user.type";

export const getAllUsers = async (params?: Record<string, unknown>) => {
  const response = await httpClient.get<IUser[]>("/users", { params });
  return response;
};

export const getAdminStats = async () => {
  try {
    const response = await httpClient.get<any>("/admin/stats");
    return response;
  } catch (error) {
    console.warn("Failed to fetch admin stats, using fallback", error);
    return {
      success: true,
      message: "Fallback stats",
      data: {
        totalUsers: 0,
        totalIdeas: 0,
        totalPayments: 0,
        recentActivity: []
      }
    };
  }
};
export const updateUserStatus = async (id: string, status: string) => {
  try {
    const response = await httpClient.patch<IUser>(`/users/${id}/status`, {
      status,
    });
    return response;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

export const changeUserRole = async (id: string, role: string) => {
  try {
    const response = await httpClient.patch<IUser>(`/users/${id}/role`, {
      role,
    });
    return response;
  } catch (error) {
    console.error("Error changing user role:", error);
    throw error;
  }
};
