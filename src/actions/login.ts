import jwtDecode from "jwt-decode";
import { TokenResponse, User } from "auth0";
import { Auth0NodeConfig, AuthorizationProof } from "../types";
import { authorizeWithBrowser, getAccessToken } from "../pkce";
import { checkCache } from "../cache";

/**
 * Begin an Auth0 login request.
 */
export const login = async (
  config: Auth0NodeConfig,
  authorizationProofHex?: string
) => {
  let accessToken: TokenResponse;
  const cachedToken = await checkCache(config);
  let authorizationProof: AuthorizationProof;
  if (cachedToken) {
    accessToken = cachedToken;
  } else {
    /**
     * Get an authorization code.
     */
    if (authorizationProofHex) {
      authorizationProof = JSON.parse(Buffer.from(authorizationProofHex, "hex").toString("utf8"));
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