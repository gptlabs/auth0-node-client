import fetch from "node-fetch";

import { TokenResponse } from "auth0";
import { createDebugLogger, log } from "debug-logging";
import { AuthConfig, AuthorizationProof } from "../types";
import { cacheToken, checkCache } from "../cache/cacheToken";

/**
 * Get a new access token from Auth0.
 */
export const getAccessToken = async (
  config: AuthConfig,
  authorizationProof: AuthorizationProof
): Promise<TokenResponse> => {
  const DEBUG = createDebugLogger(getAccessToken);

  /**
   * First, try the cache.
   */
  const cached = await checkCache(config);
  if (cached) {
    DEBUG.log("Returning cached token response.");
    return cached;
  }

  DEBUG.log("No cached token response found. Creating new session.");

  const { domain, clientId, redirectUri } = config;
  const { code, verifier } = authorizationProof;

  /**
   * Create the access token request payload.
   *
   * @see https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce#request-tokens
   */
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code_verifier: verifier,
    code: code,
    redirect_uri: redirectUri,
  });

  /**
   * Make the access token request.
   */
  const tokenResponse =
      await fetch(
        `https://${domain}/oauth/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        }
      ).then(
        (req) => req.json()
      ) as TokenResponse;

  if (tokenResponse && tokenResponse.access_token) {
    log("Logged in successfully.");
    await cacheToken(config, tokenResponse);
    return tokenResponse;
  } else {
    throw new Error("Auth0 TokenResponse was not valid.");
  }
};