import { ApiErrorResponse } from "./api.type";
import { IUser } from "./user.type";

export type LoginSuccessResponse = {
  success: true;
  token: string;
  accessToken: string;
  refreshToken: string;
  user: IUser;
};

export type LoginErrorResponse = {
  success: false;
  message: string;
};

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export interface ChangePasswordSuccessResponse {
  success: boolean;
  message: string;
  token: string;
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export type ChangePasswordResponse =
  | ChangePasswordSuccessResponse
  | ApiErrorResponse;
