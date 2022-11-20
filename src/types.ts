/**
 * The configuration for the Auth0 client.
 */
export type Auth0NodeConfig = {
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
   * User is redirected to `http://localhost:{PORT}` after a successful login.
   * This must be added to the allowed callbacks urls and Allowed Origins (CORS)
   * in your Auth0 application:
   *
   * **Applications > Applications > [Your App] > Settings > Allowed Callback
   * URLs**
   */
  redirectPort?: number;
  /**
   * Due to `window.close()` constraints, the final login page cannot be closed.
   * If you would like to redirect the user somewhere other than the default
   * "logged in successfully" page, you can set this value.
   */
  postLoginRedirect?: string;
  /**
   * The scope of the token. Defaults to standard claims "openid profile email".
   *
   * @see https://auth0.com/docs/get-started/apis/scopes/sample-use-cases-scopes-and-claims
   */
  scope?: string;
    /**
   * Lets the user open the authorization URL elsewhere and paste the code on the terminal, for usage in SSH sessions.
   */
  codePrompt?: boolean;
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
