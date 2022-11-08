import fetch from "node-fetch";
import { checkCache } from "../cache/cacheToken";
import { AuthConfig } from "../types";

export const authFetch = async (
  config: AuthConfig,
  ...params: Parameters<typeof fetch>
) => {
  const [url, options] = params;
  const cachedToken = await checkCache(config);

  if (!cachedToken) {
    throw new Error("User does not have existing session.");
  }

  const { access_token: accessToken, token_type: tokenType } = cachedToken;

  const response = await fetch(url, {
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