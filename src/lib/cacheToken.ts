import { TokenResponse } from "auth0";
import { existsSync } from "fs";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import { homedir } from "os";
import { dirname, resolve } from "path";

import { createDebugLogger } from "debug-logging";

const CACHE_FILE = resolve(homedir(), ".config", "auth0", "access_token.json");
const CACHE_PATH = dirname(CACHE_FILE);

type CachedResponse = {
  tokenData: TokenResponse;
  expiresAt: number;
};

export const clearCache = async () => {
  const DEBUG = createDebugLogger(clearCache);
  if (existsSync(CACHE_FILE)) {
    DEBUG.log("Removing existing cached token response at", { CACHE_FILE });
    await unlink(CACHE_FILE);
  }
};

export const cacheToken = async (tokenData: TokenResponse) => {
  const DEBUG = createDebugLogger(cacheToken);
  const cachedResponse: CachedResponse = {
    tokenData,
    expiresAt: Date.now() + tokenData.expires_in * 1000,
  };

  if (!existsSync(CACHE_PATH)) {
    DEBUG.log("Creating cache directory at", { CACHE_PATH });
    await mkdir(CACHE_PATH, { recursive: true });
  }

  await clearCache();

  await writeFile(CACHE_FILE, JSON.stringify(cachedResponse));
  DEBUG.log("Cached token response to", { CACHE_FILE });
};

/**
 * Check whether a valid access token is cached, and if so, return it.
 */
export const checkCache = async () => {
  const DEBUG = createDebugLogger(checkCache);
  if (existsSync(CACHE_FILE)) {
    DEBUG.log("Found cached token response at", { CACHE_FILE });
    const tokenResponse = JSON.parse(await readFile(CACHE_FILE, "utf8")) as CachedResponse;

    if (
      tokenResponse &&
      tokenResponse.tokenData
    ) {
      DEBUG.log("Cached token response has token data.");

      if (tokenResponse.expiresAt <= Date.now()) {
        DEBUG.log("Cached token response has expired.");
        return null;
      }

      DEBUG.log("Cached token response is valid.");
      return tokenResponse;
    }
  }

  return null;
};