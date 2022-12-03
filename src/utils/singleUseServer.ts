import { createDebugLogger } from "debug-logging";
import { createServer, IncomingMessage, ServerResponse } from "http";

/**
 * 5 minute timeout.
 */
const TIMEOUT = 5 * (60 * 1000);
export const waitForTimeout = async () => await new Promise((_, reject) => {
  setTimeout(
    () => reject(new Error("Server timed out.")),
    TIMEOUT
  );
});

export const singleUseServer = async (
  redirectPort: number,
  displayPage: (res: IncomingMessage) => string
) => {
  const DEBUG = createDebugLogger(singleUseServer);

  const waitForServer = async () => await new Promise<{
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  }>(async (resolve, reject) => {
    const server = createServer((req, res) => {
      DEBUG.log("Got request with headers:", req.headers);

      res.end(displayPage(req));
      req.socket.destroy();

      if (!req.url) {
        server.close(
          () => reject(new Error("No URL in request"))
        );

        return;
      }

      DEBUG.log("Closing server.");
      server.close(() => resolve({ req, res }));
    });

    process.on("exit", () => {
      DEBUG.log("Process is exiting. Closing server.");
      server.close();
    });

    DEBUG.log("Starting server at port:", { redirectPort });
    server.listen(redirectPort);
  });

  return await Promise.race([
    waitForServer(),
    waitForTimeout(),
  ]);
};