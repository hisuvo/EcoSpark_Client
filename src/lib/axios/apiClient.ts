import axios from "axios";
import { API_BASE_URL } from "../constants";
import { ApiRequestOptions, ApiResponse } from "@/type/api.type";
import { cookies, headers } from "next/headers";
import { isTokenExpiringSoon } from "../tokenUtils";


const logHttpError = (method: string, endPoint: string, error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(`${method} request to ${endPoint} failed`, {
      status: error.response?.status,
      message: error.message,
      response: error.response?.data,
    });
    return;
  }
};

const axiosInstance = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const instance = axios.create({
    baseURL: API_BASE_URL,
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
  } catch (error) {
    logHttpError("get", endPoint, error);
    throw error;
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
  } catch (error) {
    logHttpError("Post", endPoint, error);
    throw error;
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
  } catch (error) {
    logHttpError("Put", endPoint, error);
    throw error;
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
  } catch (error) {
    logHttpError("Patch", endPoint, error);
    throw error;
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
  } catch (error) {
    logHttpError("Delete", endPoint, error);
    throw error;
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
