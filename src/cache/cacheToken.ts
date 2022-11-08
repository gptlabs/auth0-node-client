import { TokenResponse } from "auth0";
import { existsSync } from "fs";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import { homedir } from "os";
import { dirname, resolve } from "path";

import { createDebugLogger } from "debug-logging";
import { Auth0NodeConfig } from "../types";

const CACHE_DIR = resolve(homedir(), ".config", "auth0");

export type CachedResponse = {
  tokenData: TokenResponse;
  expiresAt: number;
};

const safeFilename = (str: string) => str.replace(/[^a-z0-9_\.]/gi, "_").toLowerCase();

export const getCachePath = (config: Auth0NodeConfig) => {
  const { domain, clientId } = config;
  const cachePath = resolve(
    CACHE_DIR,
    safeFilename(domain),
    safeFilename(clientId),
    "access_token.json"
  );

  return cachePath;
};

export const clearCache = async (config: Auth0NodeConfig) => {
  const DEBUG = createDebugLogger(clearCache);
  const cachePath = getCachePath(config);

  if (existsSync(cachePath)) {
    DEBUG.log("Removing existing cached token response at", { cachePath });
    await unlink(cachePath);
  }
};

export const cacheToken = async (
  config: Auth0NodeConfig,
  tokenData: TokenResponse
) => {
  const DEBUG = createDebugLogger(cacheToken);
  const cachePath = getCachePath(config);
  const cacheDir = dirname(cachePath);

  if (!existsSync(cacheDir)) {
    DEBUG.log("Creating cache directory at", { cacheDir });
    await mkdir(cacheDir, { recursive: true });
  }

  await clearCache(config);

  const cachedResponse: CachedResponse = {
    tokenData,
    expiresAt: Date.now() + tokenData.expires_in * 1000,
  };

  await writeFile(cachePath, JSON.stringify(cachedResponse));
  DEBUG.log("Cached token response to", { cachePath });
};

/**
 * Check whether a valid access token is cached, and if so, return it.
 */
export const checkCache = async (config: Auth0NodeConfig) => {
  const DEBUG = createDebugLogger(checkCache);
  const cachePath = getCachePath(config);

  if (existsSync(cachePath)) {
    DEBUG.log("Found cached token response at", { cachePath });
    const tokenResponse = JSON.parse(await readFile(cachePath, "utf8")) as CachedResponse;

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
      return tokenResponse.tokenData;
    }
  }

  return null;
};