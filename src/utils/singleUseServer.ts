import { createDebugLogger } from "debug-logging";
import { createServer, IncomingMessage, RequestListener, Server, ServerResponse } from "http";

export const createTimeoutServer = <
  Request extends typeof IncomingMessage = typeof IncomingMessage,
  Response extends typeof ServerResponse = typeof ServerResponse,
>(
  requestListener?: RequestListener<Request, Response>,
  timeout = 5 * 60 * 1000,
): Server<Request, Response> => {
  const DEBUG = createDebugLogger(createTimeoutServer);
  const server = createServer(requestListener);

  const timeoutKey = setTimeout(
    () => {
      DEBUG.log("Timeout reached. Closing server.");
      server.close();
    },
    timeout
  );

  server.on(
    "close",
    () => {
      DEBUG.log("Server closed. Clearing timeout.");
      clearTimeout(timeoutKey);
    }
  );

  return server;
};

export const singleUseServer = async (
  redirectPort: number,
  displayPage: (res: IncomingMessage) => string
) => {
  const DEBUG = createDebugLogger(singleUseServer);

  return await new Promise<{
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  }>(async (resolve, reject) => {
    const server = createTimeoutServer((req, res) => {
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