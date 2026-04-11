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