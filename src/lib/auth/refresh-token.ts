import { API_BASE_URL } from "../constants";

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
}

export const performHeadlessTokenRefresh = async (
  refreshToken: string,
  sessionToken?: string,
): Promise<RefreshTokenResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}${
          sessionToken ? `; better-auth.session_token=${sessionToken}` : ""
        }`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Headless refresh failed:", error);
    return null;
  }
};
