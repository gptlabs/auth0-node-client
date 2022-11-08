import { createServer } from "http";
import { Auth0NodeConfig } from "../types";
import { getRedirectUri } from "../utils";
import { clearCache } from "../cache/cacheToken";
import { openBrowser } from "../utils/openBrowser";

export const logout = async (config: Auth0NodeConfig) => {
  const { domain, clientId } = config;
  const redirectUri = getRedirectUri(config);
  const form = new URLSearchParams({
    client_id: clientId,
    returnTo: redirectUri,
  });

  const server = createServer((req, res) => {
    res.end("<html><body><script>window.close()</script></body></html>");
    req.socket.destroy();
    server.close();
  });

  process.on("exit", () => server.close());
  server.listen(42069);

  const logoutUrl = `https://${domain}/v2/logout?${form}`;
  await openBrowser(logoutUrl);
  await clearCache(config);
};