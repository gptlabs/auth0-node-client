import { AuthConfig } from "../types";
import { checkCache } from "./cacheToken";

/**
 * Returns whether the user has an existing session.
 */
export const isAuthorized = async (config: AuthConfig) => {
  const cachedToken = await checkCache(config);
  return Boolean(cachedToken);
};