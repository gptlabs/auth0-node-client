import jwtDecode from "jwt-decode";
import { User } from "auth0";
import { AuthConfig } from "../types";
import { authorizeWithBrowser, getAccessToken } from "../pkce";

/**
 * Begin an Auth0 login request.
 */
export const login = async (config: AuthConfig) => {
  const authorizationProof = await authorizeWithBrowser(config);
  /**
   * Use the challenge code to get an access token.
   */
  const accessTokenResult = await getAccessToken(config, authorizationProof);

  if (typeof accessTokenResult.id_token === "string") {
    const user: User = jwtDecode(accessTokenResult.id_token);
    return user;
  } else {
    throw new Error("Auth0 ID token not found on TokenResponse.");
  }
};