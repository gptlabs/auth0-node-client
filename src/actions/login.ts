import jwtDecode from "jwt-decode";
import { User } from "auth0";
import { AuthConfig } from "../types";
import { getAccessCode } from "../lib/getAccessCode";

/**
 * Begin an Auth0 login request.
 */
export const login = async (config: AuthConfig) => {
  /**
   * Use the challenge code to get an access token.
   */
  const accessTokenResult = await getAccessCode(config);

  if (typeof accessTokenResult.id_token === "string") {
    const user: User = jwtDecode(accessTokenResult.id_token);
    return user;
  } else {
    throw new Error("Auth0 ID token not found on TokenResponse.");
  }
};