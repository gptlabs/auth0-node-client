import { createDebugLogger } from "debug-logging";
import { createServer, IncomingMessage, ServerResponse } from "http";

export const singleUseServer = async (
  redirectPort: number,
  displayPage: (res: IncomingMessage) => string
) => {
  const DEBUG = createDebugLogger(singleUseServer);

  return await new Promise<{
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
};