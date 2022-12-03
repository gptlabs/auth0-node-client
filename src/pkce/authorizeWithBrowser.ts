import { createServer } from "http";
import { Auth0NodeConfig, AuthorizationProof } from "../types";
import { getAuthorizationUrl } from "./getAuthorizationUrl";
import { openBrowser } from "../utils/openBrowser";
import { DEFAULT_REDIRECT_PORT } from "./defaults";
import { createDebugLogger } from "debug-logging";
import { waitForTimeout } from "../utils/singleUseServer";

/**
 * Get an authorization code using the browser.
 */
export const authorizeWithBrowser = async (
  config: Auth0NodeConfig
): Promise<AuthorizationProof> => {
  const DEBUG = createDebugLogger(authorizeWithBrowser);
  const { redirectPort = DEFAULT_REDIRECT_PORT, postLoginRedirect } = config;
  const { authorizationUrl, verifier } = await getAuthorizationUrl(config);

  const script = (
    postLoginRedirect
      ? `window.location.href = ${JSON.stringify(postLoginRedirect)}`
      : "window.close()"
  );

  let code: string | undefined;
  /**
   * Open the page and get the callback URL.
   */
  const getCode = async () => await new Promise<void>(
    async (resolve, reject) => {

      const server = createServer((req, res) => {
        DEBUG.log("Got request with headers:", req.headers);

        res.end(`
<html>
  <body style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: sans-serif;">
    <h1>Logged in!</h1>
    <p>You can close this now.</p>
    <script>${script}</script>
  </body>
</html>
      `);

        req.socket.destroy();

        if (!req.url) {
          server.close(
            () => reject(new Error("No URL in request"))
          );

          return;
        }

        const searchParams = new URLSearchParams(req.url.replace(/^\//, ""));
        const receivedCode = searchParams.get("code");

        DEBUG.log("Closing server.");
        server.close(() => {
          if (receivedCode) {
            code = receivedCode;
            resolve();
          } else {
            reject(new Error("No code found in callback URL."));
          }
        });
      });

      process.on("exit", () => {
        DEBUG.log("Process is exiting. Closing server.");
        server.close();
      });

      DEBUG.log("Starting server at port:", { redirectPort });
      server.listen(redirectPort);

      DEBUG.log("Opening browser:", { authorizationUrl });
      await openBrowser(authorizationUrl);
    }
  );

  /**
   * Wait for a code from the user, or a timeout.
   */
  await Promise.race([
    getCode(),
    waitForTimeout(),
  ]);

  if (!code) {
    throw new Error("No code found.");
  }

  return { code, verifier };
};