import { Auth0NodeConfig } from "../types";
import { DEFAULT_REDIRECT_PORT } from "../pkce/defaults";

export const getRedirectUri = (config: Auth0NodeConfig) => {
  const { redirectPort = DEFAULT_REDIRECT_PORT } = config;
  return `http://localhost:${redirectPort}`;
};