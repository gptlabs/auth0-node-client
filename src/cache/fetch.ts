import nodeFetch from "node-fetch";
import { checkCache } from "./cacheToken";
import { Auth0NodeConfig } from "../types";
import { createDebugLogger } from "debug-logging";
import { env } from "process";

export const fetch = async (
  config: Auth0NodeConfig,
  ...params: Parameters<typeof nodeFetch>
) => {
  const DEBUG = createDebugLogger(fetch);

  const [url, options] = params;
  let cachedToken = await checkCache(config);

  if (!cachedToken) {
    DEBUG.log("No cached token found.");
    if (env.AUTH0_TOKEN) {
      DEBUG.log("Using AUTH0_TOKEN environment variable.");
      cachedToken = {
        access_token: env.AUTH0_TOKEN,
        expires_in: 3600,
        scope: "openid profile email",
        token_type: "Bearer",
      };
    } else {
      DEBUG.log("No cached token, no override set. Falling back to default fetch.");
      return await nodeFetch(url, options);
    }
  }

  const { access_token: accessToken, token_type: tokenType } = cachedToken;

  const response = await nodeFetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `${tokenType} ${accessToken}`,
    },
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  return response;
};