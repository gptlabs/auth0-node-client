import { DEFAULT_TOKEN_SCOPE } from "./defaults";
import { bufferToBase64, getRandomBytes, getRedirectUri, sha256 } from "../utils";
import { Auth0NodeConfig } from "../types";

/**
 * Get an authorization code.
 *
 * @see https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce#authorize-user
 */
export const getAuthorizationUrl = async (config: Auth0NodeConfig) => {
  const {
    domain,
    clientId,
    audience,
    scope = DEFAULT_TOKEN_SCOPE
  } = config;

  const redirectUri = getRedirectUri(config);

  /**
   * Generate a codeChallenge SHA256 code challenge.
   *
   * @see https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce#create-code-verifier
   */
  const verifier = bufferToBase64(await getRandomBytes(32));

  /**
   * Create a SHA256 code challenge.
   *
   * @see https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce#create-code-challenge
   */
  const challenge = bufferToBase64(await sha256(verifier));

  /**
   * Next, make a request to authorize the user in the browser.
   *
   * @see https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce#example-authorization-url
   */
  const form = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    audience: audience,
    code_challenge: challenge,
    code_challenge_method: "S256",
    response_type: "code",
    scope,
  });

  const authorizationUrl = `https://${domain}/authorize?${form}`;
  return { authorizationUrl, verifier };
};