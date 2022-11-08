import jwtDecode from "jwt-decode";
import { User } from "auth0";
import { Auth0NodeConfig } from "../types";
import { checkCache } from "./cacheToken";

/**
 * Get the logged-in user, or `null` if not logged in.
 */
export const getUser = async (config: Auth0NodeConfig) => {
  const cached = await checkCache(config);

  if (cached?.id_token) {
    const user: User = jwtDecode(cached.id_token);
    return user;
  }

  return null;
};