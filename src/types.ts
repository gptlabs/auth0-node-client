/**
 * The configuration for the Auth0 client.
 */
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
  /**
   * The scope of the token. Defaults to standard claims "openid profile email".
   *
   * @see https://auth0.com/docs/get-started/apis/scopes/sample-use-cases-scopes-and-claims
   */
  scope?: string;
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
