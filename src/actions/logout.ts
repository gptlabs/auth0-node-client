import open from "open";

import { createServer } from "http";
import { AuthConfig } from "../types";

export const logout = async (config: AuthConfig) => {
  const { domain, clientId, redirectUri } = config;
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
  await open(logoutUrl);
};