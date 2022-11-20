import { Auth0NodeConfig, AuthorizationProof } from "../types";
import { getAuthorizationUrl } from "./getAuthorizationUrl";
import { createDebugLogger } from "debug-logging";
import { codePrompt } from "../utils/codePrompt";

/**
 * Get an authorization code by letting the user input it.
 */
export const authorizeWithCode = async (
  config: Auth0NodeConfig
): Promise<AuthorizationProof> => {
  const DEBUG = createDebugLogger(authorizeWithCode);
  const { authorizationUrl, verifier } = await getAuthorizationUrl(config);

  DEBUG.log("Prompting for the authorization code");
  const code = await codePrompt(authorizationUrl);

  if (!code) {
    throw new Error("Did not provide authorization code.");
  }

  return { code, verifier };
};