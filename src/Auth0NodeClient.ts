import type nodeFetch from "node-fetch";

import { generateAuthorizationProof, login, logout } from "./actions";
import { fetch, getUser, isAuthorized } from "./cache";
import { Auth0NodeConfig } from "./types";

/**
 * An Auth0 Node client for logging in/out, checking authorization state, and
 * making authenticated requests.
 */
export class Auth0NodeClient {
  constructor(
    private readonly config: Auth0NodeConfig,
  ) {}

  /**
   * Log the user in.
   *
   * @param authorizationProof If the user has authorized on another device,
   * this is the proof that they have authorized.
   */
  public async login(authorizationProof?: string) {
    return await login(this.config, authorizationProof);
  }

  /**
   * Generates an authorization proof for a user to log in on another device.
   */
  public async authorize() {
    return await generateAuthorizationProof(this.config);
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

  public async getUser() {
    return await getUser(this.config);
  }

  /**
   * Make an authenticated fetch request.
   */
  public async fetch(...params: Parameters<typeof nodeFetch>) {
    return await fetch(this.config, ...params);
  }
}