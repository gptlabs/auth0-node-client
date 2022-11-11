import { createServer } from "http";
import { Auth0NodeConfig } from "../types";
import { getRedirectUri } from "../utils";
import { clearCache } from "../cache/cacheToken";
import { openBrowser } from "../utils/openBrowser";
import { DEFAULT_REDIRECT_PORT } from "../pkce/defaults";

export const logout = async (config: Auth0NodeConfig) => {
  const { domain, clientId, redirectPort = DEFAULT_REDIRECT_PORT } = config;
  const redirectUri = getRedirectUri(config);
  const form = new URLSearchParams({
    client_id: clientId,
    returnTo: redirectUri,
  });

  await clearCache(config);

  await new Promise<void>(async (resolve) => {
    const server = createServer((req, res) => {
      res.end("<html><body><script>window.close()</script></body></html>");
      req.socket.destroy();
      server.close(() => resolve());
    });

    process.on("exit", () => server.close(() => resolve()));
    server.listen(redirectPort);

    const logoutUrl = `https://${domain}/v2/logout?${form}`;
    await openBrowser(logoutUrl);
  });
};