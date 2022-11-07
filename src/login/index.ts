/* eslint-disable no-console */
import jwtDecode from "jwt-decode";
import open from "open";

import { bufferToBase64, getRandomBytes, sha256, sleep } from "../utils";
import { URLSearchParams } from "url";
import { createServer } from "http";

export type AuthConfig = {
  /**
   * The Auth0 domain for this application.
   *
   *  **Applications > Applications > [Your App] > Domain**
   */
  domain: string;
  /**
   * The client ID of the application.
   *
   * **Applications > Applications > [Your App] > Client ID**
   */
  clientId: string;
  /**
   * The API audience for this token.
   *
   * **Applications > APIs > [Your API] > API Audience**
   */
  audience: string;
  /**
   * User is redirected to this URL after a successful login. This must be added
   * to the allowed callbacks urls and Allowed Origins (CORS) in your Auth0
   * application:
   *
   * **Applications > Applications > [Your App] > Settings > Allowed Callback
   * URLs**
   */
  redirectUri: string;
};

/**
 * A code challenge and corresponding verifier.
 */
export type ChallengeProof = {
  challenge: string;
  verifier: string;
};

/**
 * An authorization code and corresponding verifier.
 */
export type AuthorizationProof = {
  code: string;
  verifier: string;
};

/**
 * Get an authorization code.
 *
 * @see https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow-with-pkce#authorize-user
 */
export const authorize = async (config: AuthConfig) => {
  const { domain, clientId, audience, redirectUri } = config;
  /**
   * Generate a codeChallenge SHA256 code challenge and verifier.
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
    */
  const form = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    audience: audience,
    code_challenge: challenge,
    code_challenge_method: "S256",
    response_type: "code",
    scope: "openid profile email",
  });

  const authorizationUrl = `https://${domain}/authorize?${form}`;
  const proof: ChallengeProof = { challenge, verifier };
  return { authorizationUrl, proof };
};

/**
 * Get an authorization code using the browser.
 */
export const getAuthorizationCode = async (
  config: AuthConfig
): Promise<AuthorizationProof> => {
  const { authorizationUrl, proof: { verifier } } = await authorize(config);
  /**
   * Open the page and get the callback URL.
   */
  const code = await new Promise<string>(async (resolve) => {
    const server = createServer((req, res) => {
      console.log(req.url);
      res.end("<html><body><script>window.close()</script></body></html>");
      req.socket.destroy();

      if (!req.url) {
        return;
      }

      const searchParams = new URLSearchParams(req.url.replace(/^\//, ""));
      const code = searchParams.get("code");

      if (code) {
        server.close(() => resolve(code));
      }
    });

    server.listen(42069, () => {
      console.log("Server listening on port 42069");
    });

    await sleep(500);
    console.log("Opening browser", authorizationUrl);
    await open(authorizationUrl, { wait: false });
  });

  return { code, verifier };
};

export const getAccessCode = async (
  config: AuthConfig
) => {
  const { domain, clientId, redirectUri } = config;
  const { code, verifier } = await getAuthorizationCode(config);

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
  const accessTokenResult =
      await fetch(
        `https://${domain}/oauth/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        }
      ).then(
        (req) => req.json()
      );

  console.log({ accessTokenResult });

  if (
    accessTokenResult &&
        accessTokenResult.access_token &&
        accessTokenResult.expires_in
  ) {
    /**
     * Retrieve the access token.
     */
    const accessToken = accessTokenResult.access_token;
    console.log({ accessToken });
    return accessTokenResult;
  } else {
    throw new Error("Auth0 Authentication Data was invalid");
  }
};


/**
 * Begin an Auth0 login request.
 */
export const login = async (config: AuthConfig) => {
  /**
   * Use the challenge code to get an access token.
   */
  const accessTokenResult = await getAccessCode(config);

  if (typeof accessTokenResult.id_token === "string") {
    const user = jwtDecode(accessTokenResult.id_token);
    console.log({ user });
  } else {
    throw new Error("ID token not found.");
  }

  console.log({ accessTokenResult });
};

