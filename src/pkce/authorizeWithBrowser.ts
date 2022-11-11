import { createServer } from "http";
import { Auth0NodeConfig, AuthorizationProof } from "../types";
import { getAuthorizationUrl } from "./getAuthorizationUrl";
import { openBrowser } from "../utils/openBrowser";
import { DEFAULT_REDIRECT_PORT } from "./defaults";

/**
 * Get an authorization code using the browser.
 */
export const authorizeWithBrowser = async (
  config: Auth0NodeConfig
): Promise<AuthorizationProof> => {
  const { redirectPort = DEFAULT_REDIRECT_PORT, postLoginRedirect } = config;
  const { authorizationUrl, verifier } = await getAuthorizationUrl(config);

  const script = (
    postLoginRedirect
      ? `window.location.href = ${JSON.stringify(postLoginRedirect)}`
      : "window.close()"
  );

  /**
   * Open the page and get the callback URL.
   */
  const code = await new Promise<string>(async (resolve, reject) => {
    const server = createServer((req, res) => {
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
        return;
      }

      const searchParams = new URLSearchParams(req.url.replace(/^\//, ""));
      const code = searchParams.get("code");

      server.close(() => {
        if (code) {
          resolve(code);
        } else {
          reject("No code found in callback URL.");
        }
      });
    });

    process.on("exit", () => server.close());
    server.listen(redirectPort);

    await openBrowser(authorizationUrl);
  });

  return { code, verifier };
};