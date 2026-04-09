import { setCookies } from "./cookieUtils";
import { jwtUtils } from "./jwtUtils";

// Utility function to calculate how many seconds are left before a JWT token expires
export const getTokenRemaingTime = (token: string): number => {
  if (!token || token.split(".").length !== 3) {
    return 0;
  }

  try {
    const tokenPayload = jwtUtils.decodeToken(token);

    // get tokenPayload but exp is missding then how token is invalid
    if (tokenPayload && !tokenPayload?.exp) {
      return 0;
    }

    // calculate remining time before expiration
    const tokenRemaingTime =
      (tokenPayload.exp as number) - Math.floor(Date.now() / 1000);

    return tokenRemaingTime > 0 ? tokenRemaingTime : 0;
  } catch (error) {
    console.error("Error decoding token:", error);
    return 0;
  }
};

// Utility function to set a token inside cookies
export const setTokenCookie = async (
  name: string,
  token: string,
  finalMaxAgeInSecond = 60 * 60 * 24,
) => {
  let maxAgeInSecond;

  if (name !== "Batter-auth-session-token") {
    maxAgeInSecond = getTokenRemaingTime(token);
  }

  await setCookies(name, token, maxAgeInSecond || finalMaxAgeInSecond);
};

export const isTokenExpiringSoon = async (
  token: string,
  thresholdInSecond = 300, // default 5 minutes
): Promise<boolean> => {
  const remainingSeconds = getTokenRemaingTime(token);

  return remainingSeconds > 0 && remainingSeconds <= thresholdInSecond;
};

// Utility: Check if token is already expired
export const isTokenExpired = async (token: string): Promise<boolean> => {
  // Get remaining lifetime of the token
  const remainingSeconds = getTokenRemaingTime(token);

  // If remaining time is 0 or negative, token is expired
  return remainingSeconds <= 0;
};
