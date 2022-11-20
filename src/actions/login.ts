import jwtDecode from "jwt-decode";
import { TokenResponse, User } from "auth0";
import { Auth0NodeConfig } from "../types";
import { authorizeWithBrowser, authorizeWithCode, getAccessToken } from "../pkce";
import { checkCache } from "../cache";

/**
 * Begin an Auth0 login request.
 */
export const login = async (config: Auth0NodeConfig) => {
  let accessToken: TokenResponse;
  const cachedToken = await checkCache(config);
  if (cachedToken) {
    accessToken = cachedToken;
  } else {
    /**
     * Get an authorization code.
     */
    let authorizationProof;
    if (config.codePrompt) {
      authorizationProof = await authorizeWithCode(config);
    } else {
      authorizationProof = await authorizeWithBrowser(config);
    }
    /**
     * Use the authorization code to get an access token.
     */
    const newAccessToken = await getAccessToken(config, authorizationProof);
    accessToken = newAccessToken;
  }


  if (accessToken.id_token) {
    const user: User = jwtDecode(accessToken.id_token);
    return user;
  } else {
    throw new Error("Auth0 ID token not found on TokenResponse.");
  }
};