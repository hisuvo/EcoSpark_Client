/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_BASE_URL } from "../constants";
import { ApiRequestOptions, ApiResponse } from "@/type/api.type";
import { cookies } from "next/headers";

const logHttpError = (method: string, endPoint: string, error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(
      `[API Error] ${method.toUpperCase()} to ${endPoint} failed:`,
      {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data,
        url: error.config?.url || endPoint,
        code: error.code,
      },
    );
  } else {
    console.error(
      `[API Error] Non-Axios error during ${method} to ${endPoint}:`,
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error,
    );
  }
};

const axiosInstance = async () => {
  let cookieHeader = "";
  try {
    const cookieStore = await cookies();
    cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
  } catch (error) {
    // In build time or static generation, cookies() may throw. 
    // We swallow this as there's no session to pass anyway.
    console.warn("[API Client] Cookies not available in current context.");
  }

  const instance = axios.create({
    baseURL: API_BASE_URL || "http://localhost:5000/api/v1",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
  });

  return instance;
};

const httpGet = async <TData>(
  endPoint: string,
  option?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.get<ApiResponse<TData>>(endPoint, {
      params: option?.params,
      headers: option?.headers,
    });

    return response.data;
  } catch (error: any) {
    logHttpError("get", endPoint, error);
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to fetch data",
    );
  }
};

const httpPost = async <TData>(
  endPoint: string,
  data: unknown,
  option?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(endPoint, data, {
      params: option?.params,
      headers: option?.headers,
    });

    return response.data;
  } catch (error: any) {
    logHttpError("Post", endPoint, error);
    throw new Error(
      error?.response?.data?.message || error.message || "Request failed",
    );
  }
};

const httpPut = async <TData>(
  endPoint: string,
  data: unknown,
  option?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.put<ApiResponse<TData>>(endPoint, data, {
      params: option?.params,
      headers: option?.headers,
    });

    return response.data;
  } catch (error: any) {
    logHttpError("Put", endPoint, error);
    throw new Error(
      error?.response?.data?.message || error.message || "Request failed",
    );
  }
};

const httpPatch = async <TData>(
  endPoint: string,
  data: unknown,
  option?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.patch<ApiResponse<TData>>(endPoint, data, {
      params: option?.params,
      headers: option?.headers,
    });

    return response.data;
  } catch (error: any) {
    logHttpError("Patch", endPoint, error);
    throw new Error(
      error?.response?.data?.message || error.message || "Request failed",
    );
  }
};

const httpDelete = async <TData>(
  endPoint: string,
  option?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.delete<ApiResponse<TData>>(endPoint, {
      params: option?.params,
      headers: option?.headers,
    });

    return response.data;
  } catch (error: any) {
    logHttpError("Delete", endPoint, error);
    throw new Error(
      error?.response?.data?.message || error.message || "Request failed",
    );
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
