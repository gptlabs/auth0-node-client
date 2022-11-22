import { DEFAULT_REDIRECT_PORT } from "../pkce/defaults";
import { Auth0NodeConfig } from "../types";
import { getAuthorizationUrl } from "../pkce/getAuthorizationUrl";
import { createDebugLogger } from "debug-logging";
import { singleUseServer } from "../utils/singleUserServer";
import { openBrowser } from "../utils/openBrowser";
import { success } from "@tsmodule/log";

/**
 * Get an authorization code by letting the user input it.
 */
export const generateAuthorizationProof = async (
  config: Auth0NodeConfig
): Promise<void> => {
  const DEBUG = createDebugLogger(generateAuthorizationProof);
  const { authorizationUrl, verifier } = await getAuthorizationUrl(config);
  const { redirectPort = DEFAULT_REDIRECT_PORT } = config;

  DEBUG.log("Generating authorization proof.");
  setTimeout(() => openBrowser(authorizationUrl), 500);

  await singleUseServer(redirectPort, (req) => {
    if (!req.url) {
      throw new Error("No URL in request");
    }

    const searchParams = new URLSearchParams(req.url.replace(/^\//, ""));
    const code = searchParams.get("code");
    if (!code) {
      throw new Error("No code found in callback URL.");
    }

    const base64 = Buffer.from(JSON.stringify({ code, verifier })).toString("base64");

    return `
<html>
  <body style="height: 100%; display: flex; flex-direction: column; gap: 24px; justify-content: center; align-items: center; font-family: sans-serif; font-weight: lighter;">
    <h1>Authorization Code</h1>
    <p>Use the <code style="font-size: 14px;">authorize</code> on your other machine.</p>
    <div></div>
    <strong>Click to copy.</strong>
    <code style="overflow-wrap: anywhere; padding: 1rem; cursor: pointer; font-size: 24px; max-width: 368px; overflow: hidden; text-overflow: ellipsis;" onclick="navigator.clipboard.writeText(this.innerText)">
      ${base64}
    </code>
  </body>
</html>
      `;
  });

  success("Displayed authorization code successfully.");
};