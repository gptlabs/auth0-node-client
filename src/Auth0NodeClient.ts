import type fetch from "node-fetch";
import { isAuthorized, login, logout } from "./actions";
import { authFetch } from "./cache";
import { AuthConfig } from "./types";

/**
 * An Auth0 Node client for logging in/out, checking authorization state, and
 * making authenticated requests.
 */
export class Auth0NodeClient {
  constructor(
    private readonly config: AuthConfig,
  ) {}

  /**
   * Log the user in using the browser.
   */
  public async login() {
    return await login(this.config);
  }

  /**
   * Log the user out using the browser.
   */
  public async logout() {
    return await logout(this.config);
  }

  /**
   * Check whether the user is currently authorized.
   */
  public async isAuthorized() {
    return await isAuthorized(this.config);
  }

  /**
   * Make an authenticated fetch request.
   */
  public async fetch(...params: Parameters<typeof fetch>) {
    return await authFetch(this.config, ...params);
  }
}